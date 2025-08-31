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
    <>
      <main
        className={styles.container}
        style={{ filter: isAnswerVisible ? "blur(5px)" : "none" }}
      >
        <h1 className={styles.header}>DajSuchara</h1>
        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={drawJoke}
            disabled={loading}
          >
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
          <div
            className={styles.jokeBox}
            onClick={() => setIsAnswerVisible(true)}
          >
            <p className={styles.joke_question}>{joke.question}</p>
          </div>
        )}
      </main>

      {/* Modal renderowany zawsze (tylko z display: none/flex) */}
      <div
        className={`${styles.modalOverlay} ${
          isAnswerVisible ? styles.show : styles.hide
        }`}
        onClick={() => setIsAnswerVisible(false)}
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={styles.modalClose}
            onClick={() => setIsAnswerVisible(false)}
          ></button>
          <p className={styles.joke_answer}>{joke?.answer}</p>
        </div>
      </div>
    </>
  );
}
