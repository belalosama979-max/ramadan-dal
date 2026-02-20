import React, { useState, useEffect, useRef } from 'react';

const stickers = Array.from({ length: 14 }, (_, i) => `/stickers/${i + 1}.png`);

const phrases = [
  "سلملي 😏",
  "بركنننننن 😂",
  "أبو دقة رجل 🔥",
  "طباخي متخاذل 🍳",
  "شباب النمسا قدها 🇦🇹",
  "هات دبل بيك بطريقك 🍔",
  "بيكاوي قائد 👑",
];

/**
 * StickerOverlay — Shows a random sticker image + Arabic phrase after submission.
 * Props:
 *   trigger: boolean — when it flips to true, overlay is shown for 4s.
 */
const StickerOverlay = ({ trigger }) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [stickerSrc, setStickerSrc] = useState('');
  const [phrase, setPhrase] = useState('');
  const timeoutRef = useRef(null);
  const fadeRef = useRef(null);
  const prevTrigger = useRef(false);

  useEffect(() => {
    if (trigger && !prevTrigger.current) {
      setStickerSrc(stickers[Math.floor(Math.random() * stickers.length)]);
      setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
      setVisible(true);

      requestAnimationFrame(() => setAnimating(true));

      timeoutRef.current = setTimeout(() => {
        setAnimating(false);
        fadeRef.current = setTimeout(() => setVisible(false), 400);
      }, 4000);
    }

    prevTrigger.current = trigger;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, [trigger]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9990,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: animating ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
      transition: 'background 0.4s ease',
      pointerEvents: 'none',
    }}>
      {/* Sticker Image */}
      <img
        src={stickerSrc}
        alt="sticker"
        style={{
          maxWidth: 'min(80vw, 300px)',
          maxHeight: '50vh',
          objectFit: 'contain',
          transform: animating ? 'scale(1)' : 'scale(0.2)',
          opacity: animating ? 1 : 0,
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
          filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.4))',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Phrase */}
      <p style={{
        marginTop: '24px',
        fontSize: 'clamp(1.3rem, 5vw, 2rem)',
        fontWeight: 800,
        color: '#fff',
        textAlign: 'center',
        textShadow: '0 0 20px rgba(255,255,255,0.25), 0 2px 10px rgba(0,0,0,0.5)',
        transform: animating ? 'translateY(0)' : 'translateY(20px)',
        opacity: animating ? 1 : 0,
        transition: 'transform 0.5s ease 0.15s, opacity 0.4s ease 0.15s',
        userSelect: 'none',
        pointerEvents: 'none',
        padding: '0 16px',
      }}>
        {phrase}
      </p>

      {/* Desktop breakpoint override */}
      <style>{`
        @media (min-width: 768px) {
          .sticker-overlay-img { max-width: 400px !important; }
        }
      `}</style>
    </div>
  );
};

export default StickerOverlay;
