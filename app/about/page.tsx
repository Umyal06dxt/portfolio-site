import type { Metadata } from "next";
import AboutPage from "@/components/about-page";

export const metadata: Metadata = {
  title: "About Umyal Dixit — CS Student & Emotion AI Researcher",
  description:
    "Umyal Dixit is a CS student from Gurugram researching emotion AI, building deepfake detection (Veris) and AI companions (Sukku). Available for research collaborations and internships.",
  keywords: [
    "Umyal Dixit about",
    "AI researcher Gurugram",
    "emotion AI researcher India",
    "CS student AI builder",
    "machine learning internship India",
    "Veris deepfake",
    "Sukku AI companion",
    "full stack AI developer",
    "PyTorch researcher India",
  ],
  alternates: {
    canonical: "https://www.dixitumyal.com/about",
  },
  openGraph: {
    title: "About Umyal Dixit — CS Student & Emotion AI Researcher",
    description:
      "CS student from Gurugram researching 26-class emotion AI, building Veris (deepfake detection) and Sukku (AI companion). Available for research collaborations.",
    url: "https://www.dixitumyal.com/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
