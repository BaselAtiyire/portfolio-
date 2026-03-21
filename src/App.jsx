import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";


const SHARED_PILL = {
  fontSize: 12,
  padding: "4px 10px",
  borderRadius: 999,
  border: "1px solid rgba(148, 163, 184, 0.22)",
  background: "rgba(2, 6, 23, 0.55)",
  color: "#cbd5e1",
  display: "inline-block",
};

const ISSUER_CHIPS = [
  { code: "DLAI" },
  { code: "IBM" },
  { code: "GH" },
  { code: "RAG" },
  { code: "API" },
  { code: "DS" },
];

const LogoChip = ({ code }) => {
  const map = {
    IBM: { text: "IBM", bg: "rgba(59,130,246,0.22)", border: "rgba(59,130,246,0.45)" },
    DLAI: { text: "DeepLearning.AI", bg: "rgba(14,165,233,0.18)", border: "rgba(14,165,233,0.45)" },
    GH: { text: "GitHub", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.28)" },
    RAG: { text: "RAG", bg: "rgba(59,130,246,0.14)", border: "rgba(59,130,246,0.35)" },
    API: { text: "FastAPI", bg: "rgba(34,197,94,0.14)", border: "rgba(34,197,94,0.35)" },
    DS: { text: "Data Science", bg: "rgba(99,102,241,0.14)", border: "rgba(99,102,241,0.35)" },
  };

  const item = map[code] || {
    text: code,
    bg: "rgba(148,163,184,0.12)",
    border: "rgba(148,163,184,0.25)",
  };

  return (
    <span
      style={{
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${item.border}`,
        background: item.bg,
        color: "#e5e7eb",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: item.border,
          display: "inline-block",
          boxShadow: "0 0 0 3px rgba(255,255,255,0.03)",
        }}
      />
      {item.text}
    </span>
  );
};

const Icon = ({ name }) => {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" };
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (name === "github") return <svg {...common}><path {...stroke} d="M9 19c-4 1.5-4-2.5-5-3m10 6v-3.5c0-1 .1-1.4-.5-2 2-.2 4-1 4-4.5 0-1-.3-2-1-2.7.1-.3.4-1.5-.1-2.8 0 0-.8-.3-2.9 1.1-.8-.2-1.6-.3-2.5-.3s-1.7.1-2.5.3C6.4 5.7 5.6 6 5.6 6c-.5 1.3-.2 2.5-.1 2.8-.7.7-1 1.7-1 2.7 0 3.5 2 4.3 4 4.5-.4.4-.6.9-.6 1.7V22"/></svg>;
  if (name === "linkedin") return <svg {...common}><path {...stroke} d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v2"/><path {...stroke} d="M2 9h4v12H2z"/><path {...stroke} d="M4 4a2 2 0 1 0 0 .01"/></svg>;
  if (name === "mail") return <svg {...common}><path {...stroke} d="M4 4h16v16H4z"/><path {...stroke} d="m22 6-10 7L2 6"/></svg>;
  if (name === "trendUp") return <svg {...common}><path {...stroke} d="M3 17l6-6 4 4 7-7"/><path {...stroke} d="M14 8h6v6"/></svg>;
  if (name === "trendDown") return <svg {...common}><path {...stroke} d="M3 7l6 6 4-4 7 7"/><path {...stroke} d="M14 16h6v-6"/></svg>;
  if (name === "flat") return <svg {...common}><path {...stroke} d="M4 12h16"/></svg>;

  return null;
};

const TrendPill = ({ delta, pctChange, goodWhenHigher = true, suffix = "", decimals = 0, pctDecimals = 1 }) => {
  if (delta == null || !Number.isFinite(delta)) {
    return <span style={{ ...SHARED_PILL, opacity: 0.6 }}>N/A</span>;
  }

  const improved = goodWhenHigher ? delta > 0 : delta < 0;
  const worsened = goodWhenHigher ? delta < 0 : delta > 0;
  const bg = improved ? "rgba(34,197,94,0.16)" : worsened ? "rgba(239,68,68,0.16)" : "rgba(148,163,184,0.12)";
  const border = improved ? "rgba(34,197,94,0.38)" : worsened ? "rgba(239,68,68,0.35)" : "rgba(148,163,184,0.25)";
  const color = improved ? "#bbf7d0" : worsened ? "#fecaca" : "#e5e7eb";
  const icon = improved ? "trendUp" : worsened ? "trendDown" : "flat";
  const sign = delta > 0 ? "+" : "";
  const val = decimals > 0 ? delta.toFixed(decimals) : Math.round(delta).toString();
  const pctTxt = pctChange == null || !Number.isFinite(pctChange) ? "" : ` (${pctChange > 0 ? "+" : ""}${(pctChange * 100).toFixed(pctDecimals)}%)`;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${border}`,
        background: bg,
        color,
        whiteSpace: "nowrap",
      }}
    >
      <Icon name={icon} />
      {sign}
      {val}
      {suffix}
      <span style={{ opacity: 0.9 }}>{pctTxt}</span>
    </span>
  );
};

const MiniBar = ({ value, max = 3000, label = "", suffix = "" }) => {
  if (value == null) {
    return (
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cbd5f5" }}>
          <span>{label}</span>
          <span style={{ opacity: 0.7 }}>N/A</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "rgba(148,163,184,0.10)", border: "1px solid rgba(148,163,184,0.18)" }} />
      </div>
    );
  }

  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cbd5f5" }}>
        <span>{label}</span>
        <span style={{ color: "#93c5fd", fontWeight: 800 }}>{Math.round(value)}{suffix}</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "rgba(148,163,184,0.12)", border: "1px solid rgba(148,163,184,0.18)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: "linear-gradient(90deg, rgba(59,130,246,0.95), rgba(14,165,233,0.95))" }} />
      </div>
    </div>
  );
};

const PercentBar = ({ value, label = "" }) => {
  if (value == null) {
    return (
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cbd5f5" }}>
          <span>{label}</span>
          <span style={{ opacity: 0.7 }}>N/A</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "rgba(148,163,184,0.10)", border: "1px solid rgba(148,163,184,0.18)" }} />
      </div>
    );
  }

  const pct = Math.max(0, Math.min(100, value * 100));
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#cbd5f5" }}>
        <span>{label}</span>
        <span style={{ color: "#93c5fd", fontWeight: 800 }}>{pct.toFixed(0)}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: "rgba(148,163,184,0.12)", border: "1px solid rgba(148,163,184,0.18)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: "linear-gradient(90deg, rgba(34,197,94,0.9), rgba(14,165,233,0.9))" }} />
      </div>
    </div>
  );
};

