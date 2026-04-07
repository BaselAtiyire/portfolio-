import { useEffect, useMemo, useRef, useState } from "react";

/* ─── tokens ─── */
const C = {
  bg: "#04080f",
  surface: "rgba(255,255,255,0.035)",
  surfaceHover: "rgba(255,255,255,0.055)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(99,179,237,0.45)",
  accent: "#63b3ed",
  accentDim: "rgba(99,179,237,0.15)",
  accentGrad: "linear-gradient(135deg,#63b3ed,#4fd1c5)",
  text: "#f0f4f8",
  muted: "#718096",
  subtle: "#a0aec0",
  green: "#68d391",
  greenDim: "rgba(104,211,145,0.12)",
  red: "#fc8181",
  redDim: "rgba(252,129,129,0.12)",
};

/* ─── icons ─── */
const Icon = ({ name, size = 16 }) => {
  const s = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", display: "block", flexShrink: 0 };
  const icons = {
    github: <svg {...s}><path d="M9 19c-4 1.5-4-2.5-5-3m10 6v-3.5c0-1 .1-1.4-.5-2 2-.2 4-1 4-4.5 0-1-.3-2-1-2.7.1-.3.4-1.5-.1-2.8 0 0-.8-.3-2.9 1.1-.8-.2-1.6-.3-2.5-.3s-1.7.1-2.5.3C6.4 5.7 5.6 6 5.6 6c-.5 1.3-.2 2.5-.1 2.8-.7.7-1 1.7-1 2.7 0 3.5 2 4.3 4 4.5-.4.4-.6.9-.6 1.7V22" /></svg>,
    linkedin: <svg {...s}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2" /><path d="M2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>,
    mail: <svg {...s}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></svg>,
    external: <svg {...s}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>,
    arrow: <svg {...s}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
    chip: <svg {...s}><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M7 9H4M7 12H4M7 15H4M17 9h3M17 12h3M17 15h3M9 7V4M12 7V4M15 7V4M9 17v3M12 17v3M15 17v3" /></svg>,
    chart: <svg {...s}><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
    code: <svg {...s}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    db: <svg {...s}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>,
    cloud: <svg {...s}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>,
    brain: <svg {...s}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66" /></svg>,
    book: <svg {...s}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    award: <svg {...s}><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>,
    up: <svg {...s}><polyline points="18 15 12 9 6 15" /></svg>,
    down: <svg {...s}><polyline points="6 9 12 15 18 9" /></svg>,
    menu: <svg {...s}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
    close: <svg {...s}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    copy: <svg {...s}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
    check: <svg {...s}><polyline points="20 6 9 17 4 12" /></svg>,
  };
  return icons[name] || null;
};

/* ─── reveal on scroll ─── */
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.08 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
};

/* ─── tag pill ─── */
const Tag = ({ children, accent }) => (
  <span style={{
    fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
    padding: "3px 9px", borderRadius: 999,
    background: accent ? C.accentDim : "rgba(255,255,255,0.06)",
    border: `1px solid ${accent ? "rgba(99,179,237,0.3)" : C.border}`,
    color: accent ? C.accent : C.subtle, whiteSpace: "nowrap",
  }}>{children}</span>
);

/* ─── section wrapper ─── */
const Section = ({ id, children, style = {} }) => (
  <section id={id} style={{ borderTop: `1px solid ${C.border}`, ...style }}>
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>{children}</div>
  </section>
);

const SectionHead = ({ label, title, subtitle }) => (
  <Reveal>
    <div style={{ marginBottom: 48 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, marginBottom: 10 }}>{label}</div>}
      <h2 style={{ fontSize: 30, fontWeight: 700, color: C.text, margin: "0 0 12px", lineHeight: 1.25 }}>{title}</h2>
      {subtitle && <p style={{ color: C.muted, margin: 0, maxWidth: 560, lineHeight: 1.7 }}>{subtitle}</p>}
    </div>
  </Reveal>
);

/* ─── card ─── */
const Card = ({ children, style = {}, hover = true }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: hov ? C.surfaceHover : C.surface,
        border: `1px solid ${hov ? C.borderHover : C.border}`,
        borderRadius: 16, padding: "24px",
        transition: "all 0.22s ease",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        ...style,
      }}
    >{children}</div>
  );
};

