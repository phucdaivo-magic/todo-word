
new EventSource('/esbuild').addEventListener('change', () => location.reload())

// import gsap from "gsap";

// get other plugins:
// import ScrollTrigger from "gsap/ScrollTrigger";
// import Flip from "gsap/Flip";
// import Draggable from "gsap/Draggable";

// or all tools are exported from the "all" file (excluding members-only plugins):
import { gsap, ScrollTrigger, Draggable, MotionPathPlugin } from "gsap/all";

// don't forget to register plugins
gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin);

 
// gsap.to('.frame-center-image', {
// 	transform: 'scale(0.5) translateY(-300px)',
// 	top: 0,
// 	scrollTrigger: {
// 		trigger: '.frame-1',
// 		start: "top 0",
// 		end: "+=500",
// 		scrub: true,
// 		markers: true // bật để debug
// 	}
// });


// gsap.to(".frame-center", {
// 	transform: 'translateY(-100%)',
// 	scrollTrigger: {
// 		trigger: '.section-1',
// 		start: "top -500",
// 		end: "+=500",
// 		scrub: true,
// 		markers: true // bật để debug
// 	}
// });
 

// gsap.to(".box-title", {
// 	transform: 'translateY(-300px)',
// 	opacity: 0,
// 	scrollTrigger: {
// 		trigger: '.section-1',
// 		start: "top 0",
// 		end: "+=500",
// 		scrub: true,
// 		markers: true // bật để debug
// 	}
// });
 

// gsap.to(".box-control", {
// 	transform: 'translateY(-300px)',
// 	scrollTrigger: {
// 		start: "top 0",
// 		trigger: '.section-1',
// 		end: "+=500",
// 		scrub: true,
// 		markers: true // bật để debug
// 	}
// });
// gsap.to(".frame-image", {
// 	top: '-100vh',
// 	scrollTrigger: {
// 		start: "top -500",
// 		trigger: '.section-1',
// 		end: "+=500",
// 		scrub: true,
// 		markers: true // bật để debug
// 	}
// });

// gsap.to(".section-2", {
// 	top: '0',
// 	scrollTrigger: {
// 		start: "top -500",
// 		end: "+=500",
// 		scrub: true,
// 		markers: true // bật để debug
// 	}
// });

// gsap.to(".section-2", {
// 	top: '-100%',
// 	scrollTrigger: {
// 		start: "top -500",
// 		end: "+=500",
// 		scrub: true,
// 		markers: true // bật để debug
// 	}
// });


// gsap.to(".section-3", {
// 	top: '0',
// 	scrollTrigger: {
// 		start: "top -2000",
// 		end: "+=500",
// 		scrub: true,
// 		markers: true // bật để debug
// 	}
// });

const sections = gsap.utils.toArray("section");
sections.forEach((sec, i) => {
  gsap.set(sec, { top: `${i * 100}%` });
});



const gsapTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "+=500%", // 1 (hold) + 1 + 1 + 1 + 1
    scrub: true,
    markers: true,
    // snap: {
    //   snapTo: 1 / 4, // 4 phase
    //   duration: 0.8,
    //   ease: "power2.out"
    // }
  }
});

 

/* 🔹 PHASE 1: SCROLL 1 → SECTION 1 ĐỨNG YÊN */
// tl.to(".section-1 .box-title", {
//   y: -500,
//   opacity: 0,
//   duration: 1
// });
// tl.to(".section-1 .frame-center-image", {
//   scale: 0.5,
// 	y: -300,
//   duration: 1
// }, "<");

// tl.to(".section-1 .frame-right-content", {
//   y: -500,
//   opacity: 0,
//   duration: 1
// }, "<");

document.querySelectorAll("[data-timeline]").forEach(item => {
  const timelines = JSON.parse(item.dataset.timeline);
  timelines.forEach(timeline => {
    gsapTimeline.to(item, {...timeline}, "<");
  });
});

 

// /* 🔹 PHASE 2: SCROLL 2 → BẮT ĐẦU KÉO SECTION */
gsapTimeline.to(sections, {
  yPercent: -100,
  ease: "none",
  duration: 1
});

const section2Content = document.querySelector(".frame-2-content").children[0];
const section2 = document.querySelector(".section-2");
const outnerScrollHeight = section2.getBoundingClientRect().height - section2Content.getBoundingClientRect().height - 32;


gsapTimeline.to(".frame-2-content", {
  y: outnerScrollHeight > 0 ? 0: outnerScrollHeight,
  ease: "none",
  duration: 1,
  ease: "circ.inOut",
});


/* 🔹 PHASE 3: SCROLL TIẾP → KÉO SECTION 2 */
gsapTimeline.to(sections, {
  yPercent: -200,
  ease: "none",
  duration: 1
});

/* 🔹 PHASE 4: SCROLL TIẾP → KÉO SECTION 3 */
gsapTimeline.to(sections, {
  yPercent: -300,
  ease: "none",
  duration: 1
});

// gsap.to(".frame-image", {
// 	top: 0,
// 	scrollTrigger: {
// 		trigger: ".frame-image",
// 		start: "top 0",
// 		end: "+=300",
// 		pin: true,
// 		scrub: true,
// 		markers: true // bật để debug
// 	}
// });

// gsap.to(".opacity-title", {
// 	opacity: 0,
// 	scrollTrigger: {
// 		trigger: ".frame",
// 		start: "top 0",
// 		end: "+=300",
// 		scrub: true,
// 		markers: true // bật để debug
// 	}
// });

 

// DEMO 1: Basic animation
// gsap.from(".box", {
// 	opacity: 0,
// 	y: 50,
// 	duration: 1,
// 	ease: "power2.out"
// });

// DEMO 2: Timeline animation
// gsap.timeline({
// 	scrollTrigger: {
// 		trigger: ".timeline",
// 		start: "top 80%"
// 	}
// })
// 	.from(".item", {
// 		scale: 0,
// 		opacity: 0,
// 		stagger: 0.2,
// 		duration: 0.6,
// 		ease: "back.out(1.7)"
// 	});

// DEMO 3: ScrollTrigger + Pin (thay ScrollMagic)
// gsap.to(".pin-text", {
// 	scale: 1.5,
// 	scrollTrigger: {
// 		trigger: ".pin-section",
// 		start: "top top",
// 		end: "+=500",
// 		scrub: true,
// 		pin: true,
// 		markers: true // bật để debug
// 	}
// });