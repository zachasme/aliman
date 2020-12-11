import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import makeSections, { defaultOptions, Step, Options } from "../steps";
import Instructions from "../components/Instructions";

type Mode = "system" | "dark" | "light";

export default function Home() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const options = defaultOptions;

  const sections = makeSections(options);

  return (
    <div className={styles.container}>
      <Head>
        <title>Arch Linux Installation Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <fieldset>
        <legend>text editor</legend>
        <label>
          <input type="radio" name="editor" /> vim
        </label>
        <label>
          <input type="radio" name="editor" /> nano
        </label>
      </fieldset>

      <main className={styles.main}>
        <Instructions />
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
