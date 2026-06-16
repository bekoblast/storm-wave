import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initInteractions() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("is-ready");

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis;
  if (!reduceMotion) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // anchor links use Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis ? lenis.scrollTo(el, { offset: -80 }) : el.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  /* ---------------- Reveal on scroll ---------------- */
  if (!reduceMotion) {
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      const delay = parseFloat(el.dataset.revealDelay || "0");
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // staggered groups
    gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
      gsap.to(group.querySelectorAll("[data-reveal-item]"), {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: { trigger: group, start: "top 82%" },
      });
    });
  } else {
    gsap.set("[data-reveal], [data-reveal-item]", { opacity: 1, y: 0 });
  }

  /* ---------------- Scroll progress bar ---------------- */
  const progress = document.getElementById("scrollProgress");
  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  }

  /* ---------------- Hero parallax + glow drift ---------------- */
  const heroImg = document.querySelector("[data-hero-img]");
  if (heroImg && !reduceMotion) {
    gsap.to(heroImg, {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  /* ---------------- Gentle continuous float ---------------- */
  if (!reduceMotion) {
    gsap.utils.toArray("[data-float]").forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 ? 10 : -12,
        duration: 3 + i * 0.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
  }

  /* ---------------- Nav scrolled state ---------------- */
  const nav = document.getElementById("nav");
  if (nav) {
    ScrollTrigger.create({
      start: "top -60",
      end: 99999,
      onUpdate: (self) => nav.classList.toggle("is-scrolled", self.progress > 0 || self.scroll() > 60),
      onToggle: (self) => nav.classList.toggle("is-scrolled", self.isActive),
    });
    // simpler fallback
    window.addEventListener("scroll", () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    });
  }

  /* ---------------- Animated battery fill ---------------- */
  const battery = document.querySelector("[data-battery]");
  if (battery) {
    const fill = battery.querySelector("[data-battery-fill]");
    const pct = battery.querySelector("[data-battery-pct]");
    ScrollTrigger.create({
      trigger: battery,
      start: "top 75%",
      once: true,
      onEnter: () => {
        if (reduceMotion) {
          fill.style.height = "100%";
          if (pct) pct.textContent = "100%";
          return;
        }
        gsap.to(fill, { height: "100%", duration: 1.8, ease: "power2.out" });
        const counter = { v: 0 };
        gsap.to(counter, {
          v: 100,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => { if (pct) pct.textContent = Math.round(counter.v) + "%"; },
        });
      },
    });
  }

  /* ---------------- Count-up stats ---------------- */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        if (reduceMotion) { el.textContent = target + suffix; return; }
        const o = { v: 0 };
        gsap.to(o, {
          v: target, duration: 1.6, ease: "power2.out",
          onUpdate: () => {
            el.textContent = (target % 1 ? o.v.toFixed(1) : Math.round(o.v)) + suffix;
          },
        });
      },
    });
  });

  /* ---------------- 360 pan & tilt: drag to rotate hint ---------------- */
  const pan = document.querySelector("[data-pan]");
  if (pan) {
    const img = pan.querySelector("[data-pan-img]");
    let active = false, startX = 0, rot = 0;
    pan.addEventListener("pointerdown", (e) => { active = true; startX = e.clientX; pan.classList.add("is-grab"); });
    window.addEventListener("pointerup", () => { active = false; pan.classList.remove("is-grab"); });
    window.addEventListener("pointermove", (e) => {
      if (!active) return;
      rot = Math.max(-22, Math.min(22, (e.clientX - startX) * 0.12));
      img.style.transform = `perspective(900px) rotateY(${rot}deg)`;
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.4, duration: 0.5, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }));
    });
  }

  /* ---------------- Mobile menu ---------------- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        burger.classList.remove("is-open");
        document.body.style.overflow = "";
      })
    );
  }
}
