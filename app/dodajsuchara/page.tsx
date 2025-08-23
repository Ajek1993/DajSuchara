"use client";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddJokePage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!question.trim() || !answer.trim()) {
      setError("Uzupełnij oba pola");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/jokes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          answer: answer.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Błąd zapisu");
      }
      router.push("/");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Dodaj suchara</h1>
      <form onSubmit={handleSubmit}>
        <label className={styles.label}>
          Pytanie
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={styles.input}
            required
          />
        </label>
        <label>
          Odpowiedź
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className={styles.input}
            required
          />
        </label>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        <button disabled={saving} type="submit" className={styles.button}>
          {saving ? "Zapisuję..." : "Zapisz"}
        </button>
      </form>
    </main>
  );
}