/* ─── projects data ─── */
const PROJECTS = [
  {
    title: "HRMS Agent",
    oneLiner: "Production AI agent for HR management — deployed on AWS ECS Fargate with full IaC",
    desc: "AI-powered Human Resource Management System with a Claude agentic loop. Multi-step planning, persistent memory, proactive alerts, and role-based workflows — fully deployed on AWS with Terraform IaC and GitHub Actions CI/CD.",
    tech: ["FastAPI", "REST API", "Claude Sonnet", "SQLite", "Docker", "AWS ECS Fargate", "Terraform", "GitHub Actions", "MCP", "Streamlit"],
    tags: ["Agentic AI", "AWS", "IaC", "CI/CD", "Full-Stack"],
    live: "https://hrms.basilatiyire.com",
    github: "https://github.com/BaselAtiyire/hrms-agent",
    metrics: [
      "Claude agent orchestrates 12 tools across employee, ticket, leave & onboarding workflows",
      "56% infrastructure cost reduction (~$62 → ~$27/month) via NAT Gateway elimination",
      "Full CI/CD: every git push auto-builds, pushes to ECR, and deploys to ECS Fargate",
      "38 AWS resources provisioned via Terraform — ALB, ECS, EFS, ECR, Secrets Manager, CloudWatch",
    ],
    featured: true,
  },
  {
    title: "Financial AI Research Platform",
    oneLiner: "Production-grade RAG & document intelligence for financial workflows",
    desc: "End-to-end AI platform for financial document extraction, source-grounded RAG, forecasting, sentiment analysis, valuation workflows, and market intelligence automation.",
    tech: ["FastAPI", "REST API", "LangChain", "ChromaDB", "LLM", "Python", "Streamlit"],
    tags: ["LLM", "RAG", "Finance", "API"],
    live: "https://financial-ai-research-platform-v2-xcjjodytrwynpcjglvebff.streamlit.app/",
    github: "https://github.com/BaselAtiyire/financial-ai-research-platform-v2",
    metrics: ["Reduced manual research steps by combining 5+ financial workflows", "Source-grounded multi-doc Q&A delivered in ~3s", "Supports extraction, RAG, forecasting, sentiment & valuation"],
    featured: true,
  },
  {
    title: "LLM-Enhanced Quantitative Portfolio Intelligence",
    oneLiner: "AI-driven portfolio analytics fused with LLM narrative reasoning",
    desc: "Quant portfolio analytics augmented with LLM narratives for faster, interpretable investment insights.",
    tech: ["Python", "Streamlit", "LLM", "Quant", "Analytics"],
    tags: ["LLM", "Analytics", "Finance"],
    live: "https://llm-enhanced-quantitative-portfolio-intelligence-engine-e385ca.streamlit.app/",
    github: "https://github.com/BaselAtiyire/LLM-Enhanced-Quantitative-Portfolio-Intelligence-Engine",
    metrics: ["Automated 12+ portfolio KPIs (Sharpe, Sortino, CAGR, Beta…)", "Reduced manual analysis from ~5 min to <30s per run", "Grounded LLM narratives aligned with computed metrics"],
    featured: true,
  },
  {
    title: "Vector Search Chat App",
    oneLiner: "Semantic document chat powered by embeddings & vector retrieval",
    desc: "Embedding-based semantic search enabling conversational Q&A over document chunks.",
    tech: ["Vector DB", "Embeddings", "Streamlit"],
    tags: ["Embeddings", "Semantic Search", "RAG"],
    live: "https://vectorrag-ai.streamlit.app/",
    github: "https://github.com/BaselAtiyire/vector-rag-streamlit",
    metrics: ["Chat across 100+ document chunks via embedding retrieval", "~30% latency reduction via vector indexing + caching", "~85% retrieval accuracy on evaluation queries"],
    featured: true,
  },
  {
    title: "Real Estate RAG Assistant",
    oneLiner: "Production-oriented RAG for property research & document Q&A",
    desc: "Retrieval-Augmented Generation assistant for real estate research and document grounded answers.",
    tech: ["LangChain", "ChromaDB", "RAG", "Streamlit"],
    tags: ["RAG", "Vector DB", "LangChain"],
    live: "https://baselatiyire-real-estate-rag-assistant-app-ejmnhc.streamlit.app/",
    github: "https://github.com/BaselAtiyire/real-estate-rag-assistant",
    metrics: ["~30% retrieval relevance improvement via chunking + embedding tuning", "Semantic answers in ~2.5s via vector indexing", "Multi-source indexing with citation-ready outputs"],
    featured: true,
  },
  {
    title: "Amazon E-commerce Chatbot",
    oneLiner: "LLM-powered conversational shopping assistant",
    desc: "LLM-powered shopping assistant for product discovery and recommendations in an Amazon-style experience.",
    tech: ["Python", "Streamlit", "LLM", "NLP"],
    tags: ["LLM", "Chatbot"],
    live: "https://baselatiyire-amazon-ecommerce-chatbot-app-owvq1r.streamlit.app/",
    github: "https://github.com/BaselAtiyire/amazon-ecommerce-chatbot",
    metrics: ["~35% latency reduction via prompt optimization + caching", "~88% relevant recommendations on 50+ eval queries", "Multi-turn session memory for shopping conversations"],
    featured: false,
  },
  {
    title: "EmotionVision AI",
    oneLiner: "Deep learning system for facial emotion recognition",
    desc: "AI-powered emotion recognition predicting facial expressions from images using a CNN pipeline.",
    tech: ["Python", "TensorFlow", "OpenCV", "CNN", "Streamlit"],
    tags: ["AI", "Computer Vision"],
    live: "https://emotionvision-ai-appkcrrtrbwvwwkmdthwwvc.streamlit.app/",
    github: "https://github.com/BaselAtiyire/emotionvision-ai",
    metrics: ["CNN-based emotion classification on facial expressions", "Real-time interactive inference via Streamlit", "Fast prediction display for uploaded facial images"],
    featured: false,
  },
  {
    title: "Stock Market Analysis in Python",
    oneLiner: "End-to-end analytics pipeline for market indicators & trends",
    desc: "Market analytics pipeline covering cleaning, visualization, indicators, and insights from historical data.",
    tech: ["Python", "Pandas", "Matplotlib", "NumPy", "Jupyter"],
    tags: ["Data", "Analytics"],
    live: "#",
    github: "https://github.com/BaselAtiyire/Stock-Market-Analysis-in-Python",
    metrics: ["Processed 200k+ rows of historical market data", "10+ indicators: RSI, MACD, SMA/EMA, Bollinger Bands", "~40% runtime improvement via vectorized operations"],
    featured: false,
  },
];

