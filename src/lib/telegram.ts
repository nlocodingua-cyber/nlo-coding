// Telegram приймає повідомлення з parse_mode HTML і ВІДХИЛЯЄ все, де є
// незакритий «<» або «&» поза сутністю. Текст із форми вставлявся сирим:
// клієнт пише «бюджет < 5к» або «R&D» — Telegram повертає 400, а маршрут
// це ігнорував. Рядок у базі є, а повідомлення власнику не приходить.
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
