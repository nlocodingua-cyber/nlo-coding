/**
 * ГАРЯЧІ КЛАВІШІ — один вхід на весь застосунок. Переносний модуль.
 *
 * Cmd+Z скасувати · Cmd+Shift+Z повернути · Ctrl+Y повернути (звичка з Windows)
 * Cmd+C копіювати виділене · Cmd+V вставити
 *
 * Три правила ввічливості, без яких клавіші дратують більше, ніж допомагають:
 *
 * 1. ПОЛЕ ВВОДУ НЕДОТОРКАННЕ. Поки курсор у полі, Cmd+Z скасовує набраний текст, а
 *    Cmd+C копіює виділені символи. Перехопити — зламати те, до чого людина звикла
 *    за двадцять років. Так само з виділеним текстом будь-де на сторінці.
 *
 * 2. СПЕРШУ СВОЯ ВКЛАДКА, ПОТІМ СЕРВЕР. Клієнтський стек знає навіть те, чого немає
 *    в журналі (перетягування вузла). Порожній стек — питаємо сервер: там глибша
 *    пам'ять, і вона переживає перезавантаження сторінки.
 *
 * 3. ОДИН КРОК ЗА РАЗ. Затиснутий Cmd+Z інакше відправляє десяток запитів, які
 *    повертаються в довільному порядку і лишають дані в незрозумілому стані.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { скасувати, повторити } from "./history";
import { вставити, ушеБуфері, type Ноша } from "./clipboard";

const ПОЛЕ = new Set(["INPUT", "TEXTAREA", "SELECT"]);

function уПолі(el: EventTarget | null): boolean {
  const n = el as HTMLElement | null;
  if (!n || typeof n.tagName !== "string") return false;
  return ПОЛЕ.has(n.tagName) || n.isContentEditable === true;
}

/** Людина виділила текст — Cmd+C має копіювати саме його, а не наш об'єкт. */
function єВиділенийТекст(): boolean {
  const s = typeof window !== "undefined" ? window.getSelection() : null;
  return !!s && !s.isCollapsed && (s.toString().trim().length > 0);
}

export type Крюки = {
  /** Глибший крок назад, коли клієнтський стек порожній. */
  серверНазад?: () => Promise<string | null>;
  /** Глибший крок уперед. */
  серверВперед?: () => Promise<string | null>;
  /** Що зараз виділено на екрані — для Cmd+C. null = копіювати нічого. */
  щоКопіювати?: () => Ноша | null;
  /** Куди вставити. Повертає опис зробленого або null, якщо ця ноша тут не підходить. */
  кудиВставити?: (н: Ноша) => Promise<string | null> | string | null;
};

export function KeyboardShortcuts(крюки: Крюки) {
  const [звіт, setЗвіт] = useState<{ текст: string; добре: boolean } | null>(null);
  const зайнято = useRef(false);
  const таймер = useRef<ReturnType<typeof setTimeout> | null>(null);
  const свіжі = useRef(крюки);
  свіжі.current = крюки;

  const показати = useCallback((текст: string, добре = true) => {
    setЗвіт({ текст, добре });
    if (таймер.current) clearTimeout(таймер.current);
    таймер.current = setTimeout(() => setЗвіт(null), 2400);
  }, []);

  const крок = useCallback(async (бік: "назад" | "вперед") => {
    if (зайнято.current) return;
    зайнято.current = true;
    try {
      const свій = бік === "назад" ? await скасувати() : await повторити();
      if (свій) { показати(свій); return; }
      const глибше = бік === "назад" ? свіжі.current.серверНазад : свіжі.current.серверВперед;
      if (!глибше) { показати(бік === "назад" ? "Скасовувати нічого" : "Повертати нічого", false); return; }
      const опис = await глибше();
      показати(опис ?? (бік === "назад" ? "Скасовувати нічого" : "Повертати нічого"), !!опис);
    } catch {
      показати("Не вдалось — спробуй ще раз", false);
    } finally {
      зайнято.current = false;
    }
  }, [показати]);

  useEffect(() => {
    const onKey = async (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
      const k = e.key.toLowerCase();

      if (k === "z") {
        if (уПолі(e.target)) return;
        e.preventDefault();
        void крок(e.shiftKey ? "вперед" : "назад");
        return;
      }
      if (k === "y" && !e.metaKey) {
        if (уПолі(e.target)) return;
        e.preventDefault();
        void крок("вперед");
        return;
      }
      if (k === "c") {
        if (уПолі(e.target) || єВиділенийТекст()) return;   // текст копіює браузер
        const н = свіжі.current.щоКопіювати?.();
        if (!н) return;
        e.preventDefault();
        const { копіювати } = await import("./clipboard");
        await копіювати(н);
        показати(`Скопійовано: ${н.підпис}`);
      }
    };

    const onPaste = async (e: ClipboardEvent) => {
      if (уПолі(e.target)) return;
      const кудись = свіжі.current.кудиВставити;
      if (!кудись) return;
      const н = (await вставити(e)) ?? ушеБуфері();
      if (!н) return;
      e.preventDefault();
      try {
        const опис = await кудись(н);
        показати(опис ?? "Сюди це не вставляється", !!опис);
      } catch {
        показати("Не вдалось вставити", false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("paste", onPaste);
    };
  }, [крок, показати]);

  useEffect(() => () => { if (таймер.current) clearTimeout(таймер.current); }, []);

  if (!звіт) return null;
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2">
      <div
        className={`rounded-lg border px-4 py-2.5 text-[15px] font-medium ${
          звіт.добре
            ? "border-emerald-600 bg-emerald-950 text-emerald-100"
            : "border-neutral-600 bg-neutral-900 text-neutral-100"
        }`}
      >
        {звіт.текст}
      </div>
    </div>
  );
}
