import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TravelLoop",
    short_name: "TravelLoop",
    description: "Your smart travel companion for planning trips, discovering places, and exploring new destinations.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0B5CFF",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192 512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "192x192 512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