const SKILLS = [
  { title: "AI / LLM", icon: "brain", items: ["LangChain", "RAG Pipelines", "Prompt Engineering", "Transformers", "LLM Evaluation", "Agentic AI"] },
  { title: "Backend", icon: "code", items: ["FastAPI", "Python", "REST APIs", "Pydantic", "Schema Validation"] },
  { title: "Data / Retrieval", icon: "db", items: ["ChromaDB", "Vector Search", "Embeddings", "SQL", "Pandas", "NumPy"] },
  { title: "Deployment", icon: "cloud", items: ["AWS ECS Fargate", "AWS ECR / EFS", "Terraform", "Docker", "GitHub Actions", "Vercel", "Streamlit Cloud"] },
];

const STATS = [
  { value: "90%", label: "Extraction Accuracy" },
  { value: "~35%", label: "Avg Latency Reduction" },
  { value: "8+", label: "AI Systems Built" },
  { value: "38", label: "AWS Resources (IaC)" },
];

const ARCH_FLOWS = [
  { title: "HRMS Agent (AWS)", flow: ["ALB / HTTPS", "ECS Fargate", "Claude Agent", "12 HR Tools", "SQLite / EFS", "Audit Log"] },
  { title: "Financial AI RAG", flow: ["User Query", "FastAPI", "LangChain", "ChromaDB", "LLM", "Structured Output"] },
  { title: "Document Q&A", flow: ["Docs", "Chunking", "Embeddings", "Vector Store", "Retriever", "Grounded Answer"] },
  { title: "Quant Intelligence", flow: ["Portfolio Data", "KPI Engine", "Risk Metrics", "LLM Narrative", "Dashboard"] },
];

