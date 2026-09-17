"use client";

import { useState } from "react";

export default function TestChat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.message);
      } else {
        setResponse(data.error);
      }
    } catch (error) {
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>Gemini Chat Test</h1>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        style={{
          width: "400px",
          padding: "12px",
          marginRight: "10px",
        }}
      />

      <button onClick={sendMessage}>
        {loading ? "Thinking..." : "Send"}
      </button>

      {response && (
        <div style={{ marginTop: "30px" }}>
          <strong>AI:</strong>
          <p>{response}</p>
        </div>
      )}
    </main>
  );
}