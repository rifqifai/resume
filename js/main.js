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
      meta.setAttribute("content", theme === "dark" ? "#0b0a1a" : "#eef0fb");
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
      "Web & E-Commerce Technology",
      "Lecturer"
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

  /* ---------- Avatar border highlight follows cursor across the screen ---------- */
  var avatar = document.querySelector(".about-image-card");
  if (avatar && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    var avatarTicking = false;
    window.addEventListener("pointermove", function (e) {
      if (avatarTicking) return;
      avatarTicking = true;
      requestAnimationFrame(function () {
        var r = avatar.getBoundingClientRect();
        // Project the cursor direction onto the ring so the glow always
        // rides the border circle, even when the pointer is far away.
        var cx = r.width / 2;
        var cy = r.height / 2;
        var dx = e.clientX - (r.left + cx);
        var dy = e.clientY - (r.top + cy);
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var px = cx + (dx / dist) * cx;  // ring radius == width/2
        var py = cy + (dy / dist) * cy;
        avatar.style.setProperty("--mx", (px / r.width * 100).toFixed(1) + "%");
        avatar.style.setProperty("--my", (py / r.height * 100).toFixed(1) + "%");
        avatarTicking = false;
      });
    });
  }

  /* ---------- Scroll handler (single passive listener) ---------- */
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Experience section: node/network canvas background ----------
     Lightweight Canvas2D particle network (no video/GIF/Lottie/external
     assets). Node count adapts to the section's area, connections are only
     drawn between nearby nodes, and the whole thing pauses automatically
     when off-screen, when the tab is hidden, or when the user has asked
     for reduced motion — so it stays cheap on both desktop and mobile. */
  (function initExperienceNetwork() {
    var section = document.getElementById("experience");
    var canvas = document.getElementById("experienceCanvas");
    if (!section || !canvas) return;

    if (prefersReducedMotion) {
      // Static, non-animated placeholder — no canvas drawing, no rAF loop.
      canvas.classList.add("is-static");
      return;
    }

    var ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;
    var nodes = [];
    var animId = null;
    var running = false;
    var isVisible = false;

    // Palette pulled from the existing gradient tokens so it matches the
    // site's theme instead of hardcoding unrelated colors.
    var styles = getComputedStyle(document.documentElement);
    function hexToRgb(hex) {
      hex = (hex || "").trim().replace("#", "");
      if (hex.length === 3) {
        hex = hex.split("").map(function (c) { return c + c; }).join("");
      }
      var num = parseInt(hex, 16);
      if (isNaN(num)) return { r: 139, g: 92, b: 246 };
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }
    var palette = [
      hexToRgb(styles.getPropertyValue("--grad-2")), // violet
      hexToRgb(styles.getPropertyValue("--grad-3")), // indigo
      hexToRgb(styles.getPropertyValue("--grad-5"))  // ocean blue
    ];

    var MAX_LINK_DIST = 140;
    var MIN_NODES = 16;
    var MAX_NODES = 70;

    function nodeCountFor(w, h) {
      var area = w * h;
      var estimate = Math.round(area / 13000);
      return Math.max(MIN_NODES, Math.min(MAX_NODES, estimate));
    }

    function makeNode() {
      var speed = 0.18 + Math.random() * 0.28;
      var angle = Math.random() * Math.PI * 2;
      var color = palette[(Math.random() * palette.length) | 0];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 1.8 + Math.random() * 2.2, // bolder node size
        color: color
      };
    }

    function buildNodes() {
      var target = nodeCountFor(width, height);
      nodes = [];
      for (var i = 0; i < target; i++) nodes.push(makeNode());
    }

    // Resize the canvas to match the section's rendered box, scaled for
    // device pixel ratio so lines stay crisp without over-drawing.
    function resize() {
      var rect = section.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // Update + draw nodes
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x <= 0 || n.x >= width) { n.vx *= -1; n.x = Math.max(0, Math.min(width, n.x)); }
        if (n.y <= 0 || n.y >= height) { n.vy *= -1; n.y = Math.max(0, Math.min(height, n.y)); }
      }

      // Connections between nearby nodes (O(n^2) but n is capped ~70)
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var na = nodes[a], nb = nodes[b];
          var dx = na.x - nb.x;
          var dy = na.y - nb.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_LINK_DIST) {
            var alpha = (1 - dist / MAX_LINK_DIST) * 0.35;
            ctx.strokeStyle = "rgba(" + na.color.r + "," + na.color.g + "," + na.color.b + "," + alpha + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes on top of their connections — emphasized with a soft
      // glow so the "network node" reads clearly against the background.
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        var glow = "rgba(" + node.color.r + "," + node.color.g + "," + node.color.b + ",0.9)";
        ctx.save();
        ctx.shadowColor = glow;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + node.color.r + "," + node.color.g + "," + node.color.b + ",1)";
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      running = true;
      animId = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    }

    // Only animate while the section is actually on screen.
    if ("IntersectionObserver" in window) {
      var visObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isVisible = entry.isIntersecting;
            if (isVisible && document.visibilityState === "visible") start();
            else stop();
          });
        },
        { threshold: 0.01 }
      );
      visObserver.observe(section);
    } else {
      isVisible = true;
      start();
    }

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && isVisible) start();
      else stop();
    });

    // Debounced resize so continuous window dragging doesn't thrash layout.
    var resizeTimer = null;
    function scheduleResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }
    window.addEventListener("resize", scheduleResize);

    resize();
  })();
})();