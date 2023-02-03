export class CookiesError extends Error {
  constructor(message = "There's a problem with the cookies you provided") {
    super(message);
    this.name = "CookiesError";
  }
}

export class PageNotFound extends Error {
  constructor(message = "The page you requested was not found") {
    super(message);
    this.name = "PageNotFound";
  }
}