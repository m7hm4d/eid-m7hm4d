const page = document.querySelector("#eidPage");
const giftButton = document.querySelector("#giftButton");
const mainGreeting = document.querySelector("#mainGreeting");
const typedLines = document.querySelector("#typedLines");
const confettiLayer = document.querySelector("#confettiLayer");
const lightToggle = document.querySelector("#lightToggle");
const sheepElements = document.querySelectorAll(".sheep");
const chocolateElements = document.querySelectorAll(".chocolate");
const shareButton = document.querySelector("#shareButton");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const publicShareUrl = "https://m7hm4d.github.io/eid-m7hm4d/";
const greetingTitle = "كل عام وأنتم بخير";
const greetingLines = [
  "بمناسبة عيد الأضحى المبارك",
  "تقبل الله منا ومنكم صالح الأعمال",
  "وأعاد الله عليكم العيد بالخير والبركة والسكينة"
];
const lightCycleDelay = 7000;

let isTyping = false;
let typingRun = 0;
let lightCycleTimer;

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function typeText(element, text, speed, runId) {
  element.textContent = "";
  element.classList.add("typing-caret");

  if (prefersReducedMotion) {
    element.textContent = text;
    element.classList.remove("typing-caret");
    return;
  }

  for (const character of text) {
    if (runId !== typingRun) return;
    element.textContent += character;
    await wait(speed);
  }

  element.classList.remove("typing-caret");
}

async function typeGreeting() {
  const runId = ++typingRun;
  isTyping = true;

  await typeText(mainGreeting, greetingTitle, 68, runId);
  if (runId !== typingRun) return;

  typedLines.classList.add("typing-caret");
  typedLines.textContent = "";

  if (prefersReducedMotion) {
    typedLines.textContent = greetingLines.join("\n");
    typedLines.classList.remove("typing-caret");
    isTyping = false;
    return;
  }

  for (const [index, line] of greetingLines.entries()) {
    for (const character of line) {
      if (runId !== typingRun) return;
      typedLines.textContent += character;
      await wait(38);
    }

    if (index < greetingLines.length - 1) {
      typedLines.textContent += "\n";
      await wait(260);
    }
  }

  typedLines.classList.remove("typing-caret");
  isTyping = false;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function launchConfetti() {
  if (prefersReducedMotion) return;

  const colors = ["#f2c65b", "#fff8ed", "#22c4af", "#d64d67", "#f18d45"];
  const pieces = 92;

  confettiLayer.replaceChildren();

  for (let index = 0; index < pieces; index += 1) {
    const piece = document.createElement("span");
    const angle = randomBetween(0, Math.PI * 2);
    const distance = randomBetween(130, 760);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance + randomBetween(130, 520);

    piece.className = "confetti";
    piece.style.setProperty("--x", `${x}px`);
    piece.style.setProperty("--y", `${y}px`);
    piece.style.setProperty("--size", `${randomBetween(7, 14)}px`);
    piece.style.setProperty("--rotation", `${randomBetween(0, 360)}deg`);
    piece.style.setProperty("--duration", `${randomBetween(1.8, 3.4)}s`);
    piece.style.setProperty("--delay", `${randomBetween(0, 0.18)}s`);
    piece.style.setProperty("--color", colors[index % colors.length]);
    confettiLayer.append(piece);
  }

  window.setTimeout(() => confettiLayer.replaceChildren(), 3600);
}

function openGift() {
  if (isTyping || page.classList.contains("is-open")) return;

  page.classList.add("is-open");
  giftButton.setAttribute("aria-expanded", "true");
  giftButton.disabled = true;
  launchConfetti();
  typeGreeting();
}

function setLightMode(isDay) {
  document.body.classList.toggle("is-day", isDay);
  lightToggle.setAttribute("aria-pressed", String(isDay));
  lightToggle.setAttribute(
    "aria-label",
    isDay ? "تبديل الخلفية إلى الليل" : "تبديل الخلفية إلى النهار"
  );
}

function cycleLightMode() {
  setLightMode(!document.body.classList.contains("is-day"));
}

function restartLightCycle() {
  window.clearInterval(lightCycleTimer);
  lightCycleTimer = window.setInterval(cycleLightMode, lightCycleDelay);
}

function toggleLightMode() {
  cycleLightMode();
  restartLightCycle();
}

function triggerSheepSacrifice(sheep) {
  if (sheep.classList.contains("is-sacrificed")) return;

  sheep.classList.add("is-sacrificed");
  window.setTimeout(() => sheep.classList.remove("is-sacrificed"), 1900);
}

function findClickedElement(elements, event) {
  return [...elements].find((element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  });
}

function biteChocolate(chocolate) {
  if (chocolate.classList.contains("is-eaten")) return;

  const bites = Math.min(Number(chocolate.dataset.bites || 0) + 1, 3);
  const biteClasses = ["bite-one", "bite-two", "bite-three"];

  chocolate.dataset.bites = String(bites);
  chocolate.classList.remove(...biteClasses, "is-biting");
  void chocolate.offsetWidth;
  chocolate.classList.add(biteClasses[bites - 1], "is-biting");

  window.setTimeout(() => chocolate.classList.remove("is-biting"), 520);

  if (bites === 3) {
    chocolate.classList.add("is-eaten");
  }
}

function handleSheepClick(event) {
  if (!page.classList.contains("is-open")) return;

  const clickedSheep = findClickedElement(sheepElements, event);

  if (clickedSheep) {
    triggerSheepSacrifice(clickedSheep);
  }
}

function handleChocolateClick(event) {
  if (!page.classList.contains("is-open")) return;

  const clickedChocolate = findClickedElement(chocolateElements, event);

  if (clickedChocolate) {
    biteChocolate(clickedChocolate);
  }
}

function setShareFeedback(label) {
  shareButton.setAttribute("aria-label", label);
  shareButton.classList.add("is-shared");

  window.setTimeout(() => {
    shareButton.setAttribute("aria-label", "مشاركة بطاقة التهنئة");
    shareButton.classList.remove("is-shared");
  }, 1800);
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(publicShareUrl);
    setShareFeedback("تم نسخ رابط التهنئة");
  } catch {
    window.prompt("انسخ رابط التهنئة", publicShareUrl);
  }
}

async function shareGreeting() {
  const shareData = {
    title: "تهنئة عيد الاضحى المبارك",
    url: publicShareUrl
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      setShareFeedback("تمت مشاركة بطاقة التهنئة");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  await copyShareLink();
}

setLightMode(false);
restartLightCycle();
giftButton.addEventListener("click", openGift);
lightToggle.addEventListener("click", toggleLightMode);
shareButton.addEventListener("click", shareGreeting);
document.addEventListener("click", handleSheepClick);
document.addEventListener("pointerdown", handleChocolateClick);
