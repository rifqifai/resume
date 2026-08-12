/* ==========================================================================
   Rifqi Fai — Portfolio interactions
   ========================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById("themeToggle");
  var root = document.documentElement;

  function setTheme(theme) {
    root.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
    updateThemeMeta(theme);
  }

  function updateThemeMeta(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0a0b14" : "#f6f7fb");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
    });
    setTheme(root.dataset.theme || "dark"); // sync label + meta on load
  }

  /* ---------- Mobile navigation ---------- */
  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!navLinks || !burger) return;
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
  }

  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navLinks.addEventListener("click", function (e) {
      if (e.target.closest(".nav-link")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header scrolled state ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  }
  onScrollHeader();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  if ("IntersectionObserver" in window && sections.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navAnchors.forEach(function (link) {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ---------- Typewriter effect ---------- */
  var typedEl = document.getElementById("typed");
  if (typedEl && !prefersReducedMotion) {
    var phrases = [
      "Software Engineer",
      "Frontend Engineer",
      "E-Commerce Engineer",
      "UI Accessibility Advocate"
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function type() {
      var current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1900);
          return;
        }
        setTimeout(type, 60 + Math.random() * 70);
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 34);
      }
    }
    setTimeout(type, 600);
  }

  /* ---------- Marquee: duplicate content for seamless loop ---------- */
  var marqueeTrack = document.getElementById("marqueeTrack");
  if (marqueeTrack) {
    var html = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = html + html;
    if (prefersReducedMotion) {
      marqueeTrack.style.animation = "none";
    }
  }

  /* ---------- Parallax blobs (hero) ---------- */
  var blobs = Array.prototype.slice.call(document.querySelectorAll(".hero .blob"));
  if (blobs.length && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    var ticking = false;
    window.addEventListener("pointermove", function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var x = (e.clientX / window.innerWidth - 0.5) * 2;
        var y = (e.clientY / window.innerHeight - 0.5) * 2;
        blobs.forEach(function (blob, i) {
          var depth = (i + 1) * 14;
          blob.style.setProperty(
            "--px",
            (x * depth).toFixed(1) + "px"
          );
          blob.style.setProperty(
            "--py",
            (y * depth).toFixed(1) + "px"
          );
        });
        ticking = false;
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll handler (single passive listener) ---------- */
  window.addEventListener("scroll", onScrollHeader, { passive: true });
})();
