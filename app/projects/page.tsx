import type { Metadata } from "next";
import ProjectsPage from "@/components/projects-page";

export const metadata: Metadata = {
  title: "Projects — Veris, Sukku, Emotion AI",
  description:
    "Explore projects by Umyal Dixit: Veris (hardware deepfake detection using Web3 and blockchain), Sukku (proactive emotion-aware AI companion), 26-class emotion classification model, wound diagnosis CV system, and sun-tracking solar hardware.",
  keywords: [
    "Veris deepfake detection",
    "Sukku AI companion",
    "emotion classification model",
    "26 class emotion AI",
    "computer vision projects India",
    "Web3 blockchain hardware",
    "PyTorch emotion recognition",
    "AI projects portfolio India",
    "edge AI companion",
    "wound detection computer vision",
    "solar panel Arduino",
    "Umyal Dixit projects",
  ],
  alternates: {
    canonical: "https://www.dixitumyal.com/projects",
  },
  openGraph: {
    title: "Projects — Veris, Sukku, Emotion AI | Umyal Dixit",
    description:
      "Veris: hardware deepfake detection. Sukku: proactive AI companion. 26-class emotion AI. Computer vision for medical diagnosis. Sun-tracking solar hardware.",
    url: "https://www.dixitumyal.com/projects",
  },
};

export default function Page() {
  return <ProjectsPage />;
}