const EDUCATION = [
  {
    period: "2024 – May 2026 (Expected)",
    degree: "M.S. Computer Science",
    school: "Western Illinois University",
    focus: "AI · Machine Learning · Data Science · LLM Systems",
  },
  {
    period: "Graduated 2021",
    degree: "B.Sc. Computing with Accounting",
    school: "University for Development Studies, Ghana",
    focus: "Business Intelligence · Data Management · Financial Computing",
  },
];

const CERTS = [
  { title: "Agentic AI", issuer: "DeepLearning.AI", year: "2025", url: "https://learn.deeplearning.ai/certificates/63c20fa7-9e02-4de1-a789-777d2a3f5abd", skills: ["Agentic AI", "LLMs", "Tool Use", "Prompting", "Evaluation"] },
  { title: "Databases & SQL for Data Science", issuer: "IBM (Credly)", year: "2025", url: "https://www.credly.com/badges/3ea18d2c-0f2f-40ab-a180-89d9a39ead4f", skills: ["SQL", "Relational DBs", "Joins", "Aggregation", "Analytics"] },
];

const PUBS = [
  {
    key: "ajrcos",
    title: "Design and Implementation of Online Crime Report System Using RAD Methodology",
    venue: "Asian Journal of Research in Computer Science",
    year: "2024",
    link: "https://journalajrcos.com/index.php/AJRCOS/article/view/493",
    doi: "10.9734/ajrcos/2024/v17i8493",
    doiUrl: "https://doi.org/10.9734/ajrcos/2024/v17i8493",
    pdfUrl: "https://sdiopr.s3.ap-south-1.amazonaws.com/2024/Aug/12-Aug-24/AJRCOS_121101/Ms_AJRCOS_121101.pdf",
    apa: 'Wiredu, J. K., Abuba, N. S., Atiyire, B., & Acheampong, R. W. (2024). Design and implementation of online crime report system using rapid application development (RAD) methodology. Asian Journal of Research in Computer Science, 17(8), 100–115. https://doi.org/10.9734/ajrcos/2024/v17i8493',
  },
  {
    key: "ssrn",
    title: "Efficiency Analysis and Optimization Techniques for Base Conversion Algorithms in Computational Systems",
    venue: "SSRN / IJISRT",
    year: "2024",
    link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4976080",
    doi: "10.38124/ijisrt/IJISRT24AUG066",
    doiUrl: "https://doi.org/10.38124/ijisrt/IJISRT24AUG066",
    pdfUrl: "",
    apa: 'Wiredu, J. K., Atiyire, B., Abuba, N. S., & Wiredu, R. A. (2024). Efficiency analysis and optimization techniques for base conversion algorithms in computational systems. IJISRT. https://doi.org/10.38124/ijisrt/IJISRT24AUG066',
  },
];

