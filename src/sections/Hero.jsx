import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

const Hero = () => {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const phrases = [
    "CODE WIZARD",
    "FULL STACK DEV.",
    "PROBLEM SOLVER",
    "CREATIVE",
    "STUDENT",
    "WEB SORCERER",
  ];

  useEffect(() => {
    let charIndex = 0;
    const currentPhrase = phrases[textIndex];
    
    setIsTyping(true);
    setDisplayText('');
    
    const typeInterval = setInterval(() => {
      if (charIndex < currentPhrase.length) {
        setDisplayText(currentPhrase.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        
        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % phrases.length);
        }, 1500);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [textIndex]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 1000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 200;
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.3,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const rocks = [];
    const rockGeometry = new THREE.IcosahedronGeometry(1, 0);
    for (let i = 0; i < 30; i++) {
      const material = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9, metalness: 0.1, flatShading: true });
      const rock = new THREE.Mesh(rockGeometry, material);
      const scale = Math.random() * 3 + 0.5;
      rock.scale.set(scale, scale, scale);
      rock.position.set(
        (Math.random() - 0.5) * 150, 
        (Math.random() - 0.5) * 150, 
        -Math.random() * 80 - 20
      );
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rocks.push({ mesh: rock, rotationSpeed: { x: Math.random() * 0.05, y: Math.random() * 0.05, z: Math.random() * 0.05 } });
      scene.add(rock);
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const point1 = new THREE.PointLight(0x00ffff, 2, 100); 
    point1.position.set(10, 10, 10); 
    scene.add(point1);
    const point2 = new THREE.PointLight(0xff00ff, 1.5, 100); 
    point2.position.set(-10, -10, 10); 
    scene.add(point2);

    let mouseX = 0; 
    let mouseY = 0;
    const onMouseMove = e => { 
      mouseX = (e.clientX / window.innerWidth) * 2 - 1; 
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1; 
    };
    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      particlesMesh.rotation.y = t * 0.3;
      particlesMesh.rotation.x = t * 0.15;

      rocks.forEach(r => {
        r.mesh.rotation.x += r.rotationSpeed.x;
        r.mesh.rotation.y += r.rotationSpeed.y;
        r.mesh.rotation.z += r.rotationSpeed.z;
      });

      camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 10 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
    setLoaded(true);

    const handleResize = () => { 
      camera.aspect = window.innerWidth / window.innerHeight; 
      camera.updateProjectionMatrix(); 
      renderer.setSize(window.innerWidth, window.innerHeight); 
    };
    window.addEventListener('resize', handleResize);

    return () => { 
      window.removeEventListener('mousemove', onMouseMove); 
      window.removeEventListener('resize', handleResize); 
      renderer.dispose(); 
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-6 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tight text-white drop-shadow-2xl animate-fade-in">
          {displayText}<span className={`${isTyping ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-2xl mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Using science, code, and creativity to solve problems… sometimes intentionally, sometimes with luck.
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; opacity: 0; }
      `}</style>
    </section>
  );
};

export default Hero;