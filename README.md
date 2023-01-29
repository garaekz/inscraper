

# InScraper
### A playwright based LinkedIn based scraper

This is (currently) a small library built in typescript in order to scrape LinkedIn profiles using the vanity URL (slug or custom URL) using Playwright ~~and Cheerio~~.

I'm trying to stick to semver but I'm not sure if I'm doing it right, so please be aware that this library is still in development and the API may change.

## Why?
I was looking for a way to get some information from LinkedIn profiles and I found that there are some libraries that do that, but they are not maintained anymore and they use Puppeteer, which is a bit slow and heavy. I wanted to try Playwright, which is a new library that is built on top of Chromium, Firefox and Webkit, so it's faster and lighter than Puppeteer. I also wanted to try to use TypeScript, so I decided to build this library. I hope you find it useful.

## Disclaimer
This library is provided as is, without any warranty. I am not responsible for any misuse of this library. Please be aware that web scraping may be against the terms of service of LinkedIn, try to use a side account because it may get you banned (haven't see that yet but could be).

## Installation

    npm install inscraper
Using Yarn:

     yarn add inscraper

## Usage
 To use the library, you will need to provide a valid LinkedIn cookie. You can obtain this by logging into LinkedIn and inspecting the cookies in your browser, search for the one called `li_at`. Once you have the cookie, you can pass it to the `createClient` function, which will return an instance of the `Client` class.

    import { createClient } from  'inscraper';
   
    const cookieString = 'YOUR_COOKIE_HERE';
    const client = await  createClient(cookieString);

 The `Client` class has the following methods:

-   `getProfile(slug: string)`: Returns the profile information of the user with the given profile slug, including their name, headline, about and experience sections.
    
-   `getExperience(slug: string)`: Returns only the experience of the user with the given profile slug.

-   `getScreenshot()`: You can use this method to get a screenshot of the current page. This is useful if you want to see what the page looks like after you have performed some actions. It only works if you have called the `getProfile` or `getExperience` methods before. It's built on top of Playwright's `screenshot` method, so you can pass the same options to it. See [Playwright's documentation](https://playwright.dev/docs/api/class-page#page-screenshot) for more information.


Get some profile info:

```
const profile = await client.getProfile('profile-slug');
console.log(profile);

const experience = await client.getExperience('profile-slug);
console.log(experience);
```

Note that if the provided cookie is invalid, the library will throw an error, 'Cookies error'

## Full Example
```
import fs from "fs";
import { PageScreenshotOptions } from 'playwright';
import { createClient } from "inscraper/client";

const cookieString = 'YOUR_COOKIE_HERE';
const client = await createClient(cookieString);

const slug = 'profile-slug';

const profile = await client.getProfile(slug);
console.log(profile);
const options: PageScreenshotOptions = {
  type: "png",
  fullPage: true,
}
const buffer = await profile.getScreenshot(options)
fs.writeFileSync(`screenshots/${slug}.png`, buffer);

const experience = await client.getExperience(slug);
console.log(experience);
await client.close()
```
## Compatibility 
This library uses Playwright, which is compatible with Chromium, Firefox and Webkit. For this implementation, Chromium is being used.

## Dependencies
This library depends on playwright ~~and cheerio~~.

## Contributions
Your contributions are always welcome! Please feel free to submit a pull request or open an issue.

## Features
- [x] Work with Cookies
- [x] Get basic info from Profile
- [x] Get Experience from Profile
- [ ] Get Education from Profile
- [ ] Get Skills from Profile
- [ ] Get Recommendations from Profile
- [x] Get Screenshots of a visited profile
- [ ] Extend it to try and use voyager API (see if that's still a thing)
- [ ] Add a test suite
- [ ] Add more features to this list
- [ ] Check if people like this and work on people recommendations 😅

## License
This library is provided under the [MIT License](https://opensource.org/licenses/MIT).

## Contact 
Please feel free to contact me if you have any questions or issues. 
