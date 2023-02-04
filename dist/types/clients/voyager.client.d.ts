import { GetProfileOptions, Profile } from "../types";
export declare class VoyagerClient {
    #private;
    constructor(cookie: string);
    getProfile(slug: string, mode?: GetProfileOptions): Promise<Profile>;
}
