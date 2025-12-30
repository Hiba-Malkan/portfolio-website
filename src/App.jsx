import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor'; 
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Archive from './sections/Archive';


function App() {
  return (
    <Router>
      <Cursor />
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/archive" element={<Archive />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;