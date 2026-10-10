import { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Menu,
  Send,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { profile, skills, experience, projects } from "./data/portfolio";
import { sendChatMessage, sendContactMessage } from "./services/api";

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="muted">{text}</p>}
    </div>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! Ask me about Nawaz's projects, skills or experience.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    setMessages((current) => [...current, { role: "user", text: message }]);
    setInput("");
    setBusy(true);
    try {
      const result = await sendChatMessage(message);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: result.answer,
          sources: result.sources || [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: `${error.message} Check that the Django backend and LLM configuration are running.`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <aside
        className={`chat-panel ${open ? "open" : ""}`}
        aria-label="AI portfolio assistant"
        aria-hidden={!open}
      >
        <div className="chat-top">
          <div>
            <strong>
              <Bot size={18} /> Portfolio AI
            </strong>
            <small>Ask about projects and experience</small>
          </div>
          <button
            className="icon-button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
        <div className="chat-messages">
          {messages.map((item, index) => (
            <div
              className={`message ${item.role}`}
              key={`${index}-${item.role}`}
            >
              <p>{item.text}</p>
              {item.sources?.length > 0 && (
                <small>Sources: {item.sources.join(", ")}</small>
              )}
            </div>
          ))}
          {busy && (
            <div className="message assistant thinking">
              <p className="thinking-text">
                Thinking
                <span className="dots">
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </span>
              </p>
            </div>
          )}
        </div>
        <div className="chat-suggestions">
          {[
            "Tell me about the AI Sales Assistant",
            "What AI skills does Nawaz have?",
          ].map((q) => (
            <button key={q} onClick={() => setInput(q)}>
              {q}
            </button>
          ))}
        </div>
        <form className="chat-form" onSubmit={submit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            maxLength={1000}
            aria-label="Chat message"
          />
          <button disabled={busy || !input.trim()} aria-label="Send message">
            <Send size={17} />
          </button>
        </form>
      </aside>
      <button
        className={`chat-launcher ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
      >
        {open ? (
          <X />
        ) : (
          <>
            <Bot />
            <span>Ask AI</span>
          </>
        )}
      </button>
    </>
  );
}

function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [contactState, setContactState] = useState({
    busy: false,
    message: "",
    error: false,
  });

  async function submitContact(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setContactState({ busy: true, message: "", error: false });
    try {
      const result = await sendContactMessage({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
      });
      setContactState({ busy: false, message: result.message, error: false });
      formElement?.reset();
    } catch (error) {
      setContactState({ busy: false, message: error.message, error: true });
    }
  }

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll(".scroll-reveal")
        .forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const nav = [
    ["About", "#about"],
    ["Skills", "#skills"],
    ["Experience", "#experience"],
    ["Projects", "#projects"],
    ["Contact", "#contact"],
  ];
  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#home">
          NAWAZ GADIWALE<span>.</span>
        </a>
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle navigation"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
        <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
          {nav.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMobileMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact">
          Let's talk <ArrowUpRight size={16} />
        </a>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> OPEN TO AI & SOFTWARE
              OPPORTUNITIES
            </p>
            <h1>
              Building useful things with <span>AI & code.</span>
            </h1>
            <p className="hero-text">{profile.summary}</p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">
                Explore my work <ArrowUpRight size={17} />
              </a>
              <a
                className="button secondary"
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                View resume <ArrowDown size={17} />
              </a>
            </div>
            <div className="hero-meta">
              <span>{profile.location}</span>
              <span>Python · React · GenAI</span>
            </div>
          </div>
          <div className="hero-art" aria-label="AI engineering visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="core">
              <Bot size={58} />
              <span>AI / ML</span>
            </div>
            <span className="float-chip chip-one">LLM + RAG</span>
            <span className="float-chip chip-two">Python</span>
            <span className="float-chip chip-three">Automation</span>
            <div className="art-caption">FROM IDEAS TO WORKING SYSTEMS</div>
          </div>
        </section>

        <section
          className="section-wrap about-section scroll-reveal"
          id="about"
        >
          <SectionHeading
            eyebrow="A LITTLE ABOUT ME"
            title="Engineering with purpose."
            text="I enjoy connecting software engineering and AI to solve practical problems."
          />
          <div className="about-grid">
            <div className="about-card">
              <span className="card-number">01 / BUILD</span>
              <h3>AI applications</h3>
              <p>
                LLM applications, retrieval-augmented generation and structured
                conversational workflows.
              </p>
            </div>
            <div className="about-card">
              <span className="card-number">02 / SHIP</span>
              <h3>Full-stack systems</h3>
              <p>
                Responsive interfaces, Python APIs, database integration and
                external service connections.
              </p>
            </div>
            <div className="about-card">
              <span className="card-number">03 / IMPROVE</span>
              <h3>Reliable automation</h3>
              <p>
                Designing workflows with clear routing, validation and
                predictable behavior.
              </p>
            </div>
          </div>
        </section>

        <section className="section-wrap scroll-reveal" id="skills">
          <SectionHeading
            eyebrow="TECHNICAL TOOLKIT"
            title="Tools I work with."
          />
          <div className="skills-grid">
            {skills.map((group) => (
              <div className="skill-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="skill-tags">
                  {group.items.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-wrap scroll-reveal" id="experience">
          <SectionHeading eyebrow="WHERE I'VE WORKED" title="Experience." />
          <div className="timeline">
            {experience.map((item) => (
              <article className="timeline-item" key={item.company}>
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <div className="timeline-top">
                    <div>
                      <h3>{item.role}</h3>
                      <p className="company">{item.company}</p>
                    </div>
                    <span className="period">{item.period}</span>
                  </div>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap scroll-reveal" id="projects">
          <SectionHeading
            eyebrow="SELECTED WORK"
            title="Projects with a purpose."
            text="A few examples of AI and software engineering work."
          />
          <div className="project-grid">
            {projects.map((project, index) => (
              <article className="project-card" key={project.title}>
                <div className={`project-visual visual-${index + 1}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="project-ext-link"
                      title={`Visit ${project.title}`}
                      aria-label={`Visit ${project.title}`}
                    >
                      Live <ExternalLink size={12} />
                    </a>
                  )}
                  <div className="visual-symbol">
                    {index === 0 ? (
                      <Bot size={54} />
                    ) : index === 1 ? (
                      <ShoppingBag size={50} />
                    ) : index === 2 ? (
                      <Store size={50} />
                    ) : (
                      <span className="scan-symbol">◉</span>
                    )}
                  </div>
                  <small>{project.category}</small>
                </div>
                <div className="project-body">
                  <h3>
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="project-title-link"
                      >
                        {project.title} <ArrowUpRight size={17} />
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p>{project.description}</p>
                  <div className="skill-tags">
                    {project.stack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section-wrap contact-section scroll-reveal"
          id="contact"
        >
          <div className="contact-intro">
            <SectionHeading
              eyebrow="GET IN TOUCH"
              title="Have a problem worth solving?"
              text="For opportunities, collaboration or questions about my work, send me a message."
            />
            <a className="email-link" href={`mailto:${profile.email}`}>
              <Mail size={18} />
              {profile.email}
              <ArrowUpRight size={16} />
            </a>
            <p className="muted small">{profile.location}</p>
          </div>
          <form className="contact-form" onSubmit={submitContact}>
            <label>
              Name
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Your name"
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                placeholder="Tell me a little about your enquiry..."
              />
            </label>
            <button className="button primary" disabled={contactState.busy}>
              {contactState.busy ? "Sending..." : "Send message"}{" "}
              <Send size={16} />
            </button>
            {contactState.message && (
              <p
                className={
                  contactState.error ? "form-status error" : "form-status"
                }
                role="status"
              >
                {contactState.message}
              </p>
            )}
          </form>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home">
          NG<span>.</span>
        </a>
        <p>Designed and built with React, Django and AI.</p>
        <div className="social-links">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Github />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin />
          </a>
        </div>
        <small>
          © {new Date().getFullYear()} {profile.name}
        </small>
      </footer>
      <ChatWidget />
    </div>
  );
}

export default App;
