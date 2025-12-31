import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

const About = () => {
  const [loaded, setLoaded] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => setLoaded(true), []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 20, 140);

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      300
    );
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTS
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const cyan = new THREE.PointLight(0x00ffff, 2, 200);
    cyan.position.set(20, 10, 40);
    scene.add(cyan);
    const purple = new THREE.PointLight(0xff00ff, 1.4, 200);
    purple.position.set(-20, -10, 20);
    scene.add(purple);

    // STAR STREAKS
    const starCount = 12000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      starPos[i * 3 + 2] = -Math.random() * 200;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.8
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // FLOW RIBBONS
    const ribbons = [];
    const ribbonGeo = new THREE.PlaneGeometry(6, 80, 1, 40);
    for (let i = 0; i < 14; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
      });
      const r = new THREE.Mesh(ribbonGeo, mat);
      r.position.set((i - 7) * 8, 0, -Math.random() * 160);
      r.rotation.y = Math.PI / 6;
      scene.add(r);
      ribbons.push(r);
    }

    // MOUSE
    let mx = 0, my = 0;
    const onMouse = e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 8;
      my = (e.clientY / window.innerHeight - 0.5) * 6;
    };
    window.addEventListener('mousemove', onMouse);

    // ANIMATION
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();

      // Stars forward motion
      const pos = stars.geometry.attributes.position.array;
      for (let i = 0; i < starCount; i++) {
        pos[i * 3 + 2] += 0.8;
        if (pos[i * 3 + 2] > 40) pos[i * 3 + 2] = -200;
      }
      stars.geometry.attributes.position.needsUpdate = true;

      // Ribbon flow
      ribbons.forEach((r, i) => {
        r.position.z += 0.6;
        r.position.y = Math.sin(t * 0.8 + i) * 10;
        if (r.position.z > 40) r.position.z = -160;
      });

      camera.position.x += (mx - camera.position.x) * 0.05;
      camera.position.y += (my - camera.position.y) * 0.05;
      camera.lookAt(0, 0, -40);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // RESIZE
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  const stats = [
    ['5', 'projects launched'],
    ['70', 'books read this year'],
    ['300+', 'songs streamed this year'],
    ['cant keep track', 'lines of code written'],
    ['730', 'coffees consumed'],
  ];

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-8 md:px-16 py-20 md:py-40 grid grid-cols-1 xl:grid-cols-3 gap-12 md:gap-24">
        {/* LEFT: MANIFESTO */}
        <div className="xl:col-span-2 space-y-8">
          <h1 className={`text-[8rem] font-black text-white leading-none transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            ABOUT
          </h1>
          
          <div className="space-y-6 max-w-3xl">
            <p className="text-2xl text-gray-300">
              Hi, I'm Hiba! A high-school student and a self-taught (...youtube) developer.
            </p>
            
            <p className="text-lg text-gray-400">
              I'm currently studying physics, chemistry, math and computer science at school. I also do coral reef research after school, after I accidentally went down a rabbit hole of Wikipedia articles about coral bleaching.
            </p>
            
            <p className="text-lg text-gray-400">
              I also founded and tutor at Circuitrex, a robotics non-profit that teaches students robotics. We have taught over 200 students so far!
            </p>
            
            <p className="text-lg text-gray-400">
              When I'm not coding or studying, I enjoy reading fantasy novels, listening to the NBHD, and hiking.
            </p>
            
            <p className="text-lg text-gray-400">
              I like working on social impact and open-source projects, so if you have an idea in mind, contact me!
            </p>
            
            <p className="text-lg text-gray-400 italic">
              but all in all, like everyone else... still building, still learning, still figuring it out.
            </p>
          </div>
        </div>

        {/* RIGHT: STATS - SOFT & MINIMAL */}
        <div className="space-y-12 xl:pt-32">
          {stats.map(([n, l], i) => (
            <div
              key={l}
              className="group relative text-center"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 blur-3xl transition-all duration-700 rounded-full"></div>
              
              {/* Number with soft glow */}
              <div className="relative text-3xl md:text-4xl font-black text-white/90
                            drop-shadow-[0_0_10px_rgba(0,255,255,0)] 
                            group-hover:drop-shadow-[0_0_25px_rgba(0,255,255,0.4)]
                            group-hover:text-cyan-300
                            transition-all duration-500">
                {n}
              </div>
              
              {/* Label */}
              <div className="uppercase tracking-[0.25em] text-gray-500 text-[10px] mt-2 
                            group-hover:text-gray-400 transition-colors duration-500">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;