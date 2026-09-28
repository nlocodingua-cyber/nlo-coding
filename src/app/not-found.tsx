/**
 * Сторінка 404 — самодостатня й синхронна навмисно. Дві причини, обидві перевірені
 * дослідом на Next 16.1.6, а не взяті з документації:
 *
 * 1. До межі not-found layout локалі не застосовується — немає ні шрифтів, ні теми,
 *    ні NextIntlClientProvider. useTranslations тут мовчки падає, і сторінка виходить
 *    порожньою. Тому текст і стилі вписані руками.
 * 2. Будь-який динамічний виклик — cookies(), headers() — ламає рендер так само
 *    тихо. Тому мову тут не визначити: сторінка говорить мовою сайту за
 *    замовчуванням і дає окремий вихід на англійську версію.
 */
export default function NotFound() {
  return (
    <div
      lang="uk"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0d14",
        color: "#e2e8f0",
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <main style={{ textAlign: "center", maxWidth: "430px" }}>
        <p
          style={{
            fontSize: "72px",
            lineHeight: 1,
            fontWeight: 700,
            margin: "0 0 24px",
            color: "rgba(226,232,240,0.28)",
          }}
        >
          404
        </p>
        <h1 style={{ fontSize: "26px", fontWeight: 600, margin: "0 0 12px" }}>
          Такої сторінки немає
        </h1>
        <p style={{ margin: "0 0 32px", color: "rgba(226,232,240,0.6)", lineHeight: 1.6 }}>
          Адресу могли набрати з помилкою, або сторінку прибрали.
        </p>
        <a
          href="/uk"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            borderRadius: "12px",
            background: "#e2e8f0",
            color: "#0b0d14",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          На головну
        </a>
        <p style={{ marginTop: "28px", fontSize: "14px" }}>
          <a href="/en" style={{ color: "rgba(226,232,240,0.5)" }} lang="en">
            Go to the English version
          </a>
        </p>
        <p style={{ marginTop: "36px", fontSize: "13px", color: "rgba(226,232,240,0.3)" }}>
          NLO Coding
        </p>
      </main>
    </div>
  );
}