const NAV_LINKS = ["Projects", "Architecture", "Skills", "Metrics", "Education", "Publications", "Contact"];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function App() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [expandedProject, setExpandedProject] = useState(null);

  const roles = ["AI Engineer", "ML Engineer", "LLM Systems Builder"];

  useEffect(() => {
    const id = setInterval(() => setRoleIdx(i => (i + 1) % roles.length), 3200);
    return () => clearInterval(id);
  }, []);

  const copyText = async (text, key) => {
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 1400);
  };

  const filters = ["All", "Agentic AI", "AWS", "LLM", "RAG", "Finance", "Analytics", "Data", "AI"];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter(p => {
      if (p.title === "HRMS Agent") return false; // shown in spotlight above
      const matchF = activeFilter === "All" || [...p.tags, ...p.tech].some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));
      const matchQ = !q || [p.title, p.desc, p.oneLiner, ...p.tags, ...p.tech].join(" ").toLowerCase().includes(q);
      return matchF && matchQ;
    });
  }, [activeFilter, query]);

  const btnBase = { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none", border: "none", fontFamily: "inherit" };
  const primaryBtn = { ...btnBase, background: C.accentGrad, color: "#04080f" };
  const ghostBtn = { ...btnBase, background: "transparent", border: `1px solid ${C.border}`, color: C.subtle };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.bg, color: C.text, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: rgba(99,179,237,0.3); }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,179,237,0.25); border-radius: 99px; }
        a { color: inherit; text-decoration: none; }
        input::placeholder { color: #4a5568; }
        input:focus { outline: none; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes glow { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
        .role-text { animation: none; }
        .nav-link { padding: 6px 12px; font-size: 13px; color: #718096; border-radius: 8px; transition: color 0.2s, background 0.2s; text-decoration: none; cursor: pointer; display: inline-block; }
        .nav-link:hover { color: #f0f4f8 !important; background: rgba(255,255,255,0.035); }
      `}</style>

      {/* ─── NAV ─── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(4,8,15,0.85)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, gap: 12 }}>

          <nav style={{ display: "flex", gap: 4 }}>
            {NAV_LINKS.map(l => (
              <a key={l} onClick={() => scrollTo(l.toLowerCase())} className="nav-link" style={{ cursor: "pointer" }}>
                {l}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {/* contact icon always visible in nav */}
            <a href="mailto:basilatiyire@gmail.com" title="basilatiyire@gmail.com"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, color: C.muted, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
              <Icon name="mail" size={15} />
            </a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer" style={{ ...primaryBtn, padding: "7px 14px", fontSize: 13 }}>Resume</a>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 24px 72px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: "radial-gradient(ellipse, rgba(99,179,237,0.07) 0%, transparent 70%)", pointerEvents: "none", animation: "glow 4s ease infinite" }} />

        <Reveal>
          {/* availability + location bar */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: `1px solid rgba(99,179,237,0.25)`, background: "rgba(99,179,237,0.07)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", animation: "glow 2s ease infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.accent, letterSpacing: "0.04em" }}>Available for AI / ML roles · 2026</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: `1px solid ${C.border}`, background: C.surface }}>
              <span style={{ fontSize: 12, color: C.muted }}>📍 Remote-friendly · Open to relocation</span>
            </div>
          </div>

          {/* name + photo row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 12, flexWrap: "wrap" }}>
            {/* left: name + role */}
            <div>
              <h1 style={{ fontSize: "clamp(42px, 7vw, 72px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.04em", margin: 0 }}>
                Basel Atiyire
              </h1>
              <div style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 600, color: C.accent, marginTop: 6, minHeight: 34 }}>
                <span>{roles[roleIdx]}</span>
                <span style={{ animation: "blink 1s step-end infinite", marginLeft: 2 }}>|</span>
              </div>
            </div>
            {/* right: photo */}
            <div style={{ position: "relative", flexShrink: 0, animation: "float 4s ease infinite", marginRight: 100 }}>
              <img
                src="/basilimg.jpeg"
                alt="Basel Atiyire"
                onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                style={{ width: 88, height: 88, borderRadius: "50%", objectFit: "cover", border: `2px solid rgba(99,179,237,0.55)`, display: "block" }}
              />
              <div style={{
                width: 88, height: 88, borderRadius: "50%",
                border: `2px solid rgba(99,179,237,0.5)`,
                background: "linear-gradient(135deg, rgba(99,179,237,0.2), rgba(79,209,197,0.2))",
                alignItems: "center", justifyContent: "center",
                fontSize: 26, fontWeight: 700, color: C.accent,
                display: "none", position: "absolute", top: 0, left: 0,
              }}>BA</div>
            </div>
          </div>

          {/* Fix 3 — two-sentence bio for recruiters */}
          <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, maxWidth: 580, margin: "0 0 12px", padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface }}>
            MS Computer Science student at <span style={{ color: C.subtle }}>Western Illinois University</span>, graduating May 2026.
            Focused on building production LLM systems, RAG pipelines, and cloud-deployed AI applications.
          </p>

          {/* recruiter-facing one-liner */}
          <p style={{ fontSize: 17, lineHeight: 1.75, color: C.subtle, maxWidth: 620, margin: "0 0 10px" }}>
            I've shipped <strong style={{ color: C.text, fontWeight: 600 }}>8 AI systems to production</strong> — cutting latency by 35%, reducing infrastructure costs by 56%, and automating end-to-end HR, finance, and search workflows using LLMs, RAG, and AWS.
          </p>

          {/* recruiter impact strip */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", margin: "18px 0 28px", padding: "14px 20px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface }}>
            {[
              { val: "8+", label: "AI systems shipped" },
              { val: "Live demos", label: "Every project deployed" },
              { val: "AWS + IaC", label: "Production infrastructure" },
              { val: "2 publications", label: "Peer-reviewed research" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{s.val}</span>
                <span style={{ fontSize: 12, color: C.muted }}>· {s.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
            {["LLM", "RAG", "FastAPI", "LangChain", "AWS", "Financial AI"].map(t => <Tag key={t} accent>{t}</Tag>)}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a onClick={() => scrollTo("projects")} style={{ ...primaryBtn, cursor: "pointer" }}>View Projects <Icon name="arrow" /></a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer" style={{ ...primaryBtn, background: "transparent", border: `1px solid ${C.accent}`, color: C.accent, cursor: "pointer" }}>Download Resume</a>
            <a href="https://github.com/BaselAtiyire/" target="_blank" rel="noreferrer" style={ghostBtn}><Icon name="github" /> GitHub</a>
            <a href="http://www.linkedin.com/in/basel-atiyire-7666ba232/" target="_blank" rel="noreferrer" style={ghostBtn}><Icon name="linkedin" /> LinkedIn</a>
            <a href="mailto:basilatiyire@gmail.com" style={ghostBtn}><Icon name="mail" /> Email</a>
          </div>
        </Reveal>

        {/* stat cards */}
        <Reveal delay={150}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1, marginTop: 56, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}` }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ background: C.surface, padding: "20px 24px", borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.accent, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ─── FEATURED SPOTLIGHT ─── */}
      <Section id="projects">
        <SectionHead label="Work" title="Projects" subtitle="8 AI systems shipped to production — click any live demo to see it running." />

        {/* HRMS featured spotlight */}
        <Reveal>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.accent, marginBottom: 12 }}>⭐ Spotlight</div>
            <Card hover={false} style={{ border: `1px solid rgba(99,179,237,0.3)`, background: "rgba(99,179,237,0.04)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start", flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    <Tag accent>Agentic AI</Tag><Tag accent>AWS</Tag><Tag accent>Full-Stack</Tag><Tag accent>IaC</Tag>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>HRMS Agent</div>
                  <p style={{ fontSize: 14, color: C.subtle, lineHeight: 1.7, margin: "0 0 16px", maxWidth: 600 }}>
                    AI-powered HR Management System with a Claude agentic loop — multi-step planning, persistent memory, 12 live tools, role-based approvals, and full audit trails. Deployed on AWS ECS Fargate with Terraform (38 resources) and GitHub Actions CI/CD.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8, marginBottom: 16 }}>
                    {[
                      "Claude orchestrates 12 HR tools across employee, ticket & leave workflows",
                      "56% infra cost reduction — $62 → $27/month via architecture optimization",
                      "Full CI/CD: git push → ECR → ECS Fargate, zero manual steps",
                      "38 AWS resources provisioned via Terraform IaC",
                    ].map((m, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 12px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}` }}>
                        <span style={{ color: C.green, fontSize: 14, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 12, color: C.subtle, lineHeight: 1.5 }}>{m}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["Claude Sonnet", "FastAPI", "Streamlit", "Docker", "AWS ECS", "Terraform", "GitHub Actions", "SQLite", "MCP"].map(t => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 130 }}>
                  <a href="https://hrms.basilatiyire.com" target="_blank" rel="noreferrer" style={{ ...primaryBtn, padding: "10px 16px", fontSize: 13, justifyContent: "center" }}>
                    Live Demo <Icon name="external" size={13} />
                  </a>
                  <a href="https://github.com/BaselAtiyire/hrms-agent" target="_blank" rel="noreferrer" style={{ ...ghostBtn, padding: "10px 16px", fontSize: 13, justifyContent: "center" }}>
                    <Icon name="github" size={13} /> Code
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </Reveal>

        {/* filter + search */}
        <Reveal>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} style={{
                  padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  border: `1px solid ${f === activeFilter ? "rgba(99,179,237,0.4)" : C.border}`,
                  background: f === activeFilter ? C.accentDim : "transparent",
                  color: f === activeFilter ? C.accent : C.muted,
                  transition: "all 0.18s",
                }}>{f}</button>
              ))}
            </div>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects…"
              style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 13, width: 240, fontFamily: "inherit" }} />
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {filtered.map((p, i) => (
            <Reveal key={p.title} delay={i * 50}>
              <Card style={{ height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  {p.featured && <div style={{ marginBottom: 10 }}><Tag accent>Featured</Tag></div>}
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 6, lineHeight: 1.5 }}>{p.oneLiner}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{p.title}</div>
                </div>
                <p style={{ fontSize: 13, color: C.subtle, lineHeight: 1.65, margin: 0, flex: 1 }}>{p.desc}</p>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Key Results</div>
                  <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                    {p.metrics.map((m, mi) => <li key={mi} style={{ fontSize: 12, color: C.subtle, lineHeight: 1.55 }}>{m}</li>)}
                  </ul>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {p.tags.map(t => <Tag key={t} accent>{t}</Tag>)}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {p.tech.map(t => <Tag key={t}>{t}</Tag>)}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                  {p.live !== "#" && (
                    <a href={p.live} target="_blank" rel="noreferrer" style={{ ...primaryBtn, padding: "8px 14px", fontSize: 12, flex: 1, justifyContent: "center" }}>
                      Live Demo <Icon name="external" size={13} />
                    </a>
                  )}
                  <a href={p.github} target="_blank" rel="noreferrer" style={{ ...ghostBtn, padding: "8px 14px", fontSize: 12, flex: 1, justifyContent: "center" }}>
                    <Icon name="github" size={13} /> Code
                  </a>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── ARCHITECTURE ─── */}
      <Section id="architecture">
        <SectionHead label="Systems Design" title="AI Pipeline Architecture" subtitle="How I structure production-style AI systems — from ingestion to response." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {ARCH_FLOWS.map((a, ai) => (
            <Reveal key={a.title} delay={ai * 80}>
              <Card hover={false} style={{ gap: 16, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{a.title}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                  {a.flow.map((node, ni) => (
                    <div key={`${a.title}-${ni}`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        padding: "5px 11px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: ni === 0 ? C.accentDim : ni === a.flow.length - 1 ? "rgba(104,211,145,0.12)" : C.surface,
                        border: `1px solid ${ni === 0 ? "rgba(99,179,237,0.3)" : ni === a.flow.length - 1 ? "rgba(104,211,145,0.3)" : C.border}`,
                        color: ni === 0 ? C.accent : ni === a.flow.length - 1 ? C.green : C.subtle,
                      }}>{node}</span>
                      {ni < a.flow.length - 1 && <span style={{ color: C.muted, fontSize: 14 }}>→</span>}
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── SKILLS ─── */}
      <Section id="skills">
        <SectionHead label="Capabilities" title="Technical Skills" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {SKILLS.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 80}>
              <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentDim, border: `1px solid rgba(99,179,237,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
                    <Icon name={g.icon} size={18} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{g.title}</div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {g.items.map(item => <Tag key={item}>{item}</Tag>)}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── METRICS ─── */}
      <Section id="metrics">
        <SectionHead label="Performance" title="System Metrics" subtitle="Evaluation results across latency, retrieval quality, and cost efficiency." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { title: "Latency", bars: [{ label: "p50 (ms)", val: 1200, max: 3000 }, { label: "p95 (ms)", val: 2100, max: 3000 }] },
            { title: "Quality", bars: [{ label: "Recall@5", val: 85, max: 100, pct: true }, { label: "Success Rate", val: 100, max: 100, pct: true }] },
            { title: "Cost Efficiency", bars: [{ label: "Tokens / query", val: 760, max: 2000 }, { label: "Cost / query (m¢)", val: 5.5, max: 20 }] },
          ].map((group, gi) => (
            <Reveal key={group.title} delay={gi * 80}>
              <Card hover={false} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>{group.title}</div>
                {group.bars.map(b => (
                  <div key={b.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: C.subtle }}>{b.label}</span>
                      <span style={{ fontWeight: 700, color: C.accent }}>{b.pct ? `${b.val}%` : Math.round(b.val)}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(b.val / b.max) * 100}%`, borderRadius: 999, background: C.accentGrad, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── EDUCATION ─── */}
      <Section id="education">
        <SectionHead label="Background" title="Education & Credentials" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {EDUCATION.map((e, i) => (
            <Reveal key={i} delay={i * 80}>
              <Card hover={false} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: C.accentDim, border: `1px solid rgba(99,179,237,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>
                  <Icon name="book" size={20} />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{e.degree}</div>
                    <Tag>{e.period}</Tag>
                  </div>
                  <div style={{ fontSize: 13, color: C.accent, fontWeight: 600, marginBottom: 6 }}>{e.school}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{e.focus}</div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <SectionHead label="" title="Certifications" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {CERTS.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <Card hover={false} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: C.accentDim, border: `1px solid rgba(99,179,237,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
                  <Icon name="award" size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{c.issuer} · {c.year}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {c.skills.map(s => <Tag key={s}>{s}</Tag>)}
                  </div>
                </div>
                <a href={c.url} target="_blank" rel="noreferrer" style={{ ...primaryBtn, padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap" }}>
                  View <Icon name="external" size={13} />
                </a>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── PUBLICATIONS ─── */}
      <Section id="publications">
        <SectionHead label="Research" title="Publications" />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PUBS.map((pub, i) => (
            <Reveal key={pub.key} delay={i * 80}>
              <Card hover={false}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4, flex: 1 }}>{pub.title}</div>
                  <Tag>{pub.year}</Tag>
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>{pub.venue}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a href={pub.link} target="_blank" rel="noreferrer" style={{ ...primaryBtn, padding: "7px 13px", fontSize: 12 }}>
                    View <Icon name="external" size={12} />
                  </a>
                  {pub.pdfUrl && (
                    <a href={pub.pdfUrl} target="_blank" rel="noreferrer" style={{ ...ghostBtn, padding: "7px 13px", fontSize: 12 }}>PDF</a>
                  )}
                  <a href={pub.doiUrl} target="_blank" rel="noreferrer" style={{ ...ghostBtn, padding: "7px 13px", fontSize: 12 }}>DOI</a>
                  <button onClick={() => copyText(pub.apa, pub.key)} style={{ ...ghostBtn, padding: "7px 13px", fontSize: 12 }}>
                    {copiedKey === pub.key ? <><Icon name="check" size={13} /> Copied</> : <><Icon name="copy" size={13} /> Copy APA</>}
                  </button>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── CONTACT ─── */}
      <Section id="contact">
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>Get in Touch</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 16px", lineHeight: 1.2 }}>
              Let's build intelligent systems together.
            </h2>
            <p style={{ color: C.muted, lineHeight: 1.75, marginBottom: 32 }}>
              Open to AI Engineer, ML Engineer, and Data Engineer roles in 2026. Always happy to connect on interesting AI projects.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="mailto:basilatiyire@gmail.com" style={primaryBtn}><Icon name="mail" /> Contact Me</a>
              <a href="http://www.linkedin.com/in/basel-atiyire-7666ba232/" target="_blank" rel="noreferrer" style={ghostBtn}><Icon name="linkedin" /> LinkedIn</a>
              <a href="https://github.com/BaselAtiyire/" target="_blank" rel="noreferrer" style={ghostBtn}><Icon name="github" /> GitHub</a>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "24px", textAlign: "center", fontSize: 12, color: C.muted }}>
        © {new Date().getFullYear()} Basel Atiyire · Built with React & Vite
      </footer>
    </div>
  );
}
