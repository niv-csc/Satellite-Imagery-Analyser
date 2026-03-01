import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  mode: 'solar' | 'universe';
  astronomyData?: {
    type: string;
    title: string;
    description: string;
  } | null;
}

export default function ThreeScene({ mode, astronomyData }: ThreeSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;
    camera.position.y = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Create starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 8000;
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {
      const r = 100 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      starsPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starsPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starsPositions[i + 2] = r * Math.cos(phi);
      
      const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.4, 0.5, 0.5 + Math.random() * 0.5);
      starsColors[i] = color.r;
      starsColors[i + 1] = color.g;
      starsColors[i + 2] = color.b;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({ 
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    starsRef.current = stars;
    scene.add(stars);

    if (mode === 'solar') {
      // Create sun
      const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      scene.add(sun);
      
      const sunLight = new THREE.PointLight(0xffaa00, 2, 50);
      sun.add(sunLight);

      // Create planets
      const planets = [
        { color: 0xaaaaaa, size: 0.4, distance: 6 },
        { color: 0xffaa00, size: 0.6, distance: 9 },
        { color: 0x2288ff, size: 0.7, distance: 12 },
        { color: 0xff4422, size: 0.5, distance: 15 },
        { color: 0xffaa66, size: 1.2, distance: 19 },
        { color: 0xeeddbb, size: 1.0, distance: 23 }
      ];

      planets.forEach((planet, i) => {
        const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: planet.color });
        const sphere = new THREE.Mesh(geometry, material);
        const angle = (i / planets.length) * Math.PI * 2;
        sphere.position.x = Math.cos(angle) * planet.distance;
        sphere.position.z = Math.sin(angle) * planet.distance;
        scene.add(sphere);
      });
    } else if (mode === 'universe' && astronomyData) {
      // Create central celestial object
      let color = 0x8844ff;
      if (astronomyData.type === 'nebula') color = 0xff44aa;
      else if (astronomyData.type === 'galaxy') color = 0x44aaff;

      const geometry = new THREE.SphereGeometry(4, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.8
      });
      const object = new THREE.Mesh(geometry, material);
      scene.add(object);

      const light = new THREE.PointLight(color, 2, 40);
      object.add(light);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0001;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mode, astronomyData]);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-[500]" />;
}
