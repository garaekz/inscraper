export class CookiesError extends Error {
  constructor(message = "There's a problem with the cookies you provided") {
    super(message);
    this.name = "CookiesError";
  }
}