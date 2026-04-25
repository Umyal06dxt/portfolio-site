const siteUrl = "https://www.dixitumyal.com";

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Umyal Dixit",
  url: siteUrl,
  email: "umyal06dixit@gmail.com",
  jobTitle: "AI Researcher & CS Student",
  description:
    "CS student from Gurugram building at the intersection of AI and human emotion. Maker of Veris (deepfake detection), Sukku (AI companion), and 26-class emotion AI research. 10× hackathon winner.",
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Emotion AI",
    "Computer Vision",
    "Natural Language Processing",
    "Web3",
    "Blockchain",
    "Hardware Engineering",
    "Full Stack Development",
    "PyTorch",
    "Deep Learning",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Gurugram",
    addressRegion: "Haryana",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/Umyal06dxt",
    "https://linkedin.com/in/umyal-dixit",
  ],
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Umyal Dixit",
  url: siteUrl,
  description:
    "Portfolio of Umyal Dixit — AI researcher and builder from Gurugram, India.",
  author: { "@type": "Person", name: "Umyal Dixit" },
};

const projectList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Projects by Umyal Dixit",
  url: `${siteUrl}/projects`,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "Veris",
        description:
          "Hardware-first proof of photographic authenticity built for the age of deepfakes. Uses Web3 and blockchain for immutable chain of custody.",
        applicationCategory: "SecurityApplication",
        keywords: "deepfake detection, blockchain, computer vision, Web3, hardware",
        author: { "@type": "Person", name: "Umyal Dixit" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "SoftwareApplication",
        name: "Sukku",
        description:
          "An AI companion that is proactive, emotionally aware, and contextually intelligent. Fuses Edge AI, NLP, Computer Vision, and Behavioral Modeling.",
        applicationCategory: "AIApplication",
        keywords: "AI companion, edge AI, NLP, emotion AI, behavioral modeling",
        author: { "@type": "Person", name: "Umyal Dixit" },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "SoftwareApplication",
        name: "Emotion Classification Model",
        description:
          "Deep learning system classifying 26 complex human facial emotions using PyTorch, attention mechanisms, and OpenCV.",
        applicationCategory: "ResearchApplication",
        keywords: "emotion AI, facial emotion recognition, deep learning, PyTorch, computer vision",
        author: { "@type": "Person", name: "Umyal Dixit" },
      },
    },
  ],
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectList) }}
      />
    </>
  );
}
