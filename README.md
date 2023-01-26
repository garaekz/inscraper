
# InScraper
### A playwright based LinkedIn based scraper

This is (currently) a small library built in typescript in order to scrape LinkedIn profiles using the vanity URL (slug or custom URL) using Playwright and Cheerio.

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

-   `getProfile(profileSlug: string)`: Returns the profile information of the user with the given profile slug, including their name, headline, about and experience sections.
    
-   `getExperience(profileSlug: string)`: Returns the experience of the user with the given profile slug.
    
-   `getBrowser(): Browser`: Returns the Playwright browser instance.
    
-   `getContext(): BrowserContext`: Returns the Playwright context instance.
    
-   `close()`: Closes the Playwright browser.

Get some profile info:

```
const profile = await client.getProfile('profile-slug');
console.log(profile);

const experience = await client.getExperience('profile-slug);
console.log(experience);
```

You can also use the `getBrowser()`  and  `getContext()` methods to perform other actions with Playwright and the `close()` method to close the browser when you are done scraping. Note that if the provided cookie is invalid, the library will throw an error, 'Cookies error'

## Full Example
```
import { createClient } from 'linkedin-scraper';

const cookieString = 'YOUR_COOKIE_HERE';
const client = await createClient(cookieString);

const profile = await client.getProfile('profile-slug');
console.log(profile);

const experience = await client.getExperience('profile-slug');
console.log(experience);
await client.close()
```
## Compatibility 
This library uses Playwright, which is compatible with Chromium, Firefox and Webkit. For this implementation, Chromium is being used.

## Dependencies
This library depends on playwright, playwright-extra, puppeteer-extra-plugin-stealth and cheerio.

## Contributions
Your contributions are always welcome! Please feel free to submit a pull request or open an issue.

## Features
- [x] Work with Cookies
- [x] Get basic info from Profile
- [ ] Extend it to try and use voyager API (see if that's still a thing)
- [ ] Add a test suite
- [ ] Add more features to this list
- [ ] Check if people like this and work on people recommendations 😅

## License
This library is provided under the [MIT License](https://opensource.org/licenses/MIT).

## Contact 
Please feel free to contact me if you have any questions or issues. 
## Additional notes
Please be aware that web scraping may be against the terms of service of LinkedIn, try to use a side account because it may get you banned (haven't see that yet but could be).

This is a work in progress and only with educational purposes, correct information handling is not a joke.