import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Umyal Dixit — AI Researcher & Builder",
    short_name: "Umyal Dixit",
    description:
      "CS student from Gurugram building at the intersection of AI and human emotion.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#ff5f1f",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
