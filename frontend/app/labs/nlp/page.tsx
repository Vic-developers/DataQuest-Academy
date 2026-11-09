"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function Nlp() {
  const [text, setText] = useState("DataQuest Academy enseña datos desde cero");
  const [out, setOut] = useState<any>(null);
  async function run() { setOut(await api("/api/v1/labs/nlp/tokenize", { method: "POST", body: JSON.stringify({ text }) })); }
  return <section>
    <h1 className="text-2xl font-bold">Laboratorio NLP (tokenización)</h1>
    <label className="block mt-2">Texto<textarea className="block w-full border rounded px-3 py-2" rows={3} value={text} onChange={e => setText(e.target.value)} /></label>
    <button className="mt-3 rounded bg-blue-600 px-4 py-2 text-white" onClick={run}>Tokenizar</button>
    {out && <p className="mt-3">Tokens: {out.tokens.join(" | ")} · Vocabulario ({out.vocab_size}): {out.vocab.join(", ")}</p>}
  </section>;
}
