/**
 * CAS-NGS Biotech Blocks — Interactive Telemetry, 3D Engine & GSAP Animation
 *
 * Provides:
 * 1. Ionic current waveform telemetry simulator (multi-instance safe)
 * 2. Real-time run timer incrementer
 * 3. Read-length distribution histogram builder
 * 4. GSAP ScrollTrigger physics & word-splitting typography
 * 5. Metric counter animations
 * 6. Background-layer 3D DNA model simulation engine (Three.js + GLTFLoader)
 *    with 1-pose-per-section GSAP ScrollTrigger mapping (1-2-3-1-2-3 pattern)
 *
 * @package CAS_NGS_Biotech_Blocks
 * @version 1.2.1
 */

(function () {
  'use strict';

  var BiotechBlocks = {
    init: function () {
      this.initWaveforms();
      this.initTimers();
      this.initHistograms();
      this.initScrollAnimations();
      this.initDnaBackground();
    },

    /* ============================================================
       1. HERO WAVEFORM TELEMETRY SIMULATOR
       ============================================================ */
    initWaveforms: function () {
      var waveformContainers = document.querySelectorAll('.hero-waveform, [data-cas-waveform]');
      waveformContainers.forEach(function (container) {
        if (container.getAttribute('data-waveform-init') === 'true') return;
        container.setAttribute('data-waveform-init', 'true');

        var barCount = parseInt(container.getAttribute('data-bar-count') || '52', 10);
        var bars = [];
        container.innerHTML = '';

        for (var i = 0; i < barCount; i++) {
          var bar = document.createElement('div');
          bar.className = 'hero-waveform-bar';
          bar.style.height = Math.floor(Math.random() * 70 + 10) + '%';
          container.appendChild(bar);
          bars.push(bar);
        }

        setInterval(function () {
          for (var j = 0; j < 5; j++) {
            var idx = Math.floor(Math.random() * bars.length);
            if (bars[idx]) {
              bars[idx].style.height = Math.floor(Math.random() * 80 + 8) + '%';
            }
          }
        }, 90);
      });
    },

    /* ============================================================
       2. HERO RUN TIMER
       ============================================================ */
    initTimers: function () {
      var timerElements = document.querySelectorAll('[data-cas-timer], #runTimer, .hero-run-timer');
      timerElements.forEach(function (timerEl) {
        if (timerEl.getAttribute('data-timer-init') === 'true') return;
        timerEl.setAttribute('data-timer-init', 'true');

        var initialSec = parseInt(timerEl.getAttribute('data-initial-seconds') || '', 10);
        if (isNaN(initialSec)) {
          var parts = timerEl.textContent.trim().split(':');
          if (parts.length === 3) {
            initialSec = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
          } else {
            initialSec = 2 * 3600 + 14 * 60 + 33;
          }
        }

        var seconds = initialSec;
        setInterval(function () {
          seconds++;
          var h = Math.floor(seconds / 3600);
          var m = Math.floor((seconds % 3600) / 60);
          var s = seconds % 60;
          timerEl.textContent =
            String(h).padStart(2, '0') + ':' +
            String(m).padStart(2, '0') + ':' +
            String(s).padStart(2, '0');
        }, 1000);
      });
    },

    /* ============================================================
       3. READ-LENGTH DISTRIBUTION HISTOGRAM
       ============================================================ */
    initHistograms: function () {
      var histContainers = document.querySelectorAll('.read-dist-bars, [data-cas-readdist]');
      histContainers.forEach(function (container) {
        if (container.getAttribute('data-readdist-init') === 'true') return;
        container.setAttribute('data-readdist-init', 'true');

        var customHeights = container.getAttribute('data-heights');
        var heights;
        if (customHeights) {
          try {
            heights = JSON.parse(customHeights);
          } catch (e) {
            heights = customHeights.split(',').map(function (n) { return parseFloat(n.trim()); });
          }
        }
        if (!Array.isArray(heights) || heights.length === 0) {
          heights = [4, 7, 13, 21, 32, 45, 52, 60, 68, 74, 80, 85, 88, 90, 82, 75, 66, 55, 42, 32, 24, 16, 10, 6, 4];
        }

        container.innerHTML = '';
        heights.forEach(function (h) {
          var bar = document.createElement('div');
          bar.className = 'rdb';
          bar.style.height = h + '%';
          container.appendChild(bar);
        });
      });
    },

    /* ============================================================
       4. GSAP SCROLL ANIMATIONS + COUNTERS
       ============================================================ */
    initScrollAnimations: function () {
      var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Handle Counters
      var counterEls = document.querySelectorAll('[data-counter]');
      counterEls.forEach(function (el) {
        if (el.getAttribute('data-counter-init') === 'true') return;
        el.setAttribute('data-counter-init', 'true');

        var target = parseFloat(el.getAttribute('data-target') || '0');
        var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        var suffix = el.getAttribute('data-suffix') || '';

        if (typeof gsap !== 'undefined') {
          var obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: prefersReduced ? 0 : 2.2,
            ease: 'power2.out',
            scrollTrigger: (typeof ScrollTrigger !== 'undefined') ? {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none none'
            } : null,
            onUpdate: function () {
              el.textContent = obj.val.toFixed(decimals) + suffix;
            },
            onComplete: function () {
              el.textContent = target.toFixed(decimals) + suffix;
            }
          });
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      });

      if (typeof gsap === 'undefined') return;

      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      // Fade Up Elements
      gsap.utils.toArray('.cas-bio-block .gsap-fade-up, .cas-act-1 .gsap-fade-up, .cas-act-2 .gsap-fade-up, .cas-act-3 .gsap-fade-up, .cas-act-4 .gsap-fade-up').forEach(function (el, i) {
        if (el.getAttribute('data-gsap-init') === 'true') return;
        el.setAttribute('data-gsap-init', 'true');

        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: prefersReduced ? 0 : 0.75,
            ease: 'power3.out',
            delay: (i % 4) * 0.07,
            scrollTrigger: (typeof ScrollTrigger !== 'undefined') ? {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none'
            } : null
          }
        );
      });

      // Scale In Elements
      gsap.utils.toArray('.cas-bio-block .gsap-scale-in, .cas-act-1 .gsap-scale-in, .cas-act-2 .gsap-scale-in, .cas-act-3 .gsap-scale-in, .cas-act-4 .gsap-scale-in').forEach(function (el, i) {
        if (el.getAttribute('data-gsap-scale-init') === 'true') return;
        el.setAttribute('data-gsap-scale-init', 'true');

        gsap.fromTo(el,
          { opacity: 0, scale: 0.95, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: prefersReduced ? 0 : 0.7,
            ease: 'power3.out',
            delay: (i % 3) * 0.09,
            scrollTrigger: (typeof ScrollTrigger !== 'undefined') ? {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none'
            } : null
          }
        );
      });

      // Hero Media Frame Special Reveal
      var heroFrames = document.querySelectorAll('.hero-media-frame');
      heroFrames.forEach(function (heroFrame) {
        if (heroFrame.getAttribute('data-frame-init') === 'true') return;
        heroFrame.setAttribute('data-frame-init', 'true');

        gsap.fromTo(heroFrame,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: prefersReduced ? 0 : 1.05,
            ease: 'power3.out',
            delay: 0.55
          }
        );
      });

      // Split words animation on hero titles
      var heroTitles = document.querySelectorAll('.hero-title');
      heroTitles.forEach(function (heroTitle) {
        if (prefersReduced || heroTitle.hasAttribute('data-words-split')) return;
        heroTitle.setAttribute('data-words-split', 'true');

        var words = heroTitle.textContent.trim().split(/\s+/);
        heroTitle.innerHTML = words.map(function (w) {
          return '<span class="hw" style="display:inline-block;opacity:0;transform:translateY(18px)">' + w + '&nbsp;</span>';
        }).join('');

        gsap.to(heroTitle.querySelectorAll('.hw'), {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.06,
          ease: 'power3.out',
          delay: 0.2
        });
      });
    },

    /* ============================================================
       5. 3D DNA SIMULATION ENGINE (THREE.JS + 1-POSE-PER-SECTION GSAP)
       ============================================================ */
    initDnaBackground: function () {
      var bgWrappers = document.querySelectorAll('.cas-dna-bg-wrapper, [data-cas-dna-bg]');
      if (!bgWrappers.length) return;

      bgWrappers.forEach(function (wrapper) {
        if (wrapper.getAttribute('data-dna-init') === 'true') return;
        wrapper.setAttribute('data-dna-init', 'true');

        var canvas = wrapper.querySelector('canvas');
        if (!canvas) {
          canvas = document.createElement('canvas');
          canvas.className = 'cas-dna-webgl-canvas';
          wrapper.appendChild(canvas);
        }

        if (typeof THREE === 'undefined') {
          console.warn('CAS-NGS 3D Engine: Three.js is not loaded.');
          return;
        }

        var defaultModel = (window.casBioBlocksData && window.casBioBlocksData.defaultModelUrl) || '';
        var modelUrl = wrapper.getAttribute('data-model-url') || defaultModel;
        var scaleMultiplier = parseFloat(wrapper.getAttribute('data-scale') || '1.0');
        if (isNaN(scaleMultiplier) || scaleMultiplier <= 0) scaleMultiplier = 1.0;

        var offsetX = parseFloat(wrapper.getAttribute('data-offset-x') || '0.0');
        var offsetY = parseFloat(wrapper.getAttribute('data-offset-y') || '0.0');
        var strandColor = wrapper.getAttribute('data-strand-color') || '#8c6d58';
        var accentColor = wrapper.getAttribute('data-accent-color') || '#4ade80';
        var ambientIntensity = parseFloat(wrapper.getAttribute('data-ambient-intensity') || '1.8');
        var enableCycling = wrapper.getAttribute('data-cycling') !== 'false';

        var width = window.innerWidth;
        var height = window.innerHeight;

        // 1. Scene & Camera
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 6.0);

        // 2. WebGL Renderer with pixel ratio cap (max 2 for smooth 60fps performance)
        var renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

        // 3. Warm Ambient & Directional Lighting Rig
        var ambientLight = new THREE.AmbientLight(0xfff8f0, ambientIntensity);
        scene.add(ambientLight);

        var dirLight1 = new THREE.DirectionalLight(0xffebd9, 1.5);
        dirLight1.position.set(6, 10, 8);
        scene.add(dirLight1);

        var dirLight2 = new THREE.DirectionalLight(0xd4bfae, 1.0);
        dirLight2.position.set(-6, -4, -6);
        scene.add(dirLight2);

        // 4. Model Pivot Group
        var modelPivot = new THREE.Group();
        scene.add(modelPivot);

        var dnaMeshGroup = new THREE.Group();
        modelPivot.add(dnaMeshGroup);

        // Mobile responsive multipliers
        var isMobile = width < 768;
        var mobileScale = isMobile ? 0.65 : 1.0;
        var mobilePos = isMobile ? 0.5 : 1.0;

        /* ------------------------------------------------------------
           3 BASE KEYFRAME POSE CONFIGURATIONS:
           • Pose 1 (Section 1 / Top Hero): Anchors cleanly to Pose 1.
           • Pose 2 (Section 2 / Act 1 Bento): Dynamic tilt & inspection.
           • Pose 3 (Section 3 / Timeline): Wide immersion & depth.
           • Section 4 (CTA / Next): Smoothly loops back to Pose 1.
           ------------------------------------------------------------ */
        var basePoses = [
          {
            // Pose 1 (Top Hero)
            rot: { x: 0.35, y: 0.80, z: -0.45 },
            pos: { x: 0.40, y: 0.05, z: 0.80 },
            camZ: 6.0,
            scale: { x: 1.3, y: 3.2, z: 1.3 }
          },
          {
            // Pose 2 (Bento / Act 2)
            rot: { x: 0.95, y: 2.10, z: 0.50 },
            pos: { x: -0.55, y: 0.10, z: 1.25 },
            camZ: 5.4,
            scale: { x: 1.6, y: 3.6, z: 1.6 }
          },
          {
            // Pose 3 (Timeline / Act 3)
            rot: { x: 1.70, y: 3.50, z: 1.30 },
            pos: { x: 0.45, y: -0.20, z: 0.95 },
            camZ: 6.2,
            scale: { x: 1.2, y: 3.0, z: 1.2 }
          }
        ];

        // Anchor initial state cleanly to Pose 1
        var p1 = basePoses[0];
        modelPivot.rotation.set(p1.rot.x, p1.rot.y, p1.rot.z);
        modelPivot.position.set(
          (p1.pos.x * mobilePos) + offsetX,
          p1.pos.y + offsetY,
          p1.pos.z
        );
        modelPivot.scale.set(
          p1.scale.x * scaleMultiplier * mobileScale,
          p1.scale.y * scaleMultiplier * mobileScale,
          p1.scale.z * scaleMultiplier * mobileScale
        );
        camera.position.z = p1.camZ;

        // Shading Materials
        var strandMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(strandColor),
          roughness: 0.45,
          metalness: 0.25,
          transparent: true,
          opacity: 0.85
        });

        var accentMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(accentColor),
          roughness: 0.40,
          metalness: 0.20,
          transparent: true,
          opacity: 0.90
        });

        // 5. GLTFLoader
        var loadModel = function () {
          if (typeof THREE.GLTFLoader === 'undefined') {
            return;
          }

          var loader = new THREE.GLTFLoader();
          loader.load(
            modelUrl,
            function (gltf) {
              var dnaScene = gltf.scene;

              // Center geometry bounding box inside the pivot group
              var box = new THREE.Box3().setFromObject(dnaScene);
              var center = box.getCenter(new THREE.Vector3());
              dnaScene.position.sub(center);

              var meshIdx = 0;
              dnaScene.traverse(function (child) {
                if (child.isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  var name = (child.name || '').toLowerCase();
                  if (name.includes('base') || name.includes('pair') || (meshIdx % 3 === 2)) {
                    child.material = accentMat;
                  } else {
                    child.material = strandMat;
                  }
                  meshIdx++;
                }
              });

              dnaMeshGroup.add(dnaScene);

              // 6. Section-by-Section GSAP ScrollTrigger Pose Mapping (1 Pose per Section)
              if (enableCycling && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);

                var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (prefersReduced) return;

                // Query page content sections in chronological DOM order
                var sectionSelectors = [
                  '.cas-act-1',
                  '.cas-act-2',
                  '.cas-act-3',
                  '.cas-act-4',
                  '.cas-act-section',
                  '.sylva-hero',
                  '.sylva-footer',
                  'main > section',
                  '#primary-content > section',
                  '.entry-content > section'
                ].join(',');

                var rawSections = document.querySelectorAll(sectionSelectors);
                var sections = [];
                rawSections.forEach(function (sec) {
                  if (sec.classList.contains('cas-dna-bg-wrapper') || sec.offsetHeight < 120) return;
                  var isNested = sections.some(function (p) { return p.contains(sec); });
                  if (!isNested) {
                    sections.push(sec);
                  }
                });

                if (sections.length >= 2) {
                  // Connect each section boundary directly to 1 pose transition:
                  // • Section 0 (Top Hero): Anchors to Pose 1
                  // • Section 1 (Bento): Smoothly interpolates to Pose 2
                  // • Section 2 (Timeline): Smoothly interpolates to Pose 3
                  // • Section 3 (CTA / Next): Smoothly loops back to Pose 1 (+2*PI rotation)
                  for (var i = 0; i < sections.length - 1; i++) {
                    var currentSec = sections[i];
                    var nextSec = sections[i + 1];

                    var targetStep = i + 1;
                    var poseIdx = targetStep % 3; // 0 => Pose 1, 1 => Pose 2, 2 => Pose 3
                    var cycle = Math.floor(targetStep / 3);
                    var targetPose = basePoses[poseIdx];
                    var yAccum = (cycle * 2 * Math.PI);
                    var isLastTransition = (i === sections.length - 2);

                    gsap.timeline({
                      scrollTrigger: {
                        trigger: currentSec,
                        start: 'top top',
                        endTrigger: nextSec,
                        end: isLastTransition ? 'bottom bottom' : 'top top',
                        scrub: 1.8, // Ultra-fluid smooth scrub factor (gentle, cinematic damping)
                        invalidateOnRefresh: true
                      }
                    })
                    .to(modelPivot.rotation, {
                      x: targetPose.rot.x,
                      y: targetPose.rot.y + yAccum,
                      z: targetPose.rot.z,
                      ease: 'power1.inOut'
                    }, 0)
                    .to(modelPivot.position, {
                      x: (targetPose.pos.x * mobilePos) + offsetX,
                      y: targetPose.pos.y + offsetY,
                      z: targetPose.pos.z,
                      ease: 'power1.inOut'
                    }, 0)
                    .to(modelPivot.scale, {
                      x: targetPose.scale.x * scaleMultiplier * mobileScale,
                      y: targetPose.scale.y * scaleMultiplier * mobileScale,
                      z: targetPose.scale.z * scaleMultiplier * mobileScale,
                      ease: 'power1.inOut'
                    }, 0)
                    .to(camera.position, {
                      z: targetPose.camZ,
                      ease: 'power1.inOut'
                    }, 0);
                  }
                } else {
                  // Fallback for single section: 3 transitions across entire page height
                  var fallbackTl = gsap.timeline({
                    scrollTrigger: {
                      trigger: document.body,
                      start: 'top top',
                      end: 'bottom bottom',
                      scrub: 1.8,
                      invalidateOnRefresh: true
                    }
                  });

                  for (var step = 1; step <= 3; step++) {
                    var fallbackPoseIdx = step % 3;
                    var fallbackCycle = Math.floor(step / 3);
                    var fallbackPose = basePoses[fallbackPoseIdx];
                    var fallbackYAccum = (fallbackCycle * 2 * Math.PI);

                    fallbackTl
                      .to(modelPivot.rotation, {
                        x: fallbackPose.rot.x,
                        y: fallbackPose.rot.y + fallbackYAccum,
                        z: fallbackPose.rot.z,
                        ease: 'power1.inOut',
                        duration: 1
                      }, step - 1)
                      .to(modelPivot.position, {
                        x: (fallbackPose.pos.x * mobilePos) + offsetX,
                        y: fallbackPose.pos.y + offsetY,
                        z: fallbackPose.pos.z,
                        ease: 'power1.inOut',
                        duration: 1
                      }, step - 1)
                      .to(modelPivot.scale, {
                        x: fallbackPose.scale.x * scaleMultiplier * mobileScale,
                        y: fallbackPose.scale.y * scaleMultiplier * mobileScale,
                        z: fallbackPose.scale.z * scaleMultiplier * mobileScale,
                        ease: 'power1.inOut',
                        duration: 1
                      }, step - 1)
                      .to(camera.position, {
                        z: fallbackPose.camZ,
                        ease: 'power1.inOut',
                        duration: 1
                      }, step - 1);
                  }
                }
              }
            },
            undefined,
            function (err) {
              console.warn('CAS-NGS 3D Engine: Error loading DNA model at ' + modelUrl, err);
            }
          );
        };

        if (typeof THREE.GLTFLoader !== 'undefined') {
          loadModel();
        } else {
          var retries = 0;
          var checkLoader = setInterval(function () {
            retries++;
            if (typeof THREE.GLTFLoader !== 'undefined') {
              clearInterval(checkLoader);
              loadModel();
            } else if (retries > 35) {
              clearInterval(checkLoader);
              console.warn('CAS-NGS 3D Engine: GLTFLoader failed to load after retries.');
            }
          }, 100);
        }

        // 7. Continuous WebGL Render Loop with subtle idle rotation on inner group
        function renderLoop() {
          requestAnimationFrame(renderLoop);
          dnaMeshGroup.rotation.y += 0.0012;
          renderer.render(scene, camera);
        }
        renderLoop();

        // 8. Responsive Resize Handler
        window.addEventListener('resize', function () {
          var newW = window.innerWidth;
          var newH = window.innerHeight;
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        }, { passive: true });
      });
    }
  };

  // Expose globally for dynamic block editor updates or theme integrations
  window.CAS_NGS_BiotechBlocks = BiotechBlocks;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      BiotechBlocks.init();
    });
  } else {
    BiotechBlocks.init();
  }
})();
