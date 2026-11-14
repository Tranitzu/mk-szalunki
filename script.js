/* ==========================================================================
   FL Framework — script.js
   Autor: Falis Konstrukcje Cyfrowe (https://konstrukcjecyfrowe.pl)
   Prawa autorskie: (c) 2026 Falis Konstrukcje Cyfrowe. Wszelkie prawa zastrzeżone.
   ==========================================================================
   Zawartość:
   1. Include HTML (header.html / footer.html przez fetch)
   2. Hamburger menu (mobile)
   3. Zamykanie menu: Escape, klik poza, klik w link
   4. Blokada scrolla przy otwartym menu
   5. Auto-reset przy zmianie breakpointu
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- 1. INCLUDE HTML ---------- */
  async function includeHTML() {
    const targets = document.querySelectorAll("[data-include]");
    for (const el of targets) {
      const src = el.getAttribute("data-include");
      if (!src) continue;
      try {
        const res = await fetch(src, { cache: "no-cache" });
        if (!res.ok) throw new Error(res.status + " " + res.statusText);
        const html = await res.text();
        // Wstrzykujemy jako element rodzeństwa, usuwamy placeholder
        const tpl = document.createElement("template");
        tpl.innerHTML = html.trim();
        el.replaceWith(tpl.content);
      } catch (err) {
        console.warn("[FL] Include nie powiódł się:", src, "—", err.message);
        el.innerHTML =
          '<!-- Include "' +
          src +
          '" nie powiódł się. Uruchom przez serwer HTTP (np. Live Server). -->';
      }
    }
  }

  /* ---------- 2. HAMBURGER MENU ---------- */
  function initMenu() {
    const header = document.querySelector(".fl-header");
    const toggle = document.querySelector(".fl-header__toggle");
    const nav = document.querySelector(".fl-header__nav");

    if (!header || !toggle || !nav) {
      console.warn("[FL] Nie znaleziono elementów menu — sprawdź header.html.");
      return;
    }

    const body = document.body;
    const MOBILE_BP = window.matchMedia("(max-width: 47.99em)");

    function setOpen(open) {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
      body.classList.toggle("fl-no-scroll", open);
    }

    function isOpen() {
      return header.classList.contains("is-open");
    }

    // Klik na hamburger
    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    // Escape zamyka + focus wraca na przycisk
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Klik poza nawigacją zamyka
    document.addEventListener("click", function (e) {
      if (!isOpen()) return;
      if (!header.contains(e.target)) setOpen(false);
    });

    // Klik w link nawigacji zamyka (mobile)
    nav.addEventListener("click", function (e) {
      const link = e.target.closest("a");
      if (!link) return;
      if (MOBILE_BP.matches) setOpen(false);
    });

    // Reset przy zmianie breakpointu
    MOBILE_BP.addEventListener("change", function (e) {
      if (!e.matches) {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        body.classList.remove("fl-no-scroll");
      }
    });
  }

  /* ---------- 3. INIT ---------- */
  document.addEventListener("DOMContentLoaded", async function () {
    await includeHTML();
    initMenu();
  });
})();
