import imageUrlBuilder from "@sanity/image-url";
import client from "../../src/client";
export default function urlFor(source: any) {
    const builder = imageUrlBuilder(client)
    return builder.image(source).auto('format')
}
