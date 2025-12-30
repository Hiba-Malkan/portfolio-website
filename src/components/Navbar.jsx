import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'projects', path: '/projects' },
    { name: 'contact', path: '/contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/95 backdrop-blur-xl border-b-2 border-cyan-400/30' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-3xl font-black tracking-tighter cursor-pointer hover:text-cyan-400 transition-colors">
            <span className="text-white">HIBA </span>
            <span className="text-cyan-400">KHAN</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative uppercase text-sm font-bold tracking-widest transition-colors group ${
                  location.pathname === link.path ? 'text-cyan-400' : 'text-white hover:text-cyan-400'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white z-50 w-10 h-10 flex flex-col justify-center items-center gap-2"
          >
            <span className={`block w-8 h-0.5 bg-cyan-400 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`block w-8 h-0.5 bg-cyan-400 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-8 h-0.5 bg-cyan-400 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-black border-b-2 border-cyan-400/30 transition-all duration-300 ${
          menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="flex flex-col p-6 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`uppercase text-sm font-bold tracking-widest transition-colors text-left ${
                  location.pathname === link.path ? 'text-cyan-400' : 'text-white hover:text-cyan-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;