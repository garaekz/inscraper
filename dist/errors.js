"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookiesError = void 0;
class CookiesError extends Error {
    constructor(message = "There's a problem with the cookies you provided") {
        super(message);
        this.name = "CookiesError";
    }
}
exports.CookiesError = CookiesError;
//# sourceMappingURL=errors.js.map