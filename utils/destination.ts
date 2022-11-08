import { NextRouter } from "next/router";

export const destinationWithParams = (router: NextRouter, url?: string) => {
    const destination = router.query.page?.toString() || '/';
    if(url) return `${url}?page=${destination}`;
    return destination;
  }