"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoyagerClient = void 0;
const tokengen_util_1 = require("../utils/tokengen.util");
class VoyagerClient {
    #cookie;
    #headers;
    #slug;
    constructor(cookie) {
        this.#cookie = cookie;
        const token = (0, tokengen_util_1.generateToken)();
        this.#headers = new Headers();
        this.#headers.append("accept", " application/vnd.linkedin.normalized+json+2.1");
        // TODO: Figure out gzip issue not decompressing
        // this.#headers.append("accept-encoding", " gzip, deflate, br");
        this.#headers.append("cookie", `li_at=${cookie}; JSESSIONID=\"ajax:${token}\";`);
        this.#headers.append("csrf-token", `ajax:${token}`);
        this.#slug = null;
    }
    async getProfile(slug, mode) {
        if (!slug && !this.#slug) {
            throw new Error("No slug specified");
        }
        this.#slug = slug;
        const url = `https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${slug}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-85&start=0&count=100`;
        const response = await fetch(url, {
            method: 'GET',
            headers: this.#headers,
            redirect: 'follow'
        });
        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        const urn = data.data['*elements'][0];
        const profileData = data.included.find((item) => (item.$type === 'com.linkedin.voyager.dash.identity.profile.Profile' && item.publicIdentifier === slug));
        const name = `${profileData.firstName} ${profileData.lastName}`;
        const headline = profileData.headline;
        const location = profileData.locationName;
        const profilePictureBase = profileData.profilePicture.displayImageReference.vectorImage;
        const profilePicture = `${profilePictureBase.rootUrl}${profilePictureBase.artifacts[profilePictureBase.artifacts.length - 1].fileIdentifyingUrlPathSegment}`;
        const profileUrl = profileData.publicIdentifier;
        const summary = profileData.summary;
        let experience = [];
        if (mode === 'full' || mode === 'experience') {
            experience = await this.#getExperience(urn);
        }
        else {
            experience = data.included
                .filter((item) => item.$type === 'com.linkedin.voyager.dash.identity.profile.Position')
                .map((item) => this.#mapExperience(item));
        }
        const education = data.included
            .filter((item) => item.$type === 'com.linkedin.voyager.dash.identity.profile.Education')
            .map((item) => this.#mapEducation(item));
        const skills = data.included
            .filter((item) => item.$type === 'com.linkedin.voyager.dash.identity.profile.Skill')
            .map((item) => item.name);
        const profile = {
            name,
            headline,
            location,
            profilePicture,
            profileUrl,
            summary,
            experience,
            education,
            skills,
        };
        return profile;
    }
    async #getExperience(urn) {
        const url = `https://www.linkedin.com/voyager/api/graphql?variables=(profileUrn:${encodeURIComponent(urn)},sectionType:experience)&&queryId=voyagerIdentityDashProfileComponents.8f78e9eb2da12e72fba436b33455eae3`;
        const response = await fetch(url, {
            method: 'GET',
            headers: this.#headers,
            redirect: 'follow'
        });
        if (!response.ok) {
            throw new Error("Failed to fetch experience");
        }
        const data = await response.json();
        const subExperience = data.included.find((item) => item.decorationType === 'NONE');
        const experience = data.included.find((item) => item.decorationType === 'LINE_SEPARATED').components.elements.map((item) => this.#mapFullExperience(item, subExperience)).flat();
        return experience;
    }
    #mapExperience(item) {
        const startDate = this.#getDateString(item.dateRange.start);
        const endDate = this.#getDateString(item.dateRange.end) || 'Present';
        return {
            title: item.title,
            company: item.companyName,
            location: item.locationName,
            tenure: `${startDate} - ${endDate}`,
            description: item.description
        };
    }
    #mapFullExperience(item, sub) {
        const base = item.components.entityComponent;
        if (!base.metadata && sub) {
            const originLink = base.textActionTarget;
            const matching = sub.components.elements.filter((item) => item.components.entityComponent.textActionTarget === originLink);
            const company = base.title.text;
            const location = base.caption.text;
            return matching.map((item) => {
                const base = item.components.entityComponent;
                return {
                    title: base.title.text,
                    tenure: base.caption.text,
                    company,
                    location,
                    description: base.subComponents.components[0].components.fixedListComponent.components[0].components.textComponent.text.text
                };
            });
        }
        const title = base.title.text;
        const tenure = base.caption.text;
        const company = base.subtitle.text;
        const description = base.subComponents && base.subComponents.components[0].components.fixedListComponent ? base.subComponents.components[0].components.fixedListComponent.components[0].components.textComponent.text.text : null;
        return {
            title,
            tenure,
            company,
            description
        };
    }
    #mapEducation(item) {
        let startDate, endDate;
        if (item.dateRange) {
            startDate = this.#getDateString(item.dateRange.start);
            endDate = this.#getDateString(item.dateRange.end) || 'Present';
        }
        return {
            school: item.schoolName,
            degree: item.degreeName,
            fieldOfStudy: item.fieldOfStudy,
            startDate: startDate || null,
            endDate: endDate || null,
            description: item.description
        };
    }
    #getDateString = (date) => {
        let dateString = '';
        if (date && date.year) {
            dateString = date.month
                ? `${date.year}-${date.month}`
                : `${date.year}`;
        }
        return dateString;
    };
}
exports.VoyagerClient = VoyagerClient;
//# sourceMappingURL=voyager.client.js.map