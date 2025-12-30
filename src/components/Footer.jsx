import { useEffect, useRef, useState } from 'react';

const Footer = () => {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !inView) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const footerHeight = sectionRef.current.offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = footerHeight;

    let blackout = false;
    let blackoutDuration = 0;
    let scanlineY = 0;
    let horizontalGlitchY = Math.random() * canvas.height;
    let colorShift = 0;
    let animationId;
    let vhsDistortion = 0;

    const animate = () => {
      // Random full blackout
      if (Math.random() < 0.015) {
        blackout = true;
        blackoutDuration = Math.random() * 60 + 30; // 0.5-1.5 seconds
      }

      if (blackout) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        blackoutDuration--;
        if (blackoutDuration <= 0) {
          blackout = false;
        }
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Clear with slight fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // STATIC NOISE 
      if (Math.random() < 0.5) { // Only render 50% of frames
        const noiseIntensity = 0.01;
        for (let i = 0; i < canvas.width * canvas.height * noiseIntensity; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const brightness = Math.random() * 255;
          
          ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.3)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // HORIZONTAL SCANLINE
      scanlineY += 3;
      if (scanlineY > canvas.height) scanlineY = 0;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, scanlineY, canvas.width, 2);

      // HORIZONTAL GLITCH BARS
      if (Math.random() < 0.06) {
        horizontalGlitchY = Math.random() * canvas.height;
        colorShift = Math.random();
      }

      const barHeight = 3 + Math.random() * 8;
      const glitchColor = colorShift > 0.7 ? 'rgba(255, 0, 0, 0.3)' : 
                          colorShift > 0.4 ? 'rgba(0, 255, 255, 0.3)' : 
                          'rgba(0, 255, 0, 0.3)';
      
      ctx.fillStyle = glitchColor;
      ctx.fillRect(0, horizontalGlitchY, canvas.width, barHeight);

      // VERTICAL INTERFERENCE LINES
      if (Math.random() < 0.04) {
        const x = Math.random() * canvas.width;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // VHS DISTORTION
      if (Math.random() < 0.03) {
        vhsDistortion = (Math.random() - 0.5) * 10;
      } else {
        vhsDistortion *= 0.95;
      }
      
      if (Math.abs(vhsDistortion) > 0.5) {
        const offset = Math.floor(vhsDistortion);
        const stripY = Math.floor(Math.random() * canvas.height);
        const stripHeight = Math.floor(Math.random() * 40 + 10);
        const imageData = ctx.getImageData(0, stripY, canvas.width, stripHeight);
        ctx.putImageData(imageData, offset, stripY);
      }

      // COLOUR SEPARATION
      if (Math.random() < 0.04) {
        const aberrationAmount = Math.floor(Math.random() * 3) + 1;
        const y = Math.floor(Math.random() * canvas.height);
        const h = 2;
        
        ctx.fillStyle = `rgba(255, 0, 0, 0.15)`;
        ctx.fillRect(aberrationAmount, y, canvas.width, h);
        ctx.fillStyle = `rgba(0, 255, 255, 0.15)`;
        ctx.fillRect(-aberrationAmount, y, canvas.width, h);
      }

      // SIGNAL DROPOUT
      if (Math.random() < 0.008) {
        const dropoutY = Math.floor(Math.random() * canvas.height);
        const dropoutHeight = Math.floor(Math.random() * 60 + 20);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, dropoutY, canvas.width, dropoutHeight);
      }

      // FLICKERING VIGNETTE
      if (Math.random() < 0.15) {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
          canvas.width / 2, canvas.height / 2, canvas.height * 0.7
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${Math.random() * 0.3})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // RANDOM DEAD PIXELS
      if (Math.random() < 0.3) {
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? '#ff0000' : '#00ffff';
          ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }
      }

      // RANDOM PIXEL BLOCKS
      if (Math.random() < 0.08) {
        const blockX = Math.random() * canvas.width;
        const blockY = Math.random() * canvas.height;
        const blockW = Math.random() * 60 + 10;
        const blockH = Math.random() * 30 + 5;
        
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.12)`;
        ctx.fillRect(blockX, blockY, blockW, blockH);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    setLoaded(true);

    const resize = () => {
      const footerHeight = sectionRef.current.offsetHeight;
      canvas.width = window.innerWidth;
      canvas.height = footerHeight;
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [inView]);

  return (
    <footer ref={sectionRef} className="relative h-[40vh] w-full overflow-hidden bg-black border-t border-white/10">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div
        className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-6 transition-opacity duration-2000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="glitch-hard text-white text-xs tracking-[0.45em] mb-2">
          Hiba Khan
        </p>

        <p className="glitch-soft text-gray-500 text-[10px] font-mono tracking-wider mb-6">
          signal lost. connection fading.
        </p>

        <div className="flex gap-6 flex-wrap justify-center">
          {[
            { label: 'CONTACT', href: '/contact' },
            { label: 'ARCHIVE', href: '/archive' },
            { label: 'SOURCE', href: 'https://github.com/Hiba-Malkan/portfolio-website.git' }
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              className="
                group relative
                px-6 py-3 text-[10px]
                tracking-[0.3em] uppercase
                text-gray-400
                border border-white/10
                hover:text-white
                hover:border-cyan-400
                hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]
                transition-all duration-500
                overflow-hidden
              "
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute inset-0 bg-cyan-400/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            </a>
          ))}
        </div>
        
        <p className="mt-8 text-[8px] text-gray-700 font-mono tracking-wider animate-pulse">
          © 2025 • ALL RIGHTS RESERVED • STAND BY
        </p>
      </div>

      <style jsx>{`
        .glitch-hard {
          animation: hard-glitch 2.5s infinite;
          text-shadow:
            2px 0 red,
           -2px 0 blue,
            0 0 12px rgba(255,255,255,0.2);
        }

        .glitch-soft {
          animation: soft-glitch 4s infinite;
          text-shadow:
            1px 0 magenta,
           -1px 0 cyan;
        }

        @keyframes hard-glitch {
          0% { transform: translate(0); opacity: 1; }
          10% { transform: translate(-2px, 1px); opacity: 0.8; }
          20% { transform: translate(0); opacity: 1; }
          30% { transform: translate(2px, -1px); opacity: 0.7; }
          40% { transform: translate(0); opacity: 1; }
          100% { transform: translate(0); opacity: 1; }
        }

        @keyframes soft-glitch {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;