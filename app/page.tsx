"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Joke = { id: number; question: string; answer: string };

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [joke, setJoke] = useState<Joke | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const drawJoke = async () => {
    setLoading(true);
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

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {joke && (
        <div className={styles.jokeBox}>
          <p style={{ margin: "8px 0", fontWeight: 600 }}>{joke.question}</p>
          <p style={{ margin: "8px 0", color: "#555" }}>{joke.answer}</p>
        </div>
      )}
    </main>
  );
}
