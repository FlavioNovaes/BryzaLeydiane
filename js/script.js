"use strict";

// Substitua este link provisório pelo número oficial da Bryza.
const whatsappUrl = "https://wa.me/5524992228797";

function initializeWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function initializeHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  let previousScrollPosition = window.scrollY;

  function updateHeader() {
    const currentScrollPosition = window.scrollY;
    header.classList.toggle("is-scrolled", currentScrollPosition > 16);
    header.classList.toggle("is-hidden", currentScrollPosition > previousScrollPosition && currentScrollPosition > 240 && !header.classList.contains("nav-open"));
    previousScrollPosition = currentScrollPosition;
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

function initializeMobileNavigation() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector("#primary-navigation");
  if (!header || !toggle || !navigation) return;

  function setMenuState(isOpen, returnFocus = false) {
    navigation.classList.toggle("is-open", isOpen);
    header.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação");
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener("click", () => {
    setMenuState(toggle.getAttribute("aria-expanded") !== "true");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuState(false);
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target) && toggle.getAttribute("aria-expanded") === "true") setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenuState(false, true);
  });

  window.matchMedia("(min-width: 1100px)").addEventListener("change", (event) => {
    if (event.matches) setMenuState(false);
  });
}

function initializeActiveSection() {
  const links = [...document.querySelectorAll('.nav__link[href^="#"]')];
  if (!links.length || !("IntersectionObserver" in window)) return;
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  function activateLink(sectionId) {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  const observer = new IntersectionObserver((entries) => {
    const visibleSection = entries.find((entry) => entry.isIntersecting);
    if (visibleSection) activateLink(visibleSection.target.id);
  }, { rootMargin: "-25% 0px -65%", threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

function initializeScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  const timeline = document.querySelector(".timeline");
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    timeline?.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

  revealElements.forEach((element) => observer.observe(element));
  if (timeline) observer.observe(timeline);
}

function initializeReducedMotion() {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  document.querySelector(".timeline")?.classList.add("is-visible");
}

function initializePage() {
  initializeWhatsAppLinks();
  initializeHeader();
  initializeMobileNavigation();
  initializeActiveSection();
  initializeReducedMotion();
  initializeScrollAnimations();
}

document.addEventListener("DOMContentLoaded", initializePage);
