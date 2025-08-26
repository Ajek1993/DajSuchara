"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Joke = { id: number; question: string; answer: string };

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [joke, setJoke] = useState<Joke | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const drawJoke = async () => {
    setLoading(true);
    setIsAnswerVisible(false);
    setError(null);
    try {
      const res = await fetch("/api/jokes", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Błąd pobierania");
      setJoke(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.header}>DajSuchara</h1>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={drawJoke} disabled={loading}>
          {loading ? "Losuję..." : "Wylosuj suchara"}
        </button>
        <button
          className={styles.button}
          onClick={() => router.push("/dodajsuchara")}
        >
          Dodaj suchara
        </button>
      </div>

      {error && <p className={styles.joke_error}>{error}</p>}

      {joke && (
        <>
          <div className={styles.jokeBox}>
            <p
              className={styles.joke_question}
              onClick={() => setIsAnswerVisible(!isAnswerVisible)}
            >
              {joke.question}
            </p>
          </div>
          <div
            className={styles.jokeBox}
            style={{
              marginTop: "4px",
              cursor: "auto",
              display: isAnswerVisible ? "block" : "none",
            }}
          >
            <p
              className={styles.joke_answer}
              style={{ display: isAnswerVisible ? "block" : "none" }}
            >
              {joke.answer}
            </p>
          </div>
        </>
      )}
    </main>
  );
}
