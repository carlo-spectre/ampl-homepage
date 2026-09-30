(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  const yearNodes = document.querySelectorAll("[data-year]");

  yearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const calmMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (finePointer && !calmMotion) {
    const spot = document.createElement("div");
    spot.className = "cursor-spotlight";
    spot.setAttribute("aria-hidden", "true");
    document.body.appendChild(spot);

    let x = 0;
    let y = 0;
    let frame = 0;
    const paint = () => {
      frame = 0;
      spot.style.setProperty("--spot-x", `${x}px`);
      spot.style.setProperty("--spot-y", `${y}px`);
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        x = event.clientX;
        y = event.clientY;
        spot.classList.add("is-on");
        if (!frame) frame = window.requestAnimationFrame(paint);
      },
      { passive: true }
    );
    document.documentElement.addEventListener("pointerleave", () => {
      spot.classList.remove("is-on");
    });
  }

  const kvStack = document.querySelector(".hero-sachet-stack");
  if (kvStack && kvStack.dataset.kvReady !== "true") {
    kvStack.dataset.kvReady = "true";
    const slides = Array.from(kvStack.querySelectorAll(".hero-sachet"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (slides.length > 1 && !reduceMotion) {
      let index = Math.max(
        0,
        slides.findIndex((slide) => slide.classList.contains("is-active"))
      );
      window.setInterval(() => {
        slides[index].classList.remove("is-active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("is-active");
      }, 4200);
    }
  }

  const form = document.querySelector("#contact-form");
  if (form) {
    const status = form.querySelector(".form-status");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameField = form.querySelector("#contact-name");
      const emailField = form.querySelector("#contact-email");
      const messageField = form.querySelector("#contact-message");
      const name = String(nameField.value || "").trim();
      const email = String(emailField.value || "").trim();
      const message = String(messageField.value || "").trim();

      form.querySelectorAll(".field").forEach((field) => field.classList.remove("is-invalid"));

      let valid = true;
      if (!name) {
        nameField.closest(".field").classList.add("is-invalid");
        valid = false;
      }
      if (!emailPattern.test(email)) {
        emailField.closest(".field").classList.add("is-invalid");
        valid = false;
      }
      if (!message) {
        messageField.closest(".field").classList.add("is-invalid");
        valid = false;
      }

      status.hidden = false;
      if (!valid) {
        status.className = "form-status is-error";
        status.textContent = "Add your name, a valid email, and a message.";
        return;
      }

      form.reset();
      status.className = "form-status is-success";
      status.textContent = "Got it. We’ll be in touch.";
    });
  }

  const newsletter = document.querySelector("#newsletter-form");
  if (newsletter) {
    const status = newsletter.querySelector(".form-status");
    const field = newsletter.querySelector("#newsletter-email");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullPlaceholder = field.placeholder;
    const narrow = window.matchMedia("(max-width: 760px)");
    const setPlaceholder = () => {
      field.placeholder = narrow.matches ? "Enter your email" : fullPlaceholder;
    };
    setPlaceholder();
    narrow.addEventListener("change", setPlaceholder);

    newsletter.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = emailPattern.test(String(field.value || "").trim());
      newsletter.classList.toggle("is-invalid", !valid);
      status.hidden = false;
      if (!valid) {
        status.className = "form-status is-error";
        status.textContent = "Add a valid email.";
        return;
      }
      newsletter.reset();
      status.className = "form-status is-success";
      status.textContent = "You’re on the list.";
    });
  }
})();
