const logoTargets = [
  { topY: 100, botY: 400 }, // Rung 1
  { topY: 215, botY: 285 }, // Rung 2
  { topY: 165, botY: 335 }, // Rung 3
  { topY: 110, botY: 410 }, // Rung 4 (Center)
  { topY: 165, botY: 335 }, // Rung 5
  { topY: 215, botY: 285 }, // Rung 6
  { topY: 100, botY: 400 }  // Rung 7
];

const centerY = 250;
const waveAmplitude = 130;

let animState = {
  time: 0,
  waveMix: 0,
  logoMix: 0
};

function setup() {
  for (let i = 0; i < 7; i++) {
    gsap.set(`#n${i}-top`, { opacity: 0 });
    gsap.set(`#n${i}-bot`, { opacity: 0 });
    gsap.set(`#b${i}`, { opacity: 0 });
  }
  
  // TWEAK THESE VALUES FOR INITIAL SIZE & CENTERING:
  gsap.set("#dna-mark", { 
    x: 270,                  // Adjust horizontally to center the smaller wave
    scale: 0.50,             // Reduce initial wave scale (e.g., 0.50 instead of 1.0)
    transformOrigin: "center center" 
  });
}

setup();

const tl = gsap.timeline({ onUpdate: updateFrame });

// STEP 1: Reveal 7 main dots sequentially left-to-right
const initialDots = ["#n0-top", "#n1-top", "#n2-bot", "#n3-bot", "#n4-bot", "#n5-top", "#n6-top"];

initialDots.forEach((dotId, i) => {
  tl.to(dotId, {
    opacity: 1,
    duration: 0.15,
    ease: "power1.out"
  }, i * 0.12);
});

tl.to([".bond", ".node"], {
  opacity: 1,
  duration: 0.3
}, 0.8);

// STEP 2: 3D Harmonic Wave Physics
tl.to(animState, {
  waveMix: 1,
  duration: 1.2,
  ease: "power2.out"
}, 0.8);

tl.to(animState, {
  time: Math.PI * 1,
  duration: 1.0,
  ease: "none"
}, 0.8);

// STEP 3: Lock-in to static logo shape (Centered)
tl.to(animState, {
  logoMix: 1,
  duration: 1.8,
  ease: "power3.inOut"
}, "-=1.5");

// STEP 4: Slide Logo further left and scale down slightly more
tl.to("#dna-mark", {
  x: 55,
  scale: 0.20,
  duration: 1.5,
  ease: "power3.inOut"
}, "+=0.3");

// STEP 5: Unveil company name cleanly on the right
tl.to("#clip-rect", {
  width: 650,
  duration: 1.2,
  ease: "power2.out"
}, "+=0.1");

function updateFrame() {
  for (let i = 0; i < 7; i++) {
    const topNode = document.getElementById(`n${i}-top`);
    const botNode = document.getElementById(`n${i}-bot`);
    const bond = document.getElementById(`b${i}`);
    const target = logoTargets[i];

    const phase = animState.time + (i * 0.7);
    const waveOffset = Math.sin(phase) * waveAmplitude * animState.waveMix;

    const waveTopY = centerY - waveOffset;
    const waveBotY = centerY + waveOffset;

    const finalTopY = gsap.utils.interpolate(waveTopY, target.topY, animState.logoMix);
    const finalBotY = gsap.utils.interpolate(waveBotY, target.botY, animState.logoMix);

    topNode.setAttribute("cy", finalTopY);
    botNode.setAttribute("cy", finalBotY);

    bond.setAttribute("y1", finalTopY);
    bond.setAttribute("y2", finalBotY);
  }
}
