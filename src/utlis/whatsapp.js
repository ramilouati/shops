export const WHATSAPP_PHONE = "21620000000";

export function whatsappOrderUrl({ items, total, orderNumber, name, phone }) {
  const lines = (items || [])
    .map((item) => `• ${item.title} x${item.quantity}`)
    .join("\n");
  const text = [
    "Bonjour TuniShop, je souhaite commander :",
    lines,
    total != null ? `Total : ${total} TND` : "",
    orderNumber ? `Commande : ${orderNumber}` : "",
    name ? `Nom : ${name}` : "",
    phone ? `Tél : ${phone}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
