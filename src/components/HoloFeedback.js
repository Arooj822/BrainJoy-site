// src/components/HoloFeedback.js
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function HoloFeedback({
  trigger = 0,
  size = 300,
  duration = 1600,
  correct = true,
  text = "",
  onDone = () => {}
}) {
  const mountRef = useRef(null);
  const cleanupRef = useRef(() => {});

  useEffect(() => {
    if (!trigger || !mountRef.current) return;

    const el = mountRef.current;
    let rafId;
    const startTime = performance.now();

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b1020, 0.0025);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, size / size, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    el.innerHTML = "";
    el.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pLight = new THREE.PointLight(0xffffff, 1);
    pLight.position.set(2, 3, 4);
    scene.add(pLight);

    // Particles
    const group = new THREE.Group();
    const particles = [];
    const geometry = new THREE.SphereGeometry(0.06, 8, 8);
    for (let i = 0; i < 24; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: correct ? 0x7ce7e1 : 0xf76c6c,
        metalness: 0.3,
        roughness: 0.2,
        emissive: correct ? 0x0ff9f5 : 0xff5656,
        emissiveIntensity: 0.3,
      });
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set((Math.random() - 0.5) * 1.8, (Math.random() - 0.2) * 1.6, (Math.random() - 0.5) * 1.2);
      mesh.userData.vx = (Math.random() - 0.5) * 0.04;
      mesh.userData.vy = Math.random() * 0.06 + 0.02;
      mesh.userData.vz = (Math.random() - 0.5) * 0.04;
      mesh.userData.spin = (Math.random() - 0.5) * 0.08;
      particles.push(mesh);
      group.add(mesh);
    }
    scene.add(group);

    // Glowing ring
    const ringGeo = new THREE.RingGeometry(0.6, 1.1, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: correct ? 0x7ce7e1 : 0xf76c6c,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2.6;
    ring.position.y = -0.3;
    scene.add(ring);

    // Floating text plane
    const planeGeo = new THREE.PlaneGeometry(2.6, 0.7);
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 48px Inter, Arial";
    ctx.fillStyle = correct ? "#e8fdfb" : "#ffaaaa";
    ctx.textAlign = "center";
    ctx.fillText(text || (correct ? "Nice! +1" : "Oops! ❌"), canvas.width / 2, 80);
    const tex = new THREE.CanvasTexture(canvas);
    const planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, opacity: 0.95 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.y = 1.4;
    plane.scale.set(0.01, 0.01, 0.01);
    scene.add(plane);

    // Animation
    const animate = (t) => {
      const elapsed = t - startTime;
      const norm = Math.min(1, elapsed / duration);

      particles.forEach((p, idx) => {
        p.position.x += p.userData.vx * (1 + 0.8 * Math.sin(elapsed / 200 + idx));
        p.position.y += p.userData.vy;
        p.position.z += p.userData.vz * (1 + 0.5 * Math.cos(elapsed / 300 + idx));
        p.rotation.x += p.userData.spin;
        p.rotation.y += p.userData.spin;
        if (norm > 0.6) {
          p.material.opacity = Math.max(0, 1 - (norm - 0.6) / 0.4);
          p.scale.setScalar(1 - (norm - 0.6) * 0.6);
        }
      });

      ring.scale.setScalar(1 + 0.6 * Math.sin(elapsed / 120));
      ring.material.opacity = 0.15 + 0.6 * (1 - norm) * 0.4;

      const planeScale = 0.8 + 0.8 * Math.sin(norm * Math.PI);
      plane.scale.setScalar(planeScale * 0.4);
      plane.material.opacity = 0.95 * (1 - norm * 0.9);

      camera.position.x = Math.sin(elapsed / 600) * 0.08;
      camera.position.y = 0.08 * Math.cos(elapsed / 800);
      camera.lookAt(0, 0.4, 0);

      renderer.render(scene, camera);

      if (elapsed < duration) rafId = requestAnimationFrame(animate);
      else {
        renderer.domElement.style.transition = "opacity 300ms";
        renderer.domElement.style.opacity = "0";
        setTimeout(() => {
          try { renderer.dispose(); } catch(e) {}
          if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
          onDone();
        }, 320);
      }
    };

    rafId = requestAnimationFrame(animate);

    cleanupRef.current = () => {
      cancelAnimationFrame(rafId);
      try { renderer.forceContextLoss && renderer.forceContextLoss(); } catch (e) {}
      try { renderer.dispose && renderer.dispose(); } catch (e) {}
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };

    return () => cleanupRef.current();
  }, [trigger, correct, duration, onDone, size, text]); // ✅ added missing dependencies

  return <div ref={mountRef} style={{ width: size + "px", height: size + "px", pointerEvents: "none" }} />;
}

