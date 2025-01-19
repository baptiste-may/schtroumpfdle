import {MetadataRoute} from "next";
import {URL} from "./metadata.ts";

export default function robots(): MetadataRoute.Robots {
    return {
        host: URL,
        sitemap: `${URL}/sitemap.xml`,
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/api/",
        }
    };
}