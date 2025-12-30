import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Projects = () => {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const projects = [
    {
      title: 'VOLUNTEER DUBAI',
      description: 'A platform connecting students with verified volunteering opportunities across Dubai to streamline youth community engagement.',
      tech: ['DJANGO', 'HTML', 'CSS', 'JS']
    },
    {
      title: 'COUNCIL APP',
      description: 'A website aimed at digitizing student council operations, enabling task coordination, announcements, and automated background workflows.',
      tech: ['DJANGO', 'TAILWIND CSS', 'HTML', 'JS', 'CELERY', 'REDIS']
    },
    {
      title: 'CARE CLASSIFY',
      description: 'A triage support tool that classifies patients as in-patient or out-patient to reduce hospital decision time and improve patient flow.',
      tech: ['PYTHON','SVM','HTML', 'CSS', 'JS']
    }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    // === SCENE ===
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 900);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // === PARTICLES ===
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 6000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 220;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.35,
      color: 0x00ffff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // === ASTEROIDS ===
    const rocks = [];
    const rockGeo = new THREE.IcosahedronGeometry(1, 0);

    for (let i = 0; i < 40; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true
      });

      const rock = new THREE.Mesh(rockGeo, mat);
      const scale = Math.random() * 3 + 1;

      rock.scale.set(scale, scale, scale);
      rock.position.set(
        (Math.random() - 0.5) * 180,
        (Math.random() - 0.5) * 180,
        (Math.random() - 0.5) * 180
      );

      rocks.push({
        mesh: rock,
        rot: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        }
      });

      scene.add(rock);
    }

    // === LIGHTS ===
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const cyanLight = new THREE.PointLight(0x00ffff, 2, 120);
    cyanLight.position.set(15, 15, 15);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xff00ff, 1.5, 120);
    purpleLight.position.set(-15, -15, 10);
    scene.add(purpleLight);

    // === MOUSE ===
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = e => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // === ANIMATE ===
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      particles.rotation.y = t * 0.05;
      particles.rotation.x = t * 0.02;

      rocks.forEach(r => {
        r.mesh.rotation.x += r.rot.x;
        r.mesh.rotation.y += r.rot.y;
        r.mesh.rotation.z += r.rot.z;
      });

      camera.position.x += (mouseX * 6 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 6 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();
    setLoaded(true);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* CONTENT */}
      <div
        className={`relative z-10 max-w-6xl mx-auto px-6 py-32 text-white transition-opacity duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h2 className="text-7xl md:text-8xl font-black mb-24">
          PROJECTS
        </h2>

        <div className="space-y-24">
          {projects.map((p, i) => (
            <div
              key={i}
              className="bg-black/60 backdrop-blur-md border border-white/10 p-10 hover:border-cyan-400 transition-all duration-500"
            >
              <h3 className="text-5xl font-black mb-4">{p.title}</h3>
              <p className="text-gray-300 max-w-xl mb-6">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-cyan-400">
                {p.tech.map(t => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
