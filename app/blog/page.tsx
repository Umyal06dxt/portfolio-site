import Navbar from "@/components/navbar";

const posts = [
  {
    id: 1,
    title: "Building Low-Poly Avatars with Three.js and No 3D Files",
    date: "2026-04-01",
    readTime: "6 min",
    tags: ["Three.js", "WebGL", "React"],
    excerpt: "How I built a fully procedural low-poly character using raw BufferGeometry — no .glb, no Blender, just math.",
    featured: true,
  },
  {
    id: 2,
    title: "Scroll-Driven Animations with Framer Motion: A Deep Dive",
    date: "2026-03-15",
    readTime: "5 min",
    tags: ["Framer Motion", "React"],
    excerpt: "useScroll + useTransform: the pattern that powers every scroll-linked animation on this site.",
    featured: false,
  },
  {
    id: 3,
    title: "Why I Design in Code First",
    date: "2026-03-01",
    readTime: "4 min",
    tags: ["Design", "Tailwind"],
    excerpt: "Figma is great for exploring. But the real design decisions happen in the browser.",
    featured: false,
  },
  {
    id: 4,
    title: "Building Real-Time AI Tutors for Kids",
    date: "2026-02-10",
    readTime: "7 min",
    tags: ["AI", "Python", "Next.js"],
    excerpt: "Architecture decisions behind a live video learning platform with AI co-teachers.",
    featured: false,
  },
  {
    id: 5,
    title: "Tailwind v4: What Actually Changed",
    date: "2026-01-20",
    readTime: "3 min",
    tags: ["Tailwind", "CSS"],
    excerpt: "A practical breakdown of what's different in v4 and what it means for your workflow.",
    featured: false,
  },
];

interface Post {
  id: number;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  featured: boolean;
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 border border-white/10 font-mono text-[9px] text-white/40 uppercase tracking-widest">
      {label}
    </span>
  );
}

function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  return (
    <div
      className={`border border-white/[0.08] bg-[#080808] p-6 flex flex-col gap-4 hover:border-[#E85002]/40 transition-colors ${
        featured ? "row-span-2" : ""
      }`}
    >
      <div
        className="w-full bg-gradient-to-br from-[#E85002]/10 to-white/[0.03] flex items-center justify-center border-b border-white/[0.06]"
        style={{ height: featured ? 200 : 120 }}
      >
        <span className="font-mono text-[10px] text-[#E85002]/60 uppercase tracking-widest">{post.tags[0]}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {post.tags.map((t) => <TagChip key={t} label={t} />)}
      </div>
      <h3 className={`font-display font-bold uppercase tracking-tight leading-tight ${featured ? "text-2xl" : "text-base"} text-white`}>
        {post.title}
      </h3>
      <p className="font-mono text-xs text-white/40 leading-relaxed">{post.excerpt}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">{post.date} · {post.readTime}</span>
        <span className="font-mono text-[10px] text-[#E85002] tracking-widest">Read More →</span>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Hero header */}
      <div className="pt-28 pb-16 px-8 md:px-16 border-b border-white/[0.06]">
        <span className="font-mono text-[10px] text-[#E85002] tracking-widest uppercase">// Writing</span>
        <h1 className="font-display font-black text-5xl md:text-8xl uppercase tracking-tighter mt-4 leading-[0.9]">
          WORDS FROM THE <span className="text-[#E85002]">TERMINAL.</span>
        </h1>
        <div className="flex flex-wrap gap-2 mt-8">
          {["Three.js", "React", "AI", "Design", "Next.js", "CSS"].map((tag) => (
            <span key={tag} className="px-3 py-1.5 border border-white/10 font-mono text-[10px] text-white/40 uppercase tracking-widest hover:text-[#E85002] hover:border-[#E85002]/40 transition-colors cursor-default">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-8 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Featured - spans 2 rows */}
          <div className="md:row-span-2">
            <PostCard post={featured} featured />
          </div>
          {rest.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
