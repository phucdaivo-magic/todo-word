/* ===============================
   DEV HOT RELOAD (esbuild)
================================ */
new EventSource("/esbuild").addEventListener("change", () =>
  location.reload()
);

/* ===============================
   GSAP SETUP
================================ */
import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// gsap.registerPlugin(ScrollTrigger);

/* ===============================
   SECTIONS SETUP
================================ */
const sections = gsap.utils.toArray("section");

gsap.set(sections, {
  position: "absolute",
  width: "100%",
  top: (i) => `${i * 100}%`,
});



/* ===============================
   TIMELINE
================================ */
const tl = gsap.timeline({
  paused: true,
  defaults: {
    duration: 1,
    ease: "power2.inOut",
  },
});

document.querySelectorAll("[data-timeline]").forEach(item => {
  const timelines = JSON.parse(item.dataset.timeline);
  timelines.forEach(timeline => {
    tl.addLabel(timeline.label).to(item, { ...timeline }, "<");
  });
});


/* ===============================
   PHASE 1 – SECTION 1 (HOLD)
================================ */
// tl.addLabel("section-1");

/* ===============================
   PHASE 2 – MOVE TO SECTION 2
================================ */
tl.addLabel("section-2")
  .to(sections, {
    yPercent: -100,
  });

/* ===============================
   PHASE 2 CONTENT SCROLL
================================ */
const section2 = document.querySelector(".section-2");
const section2Content = section2.querySelector(".frame-2-content > *");

const contentScrollY =
  section2.offsetHeight - section2Content.offsetHeight - 32;

tl.addLabel("section-2-content")
  .to(".frame-2-content", {
    y: contentScrollY > 0 ? 0 : contentScrollY,
    ease: "circ.inOut",
  });

/* ===============================
   PHASE 3 – MOVE TO SECTION 3
================================ */
tl.addLabel("section-3")
  .to(sections, {
    yPercent: -200,
  });

/* ===============================
   PHASE 4 – MOVE TO SECTION 4
================================ */
tl.addLabel("section-4")
  .to(sections, {
    yPercent: -300,
  });

/* ===============================
   STEP CONTROLLER
================================ */
const stepNames = Object.keys(tl.labels);
let currentStep = -1;

function goToStep(index) {
  currentStep = gsap.utils.clamp(0, stepNames.length - 1, index);
  tl.tweenTo(stepNames[currentStep]);
}

/* ===============================
   KEYBOARD CONTROLS
================================ */
window.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "ArrowDown":
    case "ArrowRight":
    case "Space":
      goToStep(currentStep + 1);
      break;

    case "ArrowUp":
    case "ArrowLeft":
      goToStep(currentStep - 1);
      break;
  }
});

/* ===============================
   OPTIONAL: START AT FIRST STEP
================================ */
goToStep(0);
