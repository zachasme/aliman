import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import makeSections from "../steps";

type Mode = "system" | "dark" | "light";

export default function Home() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const sections = makeSections();

  return (
    <div className={styles.container}>
      <Head>
        <title>Arch Linux Installation Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <article>
          <h1>Installation cheatsheet</h1>
          {sections.map((section, i) => (
            <section key={i}>
              <h2>{section.title}</h2>
              <ol>
                {section.steps.map((step, i) => (
                  <li key={i}>
                    {step.title && <h3>{step.title}</h3>}
                    <code>
                      {step.code}
                      {step.input && (
                        <pre>
                          <code>{step.input}</code>
                        </pre>
                      )}
                    </code>
                    {step.note && <p>{step.note}</p>}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </article>
      </main>

      <footer className={styles.footer}>
        <fieldset>
          <label>
            <input
              type="radio"
              name="mode"
              checked={mode === "system"}
              onChange={(e) => setMode("system")}
            />{" "}
            System
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              checked={mode === "dark"}
              onChange={(e) => setMode("dark")}
            />{" "}
            Dark
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              checked={mode === "light"}
              onChange={(e) => setMode("light")}
            />{" "}
            Light
          </label>
        </fieldset>
      </footer>
    </div>
  );
}
