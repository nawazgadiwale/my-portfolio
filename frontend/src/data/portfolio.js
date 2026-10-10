export const profile = {
  name: "Nawaz Gadiwale",
  role: "Junior AI Engineer",
  location: "Belgaum, Karnataka, India",
  email: "nawaz.gadiwale@gmail.com",
  phone: "+91 8310412768",
  summary:
    "I build LLM-powered applications, AI agents, RAG pipelines and automated workflows, with a focus on reliable AI systems and useful user experiences."
};

export const skills = [
  { title: "AI & Generative AI", items: ["LLMs", "LangChain", "LangGraph", "RAG", "AI Agents", "Embeddings", "Vector Search", "Prompt Engineering", "Tool Calling"] },
  { title: "Backend", items: ["Python", "Django", "REST APIs", "Node.js", "Express.js", "SQL"] },
  { title: "Frontend", items: ["React", "JavaScript", "HTML", "CSS", "Responsive Design"] },
  { title: "Data & Tools", items: ["PostgreSQL", "MongoDB", "MySQL", "Git", "GitHub", "n8n"] }
];

export const experience = [
  {
    company: "Deluxe Digital Advertising",
    role: "Trainee Agentic AI Engineer",
    period: "Jan 2026 – Present",
    points: [
      "Developed an LLM-powered AI Sales Assistant using LangChain, LangGraph, Node.js and MongoDB.",
      "Implemented RAG-based retrieval, product recommendations, lead qualification and order-assistance workflows.",
      "Integrated lead capture, Telegram notifications and external APIs."
    ]
  },
  {
    company: "P4U Healthcare Pvt Ltd",
    role: "Fullstack Developer Intern",
    period: "Dec 2024 – Jul 2025",
    points: [
      "Developed frontend components and Python-based REST APIs.",
      "Implemented authentication, optimized database queries and resolved application issues."
    ]
  }
];

export const projects = [
  {
    title: "AI Sales Assistant",
    category: "Generative AI · RAG",
    description: "An LLM-powered sales assistant for customer queries, product recommendations, lead qualification and sales-team handoffs.",
    stack: ["LangChain", "LangGraph", "Node.js", "MongoDB"],
    featured: true
  },
  {
    title: "Lux Store E-Commerce Website",
    category: "E-Commerce · Full-Stack",
    description: "A modern e-commerce website focused on product discovery and a smooth online shopping experience with clean storefront UI and integrated AI assistant.",
    link: "https://lux-store-ecomm.vercel.app",
    stack: ["React", "Node.js", "Python", "LangChain", "PostgreSQL"],
    featured: true
  },
  {
    title: "Heaven Nuts E-Commerce Platform",
    category: "E-Commerce · AI Assistant",
    description: "An e-commerce platform for premium dry fruits and snacks with product search, order tracking, and an AI-powered shopping assistant built with FastAPI.",
    stack: ["Python", "FastAPI", "React", "Node.js", "LangChain", "PostgreSQL"],
    featured: true
  },
  {
    title: "DeepFake Detection",
    category: "Machine Learning · Computer Vision",
    description: "A deepfake detection system using ResNet18, with Grad-CAM visualization and PDF reports containing confidence scores and detected frames.",
    stack: ["Python", "PyTorch", "ResNet18", "OpenCV", "Flask"],
    featured: true
  }
];