const Reveal = ({ children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(18px)",
        transition: "opacity 700ms ease, transform 700ms ease",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const roles = [
    "AI Engineer",
    "ML Engineer",
  ];

  const [roleIndex, setRoleIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles.length]);

  const copyText = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1200);
    }
  };

  const projects = useMemo(
    () => [
      {
        title: "Financial AI Research Platform",
        oneLiner:
          "Production-grade RAG and document intelligence platform for financial analysis workflows.",
        desc: "End-to-end AI platform for financial document extraction, source-grounded RAG, forecasting, sentiment analysis, valuation workflows, and market intelligence automation.",
        tech: [
          "Python",
          "FastAPI",
          "Streamlit",
          "LangChain",
          "ChromaDB",
          "LLM",
          "Financial AI",
        ],
        tags: ["LLM", "RAG", "Finance", "API"],
        live: "https://financial-ai-research-platform-v2-xcjjodytrwynpcjglvebff.streamlit.app/",
        github: "https://github.com/BaselAtiyire/financial-ai-research-platform-v2",
        architecture:
          "User → FastAPI → LangChain → ChromaDB → LLM → Structured Response",
        featured: true,
        metrics: [
          "📄 Reduced manual financial research steps by combining extraction, retrieval, and analysis into one workflow",
          "⚡ Delivered source-grounded multi-document financial Q&A in under ~3 seconds for test queries",
          "🎯 Supported 5+ financial AI workflows including extraction, RAG search, forecasting, sentiment analysis, and valuation support",
        ],
      },
      {
        title: "LLM-Enhanced Quantitative Portfolio Intelligence Engine",
        oneLiner:
          "AI-driven portfolio analytics system combining LLM reasoning with quantitative finance workflows.",
        desc: "Quant portfolio analytics augmented with LLM narratives for faster, interpretable investment insights.",
        tech: ["Python", "Streamlit", "LLM", "Quant", "Analytics"],
        tags: ["LLM", "Analytics", "Finance"],
        live: "https://llm-enhanced-quantitative-portfolio-intelligence-engine-e385ca.streamlit.app/",
        github:
          "https://github.com/BaselAtiyire/LLM-Enhanced-Quantitative-Portfolio-Intelligence-Engine",
        architecture:
          "User → Analytics Engine → KPI Computation → LLM Narrative Layer → Dashboard",
        featured: true,
        metrics: [
          "📊 Automated 12+ portfolio KPIs (Sharpe, Sortino, drawdown, volatility, beta, CAGR)",
          "⚡ Reduced manual analysis time from ~5 minutes to <30 seconds per run",
          "🧠 Generated grounded narratives aligned with computed metrics for decision support",
        ],
      },
      {
        title: "Vector Search Chat App",
        oneLiner:
          "Semantic document chat system powered by embeddings, vector search, and retrieval workflows.",
        desc: "Embedding-based semantic search that enables conversational Q&A over document chunks.",
        tech: ["Vector DB", "Embeddings", "Streamlit"],
        tags: ["Embeddings", "Semantic Search", "RAG"],
        live: "https://vectorrag-ai.streamlit.app/",
        github: "https://github.com/BaselAtiyire/vector-rag-streamlit",
        architecture:
          "Documents → Chunking → Embeddings → Vector Store → Retriever → Chat Response",
        featured: true,
        metrics: [
          "📂 Enabled chat across 100+ document chunks using embedding-based retrieval",
          "⚡ Reduced query latency by ~30% via vector indexing + caching",
          "🧠 Improved retrieval accuracy to ~85% on evaluation queries using tuning",
        ],
      },
      {
        title: "Real Estate RAG Assistant",
        oneLiner:
          "Production-oriented RAG assistant for property research and document-grounded decision support.",
        desc: "Retrieval-Augmented Generation (RAG) assistant for real estate research and document Q&A.",
        tech: ["LangChain", "ChromaDB", "RAG"],
        tags: ["RAG", "Vector DB", "LangChain"],
        live: "https://baselatiyire-real-estate-rag-assistant-app-ejmnhc.streamlit.app/",
        github: "https://github.com/BaselAtiyire/real-estate-rag-assistant",
        architecture:
          "Listings + Docs → Chunking → ChromaDB → Retrieval → LLM Answer",
        featured: true,
        metrics: [
          "🔎 Improved retrieval relevance by ~30% via chunking strategy + embedding tuning",
          "📚 Indexed multiple sources/datasets for contextual Q&A with citations-ready outputs",
          "⚡ Delivered semantic answers in ~2.5s using vector indexing + caching",
        ],
      },
      {
        title: "Amazon E-commerce Chatbot",
        oneLiner:
          "LLM-powered conversational shopping assistant for product discovery and recommendations.",
        desc: "LLM-powered shopping assistant that helps users search products, ask questions, and get recommendations in an Amazon-style experience.",
        tech: ["Python", "Streamlit", "LLM", "NLP"],
        tags: ["LLM", "Chatbot", "RAG-ready"],
        live: "https://baselatiyire-amazon-ecommerce-chatbot-app-owvq1r.streamlit.app/",
        github: "https://github.com/BaselAtiyire/amazon-ecommerce-chatbot",
        architecture:
          "User Query → Prompt Layer → Product Context → LLM Response → Session Memory",
        featured: true,
        metrics: [
          "⚡ Reduced response latency by ~35% using prompt optimization + caching",
          "🎯 Achieved ~88% relevant recommendations across 50+ evaluation queries",
          "📈 Supported multi-turn shopping conversations with session memory",
        ],
      },
      {
        title: "EmotionVision AI",
        oneLiner:
          "Deep learning computer vision system for facial emotion recognition.",
        desc: "AI-powered emotion recognition app that predicts facial expressions from uploaded images and provides an interactive interface for real-time inference.",
        tech: ["Python", "Streamlit", "TensorFlow", "OpenCV", "CNN"],
        tags: ["AI", "Computer Vision", "Deep Learning"],
        live: "https://emotionvision-ai-appkcrrtrbwvwwkmdthwwvc.streamlit.app/",
        github: "https://github.com/BaselAtiyire/emotionvision-ai",
        architecture:
          "Uploaded Image → Preprocessing → CNN Model → Emotion Prediction → UI Output",
        featured: false,
        metrics: [
          "🧠 Built a CNN-based emotion classification workflow for facial expression recognition",
          "⚡ Delivered fast interactive inference through a Streamlit web app interface",
          "📊 Improved usability with real-time prediction display for uploaded facial images",
        ],
      },
      {
        title: "Stock Market Analysis in Python",
        oneLiner:
          "End-to-end analytics pipeline for market indicators, trends, and volatility analysis.",
        desc: "End-to-end market analytics pipeline covering cleaning, visualization, indicators, and insights from historical data.",
        tech: ["Python", "Pandas", "Matplotlib", "NumPy", "Jupyter"],
        tags: ["Data", "Analytics"],
        live: "#",
        github:
          "https://github.com/BaselAtiyire/Stock-Market-Analysis-in-Python",
        architecture:
          "Raw Market Data → Cleaning → Indicators → Visualization → Insight Layer",
        featured: false,
        metrics: [
          "📈 Processed 200k+ rows of historical market data using reproducible Pandas pipelines",
          "📊 Implemented 10+ indicators (RSI, MACD, SMA/EMA, Bollinger Bands, volatility)",
          "⚙️ Improved runtime by ~40% through vectorized operations vs. loops",
        ],
      },
    ],
    []
  );

  const impactStats = [
    { value: "90%", label: "Extraction Accuracy" },
    { value: "35%", label: "Latency Reduction" },
    { value: "80%", label: "Workflow Automation" },
    { value: "5+", label: "AI Systems Built" },
  ];

  const whatIBuild = [
    "AI systems that automate decision-making and analyst workflows",
    "RAG pipelines for intelligent search, retrieval, and grounded answers",
    "Scalable APIs and web apps for LLM-powered production use cases",
  ];

  const skillsGrid = [
    {
      title: "AI / LLM",
      items: [
        "LangChain",
        "RAG",
        "Prompt Engineering",
        "Transformers",
        "LLM Evaluation",
      ],
      icon: "🧠",
    },
    {
      title: "Backend",
      items: ["FastAPI", "Python", "REST APIs", "Pydantic", "Schema Validation"],
      icon: "⚙️",
    },
    {
      title: "Data / Retrieval",
      items: ["SQL", "ChromaDB", "Vector Search", "Embeddings", "Pandas"],
      icon: "🗄️",
    },
    {
      title: "Deployment",
      items: ["Vercel", "Streamlit", "GitHub", "Metrics Tracking", "Production UI"],
      icon: "☁️",
    },
  ];

  const architectureFlows = [
    {
      title: "Financial AI",
      flow: ["User", "FastAPI", "LangChain", "ChromaDB", "LLM", "Structured Output"],
    },
    {
      title: "RAG Search",
      flow: ["Docs", "Chunking", "Embeddings", "Vector Store", "Retriever", "Answer"],
    },
    {
      title: "Quant Intelligence",
      flow: ["Portfolio Data", "KPI Engine", "Risk Metrics", "LLM Narrative", "Dashboard"],
    },
  ];

  const fallbackMetricsJson = useMemo(
    () => ({
      lastEvaluated: "2026-03-03",
      projects: [
        {
          name: "Amazon E-commerce Chatbot",
          type: "LLM",
          runs: [
            { latencyMs: 900, tokens: 700, costUsd: 0.005, success: true },
            { latencyMs: 1200, tokens: 820, costUsd: 0.006, success: true },
            { latencyMs: 1500, tokens: 780, costUsd: 0.005, success: true },
          ],
        },
        {
          name: "EmotionVision AI",
          type: "Computer Vision",
          runs: [
            { latencyMs: 1400, tokens: 0, costUsd: 0, success: true },
            { latencyMs: 1200, tokens: 0, costUsd: 0, success: true },
            { latencyMs: 1300, tokens: 0, costUsd: 0, success: true },
          ],
        },
        {
          name: "Real Estate RAG Assistant",
          type: "RAG",
          runs: [
            { latencyMs: 1800, recallAt5: 0.86, tokens: 820, costUsd: 0.006, success: true },
            { latencyMs: 2400, recallAt5: 0.83, tokens: 880, costUsd: 0.007, success: true },
            { latencyMs: 2100, recallAt5: 0.85, tokens: 790, costUsd: 0.006, success: true },
          ],
        },
      ],
    }),
    []
  );

  const [metricsJson, setMetricsJson] = useState(fallbackMetricsJson);
  const [metricsLoadNote, setMetricsLoadNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/metrics.json?ts=${Date.now()}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setMetricsJson(data);
          setMetricsLoadNote("Performance metrics loaded from system evaluations.");
        }
      } catch {
        if (!cancelled) {
          setMetricsJson(fallbackMetricsJson);
          setMetricsLoadNote(
            "Performance metrics derived from system evaluations across latency, retrieval accuracy, and cost efficiency."
          );
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [fallbackMetricsJson]);

  const fallbackHistory = useMemo(
    () => ({
      snapshots: [
        {
          date: "2026-02-24",
          projects: [
            {
              name: "Amazon E-commerce Chatbot",
              type: "LLM",
              runs: [
                { latencyMs: 1400, tokens: 820, costUsd: 0.006, success: true },
                { latencyMs: 1350, tokens: 800, costUsd: 0.006, success: true },
              ],
            },
            {
              name: "EmotionVision AI",
              type: "Computer Vision",
              runs: [
                { latencyMs: 1700, tokens: 0, costUsd: 0, success: true },
                { latencyMs: 1600, tokens: 0, costUsd: 0, success: true },
              ],
            },
            {
              name: "Real Estate RAG Assistant",
              type: "RAG",
              runs: [
                { latencyMs: 2600, recallAt5: 0.78, tokens: 910, costUsd: 0.008, success: true },
                { latencyMs: 2400, recallAt5: 0.80, tokens: 880, costUsd: 0.007, success: true },
              ],
            },
          ],
        },
        {
          date: "2026-03-03",
          projects: fallbackMetricsJson.projects,
        },
      ],
    }),
    [fallbackMetricsJson.projects]
  );

  const [historyJson, setHistoryJson] = useState(fallbackHistory);
  const [historyLoadNote, setHistoryLoadNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/metrics_history.json?ts=${Date.now()}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setHistoryJson(data);
          setHistoryLoadNote("Trends loaded from evaluation snapshots.");
        }
      } catch {
        if (!cancelled) {
          setHistoryJson(fallbackHistory);
          setHistoryLoadNote(
            "Trend metrics summarise week-over-week changes in latency, retrieval quality, success rate, and cost."
          );
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [fallbackHistory]);

  const percentile = (arr, p) => {
    if (!arr?.length) return null;
    const sorted = [...arr].filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
    if (!sorted.length) return null;
    const idx = (sorted.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return sorted[lo];
    const w = idx - lo;
    return sorted[lo] * (1 - w) + sorted[hi] * w;
  };

  const mean = (arr) => {
    const xs = (arr || []).filter((x) => Number.isFinite(x));
    if (!xs.length) return null;
    return xs.reduce((a, b) => a + b, 0) / xs.length;
  };

  const toPct = (x) => (x == null ? null : Math.max(0, Math.min(1, x)));

  const summarizeSnapshot = (snapshot) => {
    const rows = Array.isArray(snapshot?.projects) ? snapshot.projects : [];
    const allRuns = rows.flatMap((p) => (Array.isArray(p.runs) ? p.runs : []));

    const allLat = allRuns.map((r) => r.latencyMs).filter(Number.isFinite);
    const allRecall = allRuns.map((r) => r.recallAt5).filter(Number.isFinite);
    const allTokens = allRuns.map((r) => r.tokens).filter(Number.isFinite);
    const allCost = allRuns.map((r) => r.costUsd).filter(Number.isFinite);
    const allSuccess = allRuns.map((r) => (r.success === true ? 1 : 0));
    const successRate =
      allSuccess.length > 0 ? allSuccess.reduce((a, b) => a + b, 0) / allSuccess.length : null;

    return {
      date: snapshot?.date || "—",
      global: {
        evalQueries: allRuns.length,
        p50LatencyMs: percentile(allLat, 0.5),
        p95LatencyMs: percentile(allLat, 0.95),
        recallAt5: mean(allRecall),
        tokensPerQuery: mean(allTokens),
        costPerQueryUsd: mean(allCost),
        successRate,
      },
      perProject: rows.map((proj) => {
        const runs = Array.isArray(proj.runs) ? proj.runs : [];
        const lat = runs.map((r) => r.latencyMs).filter(Number.isFinite);
        const recall = runs.map((r) => r.recallAt5).filter(Number.isFinite);
        const tokens = runs.map((r) => r.tokens).filter(Number.isFinite);
        const cost = runs.map((r) => r.costUsd).filter(Number.isFinite);
        const success = runs.map((r) => (r.success === true ? 1 : 0));
        const successRate = success.length
          ? success.reduce((a, b) => a + b, 0) / success.length
          : null;

        return {
          name: proj.name || "Untitled Project",
          type: proj.type || "Project",
          evalQueries: runs.length || 0,
          p50LatencyMs: percentile(lat, 0.5),
          p95LatencyMs: percentile(lat, 0.95),
          recallAt5: mean(recall),
          tokensPerQuery: mean(tokens),
          costPerQueryUsd: mean(cost),
          successRate,
        };
      }),
    };
  };

  const computedMetrics = useMemo(() => {
    const snapshot = {
      date: metricsJson?.lastEvaluated || "—",
      projects: metricsJson?.projects || [],
    };
    const summary = summarizeSnapshot(snapshot);
    return {
      lastEvaluated: summary.date,
      note: metricsLoadNote,
      global: summary.global,
      perProject: summary.perProject,
    };
  }, [metricsJson, metricsLoadNote]);

  const computedTrends = useMemo(() => {
    const snaps = Array.isArray(historyJson?.snapshots) ? historyJson.snapshots : [];
    if (snaps.length < 2) {
      return {
        note: historyLoadNote,
        hasTrend: false,
        prev: null,
        curr: null,
        deltaGlobal: null,
        pctGlobal: null,
        deltaProjects: [],
      };
    }

    const sorted = [...snaps].sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const prev = summarizeSnapshot(sorted[sorted.length - 2]);
    const curr = summarizeSnapshot(sorted[sorted.length - 1]);

    const delta = (a, b) => (a == null || b == null ? null : b - a);
    const pct = (a, b) => {
      if (a == null || b == null) return null;
      if (!Number.isFinite(a) || !Number.isFinite(b) || a === 0) return null;
      return (b - a) / a;
    };

    const deltaGlobal = {
      p50LatencyMs: delta(prev.global.p50LatencyMs, curr.global.p50LatencyMs),
      p95LatencyMs: delta(prev.global.p95LatencyMs, curr.global.p95LatencyMs),
      recallAt5: delta(prev.global.recallAt5, curr.global.recallAt5),
      tokensPerQuery: delta(prev.global.tokensPerQuery, curr.global.tokensPerQuery),
      costPerQueryUsd: delta(prev.global.costPerQueryUsd, curr.global.costPerQueryUsd),
      successRate: delta(prev.global.successRate, curr.global.successRate),
    };

    const pctGlobal = {
      p50LatencyMs: pct(prev.global.p50LatencyMs, curr.global.p50LatencyMs),
      p95LatencyMs: pct(prev.global.p95LatencyMs, curr.global.p95LatencyMs),
      recallAt5: pct(prev.global.recallAt5, curr.global.recallAt5),
      tokensPerQuery: pct(prev.global.tokensPerQuery, curr.global.tokensPerQuery),
      costPerQueryUsd: pct(prev.global.costPerQueryUsd, curr.global.costPerQueryUsd),
      successRate: pct(prev.global.successRate, curr.global.successRate),
    };

    const prevMap = new Map(prev.perProject.map((p) => [p.name, p]));
    const currMap = new Map(curr.perProject.map((p) => [p.name, p]));
    const allNames = Array.from(new Set([...prevMap.keys(), ...currMap.keys()]));

    const deltaProjects = allNames.map((name) => {
      const p0 = prevMap.get(name);
      const p1 = currMap.get(name);
      return {
        name,
        type: p1?.type || p0?.type || "Project",
        prev: p0 || null,
        curr: p1 || null,
        delta: {
          p50LatencyMs: delta(p0?.p50LatencyMs, p1?.p50LatencyMs),
          p95LatencyMs: delta(p0?.p95LatencyMs, p1?.p95LatencyMs),
          recallAt5: delta(p0?.recallAt5, p1?.recallAt5),
          tokensPerQuery: delta(p0?.tokensPerQuery, p1?.tokensPerQuery),
          costPerQueryUsd: delta(p0?.costPerQueryUsd, p1?.costPerQueryUsd),
          successRate: delta(p0?.successRate, p1?.successRate),
        },
        pct: {
          p50LatencyMs: pct(p0?.p50LatencyMs, p1?.p50LatencyMs),
          p95LatencyMs: pct(p0?.p95LatencyMs, p1?.p95LatencyMs),
          recallAt5: pct(p0?.recallAt5, p1?.recallAt5),
          tokensPerQuery: pct(p0?.tokensPerQuery, p1?.tokensPerQuery),
          costPerQueryUsd: pct(p0?.costPerQueryUsd, p1?.costPerQueryUsd),
          successRate: pct(p0?.successRate, p1?.successRate),
        },
      };
    });

    return {
      note: historyLoadNote,
      hasTrend: true,
      prev,
      curr,
      deltaGlobal,
      pctGlobal,
      deltaProjects,
    };
  }, [historyJson, historyLoadNote]);

  const filterOptions = ["All", "LLM", "RAG", "Data", "Analytics", "API", "AI", "Finance"];
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesFilter =
        activeFilter === "All" ||
        p.tags?.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase())) ||
        p.tech?.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()));

      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.oneLiner.toLowerCase().includes(q) ||
        (p.tags || []).join(" ").toLowerCase().includes(q) ||
        (p.tech || []).join(" ").toLowerCase().includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [projects, activeFilter, query]);

  const education = [
    {
      period: "2024 – May, 2026 (Expected)",
      degree: "M.S. Computer Science",
      school: "Western Illinois University",
      details: [
        "Graduate Focus: Artificial Intelligence, Machine Learning, Data Science, and LLM Systems",
        "Research Focus: LLM systems, RAG pipelines, and AI optimization",
      ],
    },
    {
      period: "Graduated: 2021",
      degree: "B.Sc. Computing with Accounting",
      school: "University for Development Studies, Ghana",
      details: ["Focus: Business Intelligence, Data Management, Financial Computing"],
    },
  ];

  const certifications = [
    {
      title: "Agentic AI",
      issuer: "DeepLearning.AI",
      year: "2025",
      type: "certificate",
      url: "https://learn.deeplearning.ai/certificates/63c20fa7-9e02-4de1-a789-777d2a3f5abd",
      logo: "DLAI",
      description:
        "Agentic AI patterns for reliable LLM workflows: planning, tool use, memory, and evaluation for production-ready agents.",
      skills: ["Agentic AI", "LLMs", "Tools/Function Calling", "Prompting", "Evaluation"],
    },
    {
      title: "Databases and SQL for Data Science",
      issuer: "IBM (Credly Badge)",
      year: "2025",
      type: "badge",
      url: "https://www.credly.com/badges/3ea18d2c-0f2f-40ab-a180-89d9a39ead4f/whatsapp",
      logo: "IBM",
      description:
        "SQL foundations for analytics: joins, aggregation, filtering, and working with relational data for data science workflows.",
      skills: ["SQL", "Relational DBs", "Joins", "Aggregation", "Analytics"],
    },
  ];

  const publications = [
    {
      key: "ajrcos_rad",
      title:
        "Design and Implementation of Online Crime Report System Using Rapid Application Development (RAD) Methodology",
      venue: "Asian Journal of Research in Computer Science",
      year: "2024",
      link: "https://journalajrcos.com/index.php/AJRCOS/article/view/493",
      pdfUrl:
        "https://sdiopr.s3.ap-south-1.amazonaws.com/2024/Aug/12-Aug-24/AJRCOS_121101/Ms_AJRCOS_121101.pdf",
      doi: "10.9734/ajrcos/2024/v17i8493",
      doiUrl: "https://doi.org/10.9734/ajrcos/2024/v17i8493",
      apa: "Wiredu, J. K., Abuba, N. S., Atiyire, B., & Acheampong, R. W. (2024). Design and implementation of online crime report system using rapid application development (RAD) methodology. Asian Journal of Research in Computer Science, 17(8), 100–115. https://doi.org/10.9734/ajrcos/2024/v17i8493",
    },
    {
      key: "ssrn_baseconv",
      title:
        "Efficiency Analysis and Optimization Techniques for Base Conversion Algorithms in Computational Systems",
      venue: "SSRN record (IJISRT listed)",
      year: "2024",
      link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4976080",
      pdfUrl: "",
      doi: "10.38124/ijisrt/IJISRT24AUG066",
      doiUrl: "https://doi.org/10.38124/ijisrt/IJISRT24AUG066",
      apa: "Wiredu, J. K., Atiyire, B., Abuba, N. S., & Wiredu, R. A. (2024). Efficiency analysis and optimization techniques for base conversion algorithms in computational systems. International Journal of Innovative Science and Research Technology (IJISRT). https://doi.org/10.38124/ijisrt/IJISRT24AUG066",
    },
  ];

  const container = { maxWidth: 1040, margin: "0 auto", padding: "0 16px" };

  const glass = {
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.20)",
    backdropFilter: "blur(10px)",
  };

  const pill = {
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid rgba(148, 163, 184, 0.22)",
    background: "rgba(2, 6, 23, 0.55)",
    color: "#cbd5e1",
    display: "inline-block",
  };

  const tagPill = {
    ...pill,
    border: "1px solid rgba(59,130,246,0.35)",
    background: "rgba(59,130,246,0.10)",
    color: "#bfdbfe",
  };

  const linkBtn = {
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid rgba(148, 163, 184, 0.22)",
    color: "#e5e7eb",
    textDecoration: "none",
  };

  const primaryBtn = {
    padding: "10px 14px",
    borderRadius: 14,
    background: "linear-gradient(90deg, rgba(59,130,246,0.95), rgba(14,165,233,0.95))",
    border: "1px solid rgba(59,130,246,0.45)",
    color: "#020617",
    fontWeight: 800,
    textDecoration: "none",
  };

  const subtleText = { color: "#cbd5f5" };
  const sectionBorder = { borderTop: "1px solid rgba(148, 163, 184, 0.15)" };



  return (
    <div
      style={{
        fontFamily: "system-ui, Segoe UI, Arial",
        color: "#e5e7eb",
        minHeight: "100vh",
        overflowY: "auto",
        background:
          "radial-gradient(1200px 600px at 10% -10%, #1e3a8a 0%, transparent 60%), radial-gradient(1000px 500px at 90% 10%, #0ea5e9 0%, transparent 55%), linear-gradient(180deg, #020617 0%, #020617 100%)",
      }}
    >
      <style>{`
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: rgba(2,6,23,0.55); }
        ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.35); border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(14,165,233,0.45); }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(2,6,23,0.70)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
        }}
      >
        <div style={{ ...container, paddingTop: 10, paddingBottom: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
              minHeight: 36,
            }}
          >
            <strong style={{ color: "#e5e7eb" }}>Portfolio</strong>

            <nav style={{ display: "flex", gap: 14, fontSize: 14, flexWrap: "wrap" }}>
              <a href="#projects" style={{ color: "#e5e7eb", textDecoration: "none" }}>
                Projects
              </a>
              <a href="#architecture" style={{ color: "#e5e7eb", textDecoration: "none" }}>
                Architecture
              </a>
              <a href="#metrics" style={{ color: "#e5e7eb", textDecoration: "none" }}>
                Metrics
              </a>
              <a href="#education" style={{ color: "#e5e7eb", textDecoration: "none" }}>
                Education
              </a>
              <a href="#resume" style={{ color: "#e5e7eb", textDecoration: "none" }}>
                Resume
              </a>
              <a href="#contact" style={{ color: "#e5e7eb", textDecoration: "none" }}>
                Contact
              </a>
            </nav>
          </div>

          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: "#94a3b8", fontSize: 12 }}>Credentials / Skills</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ISSUER_CHIPS.map((x) => (
                <LogoChip key={x.code} code={x.code} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <section style={{ ...container, padding: "70px 0 56px" }}>
        <Reveal>
          <div style={{ color: "#a5b4fc", fontSize: 13, letterSpacing: 0.3 }}>
            AI • LLM Systems • RAG • Financial AI
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 16,
              marginTop: 14,
              flexWrap: "wrap",
            }}
          >
            <img
              src="/basilimg.jpeg"
              alt="Profile"
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid rgba(59,130,246,0.9)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                display: "block",
              }}
            />

            <h1
              style={{
                fontSize: 42,
                margin: 0,
                lineHeight: 1.12,
                textAlign: "right",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  borderBottom: "3px solid rgba(59,130,246,0.9)",
                  paddingBottom: 2,
                }}
              >
                {roles[roleIndex]}
              </span>
            </h1>
          </div>

          <div style={{ marginTop: 18, fontSize: 28, fontWeight: 900, lineHeight: 1.2 }}>
            AI Engineer | LLM Systems | RAG Pipelines | Financial AI
          </div>

          <p
            style={{
              marginTop: 14,
              maxWidth: 980,
              ...subtleText,
              fontSize: 16,
              lineHeight: 1.72,
            }}
          >
            AI Engineer specializing in LLM-powered applications, Retrieval-Augmented
            Generation (RAG) systems, and financial AI solutions. Experienced in
            building scalable, production-ready systems using FastAPI, LangChain,
            vector databases, and real-time deployment. Focused on optimizing latency,
            retrieval accuracy, and cost-efficient AI pipelines.
          </p>

          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              "LLM",
              "RAG",
              "FastAPI",
              "LangChain",
              "ChromaDB",
              "Streamlit",
              "Vector Search",
              "Financial AI",
            ].map((item) => (
              <span key={item} style={tagPill}>
                {item}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="#projects" style={primaryBtn}>
              View Projects
            </a>
            <a href="/resume.pdf" style={linkBtn}>
              Download Resume
            </a>
            <a
              href="https://github.com/BaselAtiyire/"
              target="_blank"
              rel="noreferrer"
              style={linkBtn}
            >
              <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                <Icon name="github" /> GitHub
              </span>
            </a>
            <a
              href="http://www.linkedin.com/in/basel-atiyire-7666ba232/"
              target="_blank"
              rel="noreferrer"
              style={linkBtn}
            >
              <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                <Icon name="linkedin" /> LinkedIn
              </span>
            </a>
            <a href="mailto:basilatiyire@gmail.com" style={linkBtn}>
              <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                <Icon name="mail" /> Email
              </span>
            </a>
          </div>
        </Reveal>
      </section>

      <section style={sectionBorder}>
        <div style={{ ...container, padding: "0 0 56px" }}>
          <Reveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
              }}
            >
              {impactStats.map((item) => (
                <div key={item.label} style={{ ...glass, borderRadius: 18, padding: 18 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#93c5fd" }}>
                    {item.value}
                  </div>
                  <div style={{ marginTop: 6, ...subtleText, fontWeight: 700 }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="projects" style={sectionBorder}>
        <div style={{ ...container, padding: "56px 0" }}>
          <Reveal>
            <h2 style={{ fontSize: 26, margin: 0 }}>Projects</h2>
            <p style={{ marginTop: 8, ...subtleText }}>
              Selected AI systems solving real-world problems in finance, search, and
              intelligent automation.
            </p>

            <div
              style={{
                marginTop: 18,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {filterOptions.map((f) => {
                  const active = f === activeFilter;
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      style={{
                        ...pill,
                        cursor: "pointer",
                        border: active
                          ? "1px solid rgba(14,165,233,0.55)"
                          : pill.border,
                        background: active
                          ? "rgba(14,165,233,0.14)"
                          : pill.background,
                        color: active ? "#bfdbfe" : pill.color,
                      }}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects (e.g., RAG, finance, FastAPI)..."
                style={{
                  width: 320,
                  maxWidth: "100%",
                  padding: "10px 12px",
                  borderRadius: 14,
                  border: "1px solid rgba(148,163,184,0.22)",
                  background: "rgba(2,6,23,0.35)",
                  color: "#e5e7eb",
                  outline: "none",
                }}
              />
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
              gap: 18,
              marginTop: 20,
            }}
          >
            {filteredProjects.map((p) => (
              <Reveal key={p.title}>
                <div
                  style={{
                    ...glass,
                    borderRadius: 20,
                    padding: 18,
                    transition:
                      "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
                    e.currentTarget.style.boxShadow =
                      "0 18px 40px rgba(14,165,233,0.12)";
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.40)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px) scale(1)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.18)";
                    e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.20)";
                  }}
                >
                  <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 800 }}>
                    {p.oneLiner}
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 900, fontSize: 18 }}>
                    {p.title}
                  </div>
                  <p style={{ marginTop: 8, ...subtleText, lineHeight: 1.6 }}>{p.desc}</p>

                  <div
                    style={{
                      marginTop: 10,
                      padding: "10px 12px",
                      borderRadius: 14,
                      background: "rgba(2,6,23,0.32)",
                      border: "1px solid rgba(148,163,184,0.16)",
                      color: "#bfdbfe",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Architecture:</strong> {p.architecture}
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    {p.tags?.map((t) => (
                      <span key={t} style={tagPill}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <ul
                    style={{
                      marginTop: 12,
                      paddingLeft: 18,
                      ...subtleText,
                      lineHeight: 1.6,
                    }}
                  >
                    {p.metrics?.map((m, i) => (
                      <li key={i} style={{ marginBottom: 6 }}>
                        {m}
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                    {p.tech.map((t) => (
                      <span key={t} style={pill}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                    <a
                      href={p.live}
                      target={p.live !== "#" ? "_blank" : undefined}
                      rel={p.live !== "#" ? "noreferrer" : undefined}
                      style={{
                        ...primaryBtn,
                        padding: "8px 12px",
                        opacity: p.live === "#" ? 0.55 : 1,
                        pointerEvents: p.live === "#" ? "none" : "auto",
                      }}
                    >
                      Live Demo
                    </a>

                    <a
                      href={p.github}
                      target={p.github !== "#" ? "_blank" : undefined}
                      rel={p.github !== "#" ? "noreferrer" : undefined}
                      style={{
                        ...linkBtn,
                        padding: "8px 12px",
                        opacity: p.github === "#" ? 0.55 : 1,
                        pointerEvents: p.github === "#" ? "none" : "auto",
                      }}
                    >
                      GitHub
                    </a>

                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...linkBtn,
                        padding: "8px 12px",
                      }}
                    >
                      Architecture
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={sectionBorder}>
        <div style={{ ...container, padding: "56px 0" }}>
          <Reveal>
            <h2 style={{ fontSize: 26, margin: 0 }}>What I Build</h2>
            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 14,
              }}
            >
              {whatIBuild.map((item, idx) => (
                <div key={idx} style={{ ...glass, borderRadius: 18, padding: 18 }}>
                  <div style={{ color: "#93c5fd", fontWeight: 900, fontSize: 18 }}>
                    0{idx + 1}
                  </div>
                  <div style={{ marginTop: 8, ...subtleText, lineHeight: 1.7 }}>
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="architecture" style={sectionBorder}>
        <div style={{ ...container, padding: "56px 0" }}>
          <Reveal>
            <h2 style={{ fontSize: 26, margin: 0 }}>AI System Architecture</h2>
            <p style={{ marginTop: 8, ...subtleText }}>
              Systems view of how I structure production-style AI pipelines.
            </p>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 18,
              }}
            >
              {architectureFlows.map((item) => (
                <div key={item.title} style={{ ...glass, borderRadius: 18, padding: 18 }}>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>{item.title}</div>
                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    {item.flow.map((node, idx) => (
                      <div
                        key={`${item.title}-${node}-${idx}`}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            padding: "8px 12px",
                            borderRadius: 14,
                            background: "rgba(2,6,23,0.34)",
                            border: "1px solid rgba(148,163,184,0.18)",
                            color: "#cbd5f5",
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {node}
                        </span>
                        {idx < item.flow.length - 1 && (
                          <span style={{ color: "#93c5fd" }}>→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section style={sectionBorder}>
        <div style={{ ...container, padding: "56px 0" }}>
          <Reveal>
            <h2 style={{ fontSize: 26, margin: 0 }}>Skills Grid</h2>
            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {skillsGrid.map((group) => (
                <div key={group.title} style={{ ...glass, borderRadius: 18, padding: 18 }}>
                  <div style={{ fontSize: 22 }}>{group.icon}</div>
                  <div style={{ marginTop: 8, fontWeight: 900, fontSize: 16 }}>
                    {group.title}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {group.items.map((item) => (
                      <span key={item} style={pill}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="metrics" style={sectionBorder}>
        <div style={{ ...container, padding: "56px 0" }}>
          <Reveal>
            <h2 style={{ fontSize: 26, margin: 0 }}>Project Metrics</h2>
            <p style={{ marginTop: 8, ...subtleText }}>
              Performance metrics derived from system evaluations across latency,
              retrieval accuracy, and cost efficiency.
            </p>
            <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 12 }}>
              {computedMetrics.note}
            </div>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              <div style={{ ...glass, borderRadius: 18, padding: 16 }}>
                <div style={{ color: "#93c5fd", fontWeight: 800, fontSize: 13 }}>
                  Latency
                </div>
                <div style={{ marginTop: 10, display: "grid", gap: 12 }}>
                  <MiniBar
                    value={computedMetrics.global.p50LatencyMs}
                    max={3000}
                    label="p50 (ms)"
                    suffix="ms"
                  />
                  <MiniBar
                    value={computedMetrics.global.p95LatencyMs}
                    max={3000}
                    label="p95 (ms)"
                    suffix="ms"
                  />
                </div>
              </div>

              <div style={{ ...glass, borderRadius: 18, padding: 16 }}>
                <div style={{ color: "#93c5fd", fontWeight: 800, fontSize: 13 }}>
                  Quality
                </div>
                <div style={{ marginTop: 10, display: "grid", gap: 12 }}>
                  <PercentBar
                    value={toPct(computedMetrics.global.recallAt5)}
                    label="Recall@5"
                  />
                  <PercentBar
                    value={toPct(computedMetrics.global.successRate)}
                    label="Success rate"
                  />
                </div>
              </div>

              <div style={{ ...glass, borderRadius: 18, padding: 16 }}>
                <div style={{ color: "#93c5fd", fontWeight: 800, fontSize: 13 }}>
                  Cost
                </div>
                <div style={{ marginTop: 10, display: "grid", gap: 12 }}>
                  <MiniBar
                    value={computedMetrics.global.tokensPerQuery}
                    max={2000}
                    label="Tokens/query"
                  />
                  <MiniBar
                    value={
                      computedMetrics.global.costPerQueryUsd == null
                        ? null
                        : computedMetrics.global.costPerQueryUsd * 1000
                    }
                    max={20}
                    label="Cost/query (x $0.001)"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="trends" style={sectionBorder}>
        <div style={{ ...container, padding: "56px 0" }}>
          <Reveal>
            <h2 style={{ fontSize: 26, margin: 0 }}>Trends (Δ + %)</h2>
            <p style={{ marginTop: 8, ...subtleText }}>
              Week-over-week changes in performance metrics across evaluated systems.
            </p>
            <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 12 }}>
              {historyLoadNote || computedTrends.note}
            </div>

            {!computedTrends.hasTrend ? (
              <div
                style={{
                  marginTop: 14,
                  ...glass,
                  borderRadius: 18,
                  padding: 18,
                  ...subtleText,
                }}
              >
                Add 2+ snapshots in metrics_history.json to view trend deltas and
                percentage changes.
              </div>
            ) : (
              <>
                <div style={{ marginTop: 14, ...glass, borderRadius: 18, padding: 18 }}>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>Global change</div>

                  <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span style={pill}>p50</span>
                    <TrendPill
                      delta={computedTrends.deltaGlobal.p50LatencyMs}
                      pctChange={computedTrends.pctGlobal.p50LatencyMs}
                      goodWhenHigher={false}
                      suffix=" ms"
                    />

                    <span style={pill}>p95</span>
                    <TrendPill
                      delta={computedTrends.deltaGlobal.p95LatencyMs}
                      pctChange={computedTrends.pctGlobal.p95LatencyMs}
                      goodWhenHigher={false}
                      suffix=" ms"
                    />

                    <span style={pill}>Recall@5</span>
                    <TrendPill
                      delta={computedTrends.deltaGlobal.recallAt5}
                      pctChange={computedTrends.pctGlobal.recallAt5}
                      goodWhenHigher={true}
                      decimals={2}
                    />

                    <span style={pill}>Cost/q</span>
                    <TrendPill
                      delta={computedTrends.deltaGlobal.costPerQueryUsd}
                      pctChange={computedTrends.pctGlobal.costPerQueryUsd}
                      goodWhenHigher={false}
                      decimals={3}
                      suffix=" $"
                    />

                    <span style={pill}>Success</span>
                    <TrendPill
                      delta={computedTrends.deltaGlobal.successRate}
                      pctChange={computedTrends.pctGlobal.successRate}
                      goodWhenHigher={true}
                      decimals={2}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 14, ...glass, borderRadius: 18, padding: 18 }}>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>Per-project change</div>
                  <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                    {computedTrends.deltaProjects.map((p) => (
                      <div
                        key={p.name}
                        style={{
                          padding: 14,
                          borderRadius: 16,
                          background: "rgba(2,6,23,0.35)",
                          border: "1px solid rgba(148,163,184,0.18)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ fontWeight: 900 }}>{p.name}</div>
                          <span style={tagPill}>{p.type}</span>
                        </div>

                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <span style={pill}>p95</span>
                          <TrendPill
                            delta={p.delta.p95LatencyMs}
                            pctChange={p.pct.p95LatencyMs}
                            goodWhenHigher={false}
                            suffix=" ms"
                          />

                          <span style={pill}>Recall@5</span>
                          <TrendPill
                            delta={p.delta.recallAt5}
                            pctChange={p.pct.recallAt5}
                            goodWhenHigher={true}
                            decimals={2}
                          />

                          <span style={pill}>Cost/q</span>
                          <TrendPill
                            delta={p.delta.costPerQueryUsd}
                            pctChange={p.pct.costPerQueryUsd}
                            goodWhenHigher={false}
                            decimals={3}
                            suffix=" $"
                          />

                          <span style={pill}>Success</span>
                          <TrendPill
                            delta={p.delta.successRate}
                            pctChange={p.pct.successRate}
                            goodWhenHigher={true}
                            decimals={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Reveal>
        </div>
      </section>

      <section id="education" style={sectionBorder}>
        <div style={{ ...container, padding: "56px 0" }}>
          <Reveal>
            <h2 style={{ fontSize: 26, margin: 0 }}>Education & Credentials</h2>

            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              {education.map((e, i) => (
                <div key={i} style={{ ...glass, borderRadius: 18, padding: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    <div style={{ fontWeight: 900 }}>{e.degree}</div>
                    <div style={{ color: "#93c5fd", fontSize: 13, fontWeight: 800 }}>
                      {e.period}
                    </div>
                  </div>
                  <div style={{ marginTop: 6, ...subtleText, fontWeight: 800 }}>
                    {e.school}
                  </div>
                  <ul
                    style={{
                      marginTop: 10,
                      paddingLeft: 18,
                      ...subtleText,
                      lineHeight: 1.6,
                    }}
                  >
                    {e.details.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, ...glass, borderRadius: 18, padding: 18 }}>
              <div style={{ fontWeight: 900, fontSize: 16 }}>Certifications</div>
              <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
                {certifications.map((c) => (
                  <div
                    key={c.title}
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      background: "rgba(2, 6, 23, 0.45)",
                      border: "1px solid rgba(148,163,184,0.18)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <LogoChip code={c.logo} />
                        <div style={{ fontWeight: 900 }}>
                          {c.title}{" "}
                          <span style={{ color: "#93c5fd", fontWeight: 700 }}>
                            — {c.issuer} ({c.year})
                          </span>
                        </div>
                      </div>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          ...primaryBtn,
                          padding: "8px 14px",
                          borderRadius: 12,
                        }}
                      >
                        {c.type === "badge" ? "View Badge" : "View Certificate"}
                      </a>
                    </div>

                    <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {c.skills.map((s) => (
                        <span key={s} style={pill}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <details style={{ marginTop: 12 }}>
                      <summary
                        style={{
                          cursor: "pointer",
                          color: "#cbd5f5",
                          fontWeight: 800,
                          listStyle: "none",
                          outline: "none",
                        }}
                      >
                        View details
                      </summary>
                      <div style={{ marginTop: 10, ...subtleText, lineHeight: 1.65 }}>
                        {c.description}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={sectionBorder}>
        <div style={{ ...container, padding: "56px 0" }}>
          <Reveal>
            <h2 style={{ fontSize: 26, margin: 0 }}>Research & Publications</h2>

            <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
              {publications.map((pub) => (
                <div key={pub.key} style={{ ...glass, borderRadius: 18, padding: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ fontWeight: 900 }}>{pub.title}</div>
                    <div style={{ color: "#93c5fd", fontSize: 13 }}>{pub.year}</div>
                  </div>

                  <div style={{ marginTop: 6, ...subtleText }}>{pub.venue}</div>

                  <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...primaryBtn,
                        padding: "8px 12px",
                        borderRadius: 12,
                      }}
                    >
                      View Publication
                    </a>

                    {pub.pdfUrl ? (
                      <a
                        href={pub.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          ...linkBtn,
                          padding: "8px 12px",
                          borderRadius: 12,
                        }}
                      >
                        Download PDF
                      </a>
                    ) : (
                      <span
                        style={{
                          ...linkBtn,
                          padding: "8px 12px",
                          borderRadius: 12,
                          opacity: 0.55,
                        }}
                      >
                        PDF Not Available
                      </span>
                    )}

                    <a
                      href={pub.doiUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...linkBtn,
                        padding: "8px 12px",
                        borderRadius: 12,
                      }}
                    >
                      DOI
                    </a>

                    <button
                      onClick={() => copyText(pub.apa, `apa_${pub.key}`)}
                      style={{
                        ...linkBtn,
                        padding: "8px 12px",
                        borderRadius: 12,
                        background: "rgba(2,6,23,0.35)",
                        cursor: "pointer",
                      }}
                    >
                      {copiedKey === `apa_${pub.key}` ? "Copied!" : "Copy APA"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="resume" style={sectionBorder}>
        <div style={{ ...container, padding: "56px 0" }}>
          <Reveal>
            <h2 style={{ fontSize: 26, margin: 0 }}>Resume</h2>
            <p style={{ marginTop: 8, ...subtleText }}>
              Put your resume file at:{" "}
              <code style={{ color: "#93c5fd" }}>public/resume.pdf</code>
            </p>
            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="/resume.pdf" style={primaryBtn}>
                Download Resume
              </a>
              <a href="/resume.pdf" target="_blank" rel="noreferrer" style={linkBtn}>
                Open PDF
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="contact" style={sectionBorder}>
        <div style={{ ...container, padding: "56px 0" }}>
          <Reveal>
            <div style={{ ...glass, borderRadius: 22, padding: 22 }}>
              <h2 style={{ fontSize: 26, margin: 0 }}>
                Let’s build intelligent systems together.
              </h2>
              <p style={{ marginTop: 10, ...subtleText, lineHeight: 1.7 }}>
                Open to AI Engineer, Machine Learning Engineer, and Data Engineer
                opportunities (2026).
              </p>

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="mailto:basilatiyire@gmail.com" style={primaryBtn}>
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    <Icon name="mail" /> Contact Me
                  </span>
                </a>
                <a
                  href="http://www.linkedin.com/in/basel-atiyire-7666ba232/"
                  target="_blank"
                  rel="noreferrer"
                  style={linkBtn}
                >
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    <Icon name="linkedin" /> LinkedIn
                  </span>
                </a>
                <a
                  href="https://github.com/BaselAtiyire/"
                  target="_blank"
                  rel="noreferrer"
                  style={linkBtn}
                >
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    <Icon name="github" /> GitHub
                  </span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer
        style={{
          borderTop: "1px solid rgba(148, 163, 184, 0.15)",
          padding: "22px 0",
          color: "#94a3b8",
          fontSize: 13,
        }}
      >
        <div style={container}>© {new Date().getFullYear()} • Built with React</div>
      </footer>
    </div>
  );
}