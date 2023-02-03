"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageNotFound = exports.CookiesError = void 0;
class CookiesError extends Error {
    constructor(message = "There's a problem with the cookies you provided") {
        super(message);
        this.name = "CookiesError";
    }
}
exports.CookiesError = CookiesError;
class PageNotFound extends Error {
    constructor(message = "The page you requested was not found") {
        super(message);
        this.name = "PageNotFound";
    }
}
exports.PageNotFound = PageNotFound;
//# sourceMappingURL=errors.js.map