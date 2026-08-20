import Balatro from './components/Balatro/Balatro';
import CircularGallery from './components/CircularGallery/CircularGallery';
import './App.css';

// Interleaved photos and quote cards — "For Yami — Sona 🤍"
const galleryItems = [
  // Opening — the collective message
  { image: './quote-together.png', text: 'For Yami — Sona 🤍' },

  // Photo + Nani
  { image: './photo-1.jpeg', text: '✨' },
  { image: './quote-nani.png', text: '— Nani' },

  // Photo + Nana
  { image: './photo-2.jpeg', text: '💫' },
  { image: './quote-nana.png', text: '— Nana' },

  // Photo + Papa
  { image: './photo-3.jpeg', text: '🌟' },
  { image: './photo-4.jpeg', text: '💖' },
  { image: './quote-papa.png', text: '— Papa' },

  // Photo + Mummy
  { image: './photo-5.jpeg', text: '🦋' },
  { image: './quote-mummy.png', text: '— Mummy' },

  // Photo + Bhai
  { image: './photo-6.jpeg', text: '🌸' },
  { image: './photo-7.jpeg', text: '✨' },
  { image: './quote-bhai.png', text: '— Bhai' },

  // Photo + Dada
  { image: './photo-8.jpeg', text: '💫' },
  { image: './quote-dada.png', text: '— Dada' },

  // Photo + Dadi
  { image: './photo-9.jpeg', text: '🌟' },
  { image: './photo-10.jpeg', text: '💖' },
  { image: './quote-dadi.png', text: '— Dadi' },

  // Photos + Shreya's messages
  { image: './photo-11.jpeg', text: '🦋' },
  { image: './quote-shreya1.png', text: '— Shreya 🤍' },

  { image: './photo-12.jpeg', text: '🌸' },
  { image: './quote-shreya2.png', text: '— Shreya 🤍' },

  { image: './photo-13.jpeg', text: '✨' },
  { image: './photo-14.jpeg', text: '💫' },
  { image: './quote-shreya3.png', text: '— Shreya 🤍' },

  // Closing photo
  { image: './photo-15.jpeg', text: '🤍' },
];

export default function App() {
  return (
    <div className="app">
      {/* Title overlay */}
      <div className="title-overlay">
        <h1 className="gallery-title">For Yami — Sona 🤍</h1>
      </div>

      {/* Balatro psychedelic animated background */}
      <div className="background-layer">
        <Balatro
          spinRotation={-2}
          spinSpeed={7}
          color1="#f7b8d7"
          color2="#ffffff"
          color3="#162325"
          contrast={3.5}
          lighting={0.4}
          spinAmount={0.25}
          pixelFilter={745}
        />
      </div>

      {/* Circular Gallery overlay */}
      <div className="gallery-layer">
        <CircularGallery
          items={galleryItems}
          bend={1}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.05}
          font="bold 24px Orbitron"
          fontUrl="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
          scrollSpeed={2}
        />
      </div>
    </div>
  );
}
