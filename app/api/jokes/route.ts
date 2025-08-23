// app/api/jokes/random/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("jokes")
      .select("id, question, answer");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json(null, { status: 200 });
    }

    // Losowy wybór z tablicy
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomJoke = data[randomIndex];

    return NextResponse.json(randomJoke, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { question, answer } = await request.json();
    if (!question || !answer) {
      return NextResponse.json(
        { error: "Brak wymaganych pól" },
        { status: 400 }
      );
    }
    const { error } = await supabaseAdmin
      .from("jokes")
      .insert({ question, answer });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Nieoczekiwany błąd" }, { status: 500 });
  }
}
