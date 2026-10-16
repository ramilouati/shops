import { useContextElement } from "@/context/Context";
import { apiUrl } from "@/utlis/api";
import { whatsappOrderUrl } from "@/utlis/whatsapp";
import { useState } from "react";
import { createPortal } from "react-dom";

const starters = ["Catalogue", "Livraison", "Code promo", "Suivi"];

export default function ShopAssistant() {
  const { cartProducts, totalPrice, shopPhone } = useContextElement();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Bonjour, je suis l’assistant TuniShop. Catalogue, livraison, code promo ou suivi de commande.",
    },
  ]);

  const ask = async (message) => {
    const text = message.trim();
    if (!text || pending) return;
    setMessages((current) => [...current, { from: "me", text }]);
    setDraft("");
    setPending(true);
    try {
      const response = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        { from: "bot", text: data.reply || "Je n’ai pas pu répondre." },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { from: "bot", text: "Le serveur ne répond pas. Écrivez-nous sur WhatsApp." },
      ]);
    } finally {
      setPending(false);
    }
  };

  return createPortal(
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 100000, fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
      {open && (
        <div style={{ width: "min(360px, calc(100vw - 32px))", marginBottom: 10, background: "#fff", borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,.18)", overflow: "hidden" }}>
          <div style={{ background: "#1c1c1c", color: "#fff", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Assistant TuniShop</strong>
            <button type="button" onClick={() => setOpen(false)} style={{ background: "transparent", color: "#fff", border: 0, cursor: "pointer" }}>
              Fermer
            </button>
          </div>
          <div style={{ maxHeight: 320, overflow: "auto", padding: 12, display: "grid", gap: 8 }}>
            {messages.map((message, index) => (
              <p
                key={index}
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  background: message.from === "me" ? "#1c1c1c" : "#f6f4f2",
                  color: message.from === "me" ? "#fff" : "#222",
                  borderRadius: 12,
                  padding: "8px 10px",
                  justifySelf: message.from === "me" ? "end" : "start",
                  maxWidth: "90%",
                }}
              >
                {message.text}
              </p>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "0 12px 8px" }}>
            {starters.map((label) => (
              <button key={label} type="button" onClick={() => ask(label)} style={{ border: "1px solid #ddd", background: "#fff", borderRadius: 999, padding: "4px 10px", cursor: "pointer" }}>
                {label}
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              ask(draft);
            }}
            style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee" }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Votre message"
              aria-label="Message à l’assistant"
              style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: "8px 10px" }}
            />
            <button type="submit" disabled={pending} style={{ background: "#e70013", color: "#fff", border: 0, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}>
              OK
            </button>
          </form>
          <a
            href={whatsappOrderUrl({ items: cartProducts, total: cartProducts.length ? totalPrice : null, shopPhone })}
            target="_blank"
            rel="noreferrer"
            style={{ display: "block", textAlign: "center", padding: "10px 12px 14px", color: "#128C7E" }}
          >
            {cartProducts.length ? "Envoyer le panier sur WhatsApp" : "Écrire sur WhatsApp"}
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{ marginLeft: "auto", display: "block", background: "#e70013", color: "#fff", border: 0, borderRadius: 999, padding: "12px 16px", cursor: "pointer", boxShadow: "0 8px 24px rgba(231,0,19,.35)" }}
      >
        Aide
      </button>
    </div>,
    document.body
  );
}
