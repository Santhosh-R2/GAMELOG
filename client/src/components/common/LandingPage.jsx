import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './LandingPage.css';
import land1 from '../../assets/land1.jpg';
import land2 from '../../assets/land2.jpg';
import land3 from '../../assets/land3.jpg';
import video from '../../assets/video.mp4';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const features = [
    {
      id: "01",
      title: "Share Your Experience",
      desc: "Immerse the community in your gameplay. Write comprehensive blogs, share walkthroughs, and post epic reviews. Your stories, permanently archived in our MongoDB database.",
      list: ["Rich Text Editor", "Image Uploads", "Instant Publishing"],
      img: land1,
      color: "#39ff14",
    },
    {
      id: "02",
      title: "Content Control",
      desc: "Your blog, your rules. Easily manage your published content. Spot a typo in your review? Edit it live. Outdated strategy? Delete it. Full CRUD capabilities powered by an Express.js REST API.",
      list: ["Real-time Editing", "Secure Deletion", "Draft Management"],
      img: land2,
      color: "#00f3ff", 
    },
    {
      id: "03",
      title: "Engage & Validate",
      desc: "Gaming is better together. Discover blogs from other players, leave your thoughts, and smash the 'Like' button on top-tier content. Watch the community rankings shift in real-time.",
      list: ["Interactive Like System", "Author Profiles", "Community Feed"],
      img: land3, 
      color: "#ff00ff", 
    }
  ];

  useGSAP(() => {
    const heroTl = gsap.timeline();
    heroTl
      .from('.hero-badge', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from('.hero-title .char', {
        opacity: 0,
        y: 80,
        rotateX: -90,
        stagger: 0.04,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, '-=0.4')
      .from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
  
    const rows = gsap.utils.toArray('.feature-row');

    rows.forEach((row, index) => {
      const textElement = row.querySelector('.feature-text-area');
      const imageElement = row.querySelector('.feature-image-area');
      const titleChars = row.querySelectorAll('.feature-title .char');

      const isEven = index % 2 !== 0;

      gsap.from(titleChars, {
        opacity: 0,
        x: -20,
        stagger: 0.03,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: row,
          start: "top 80%",
        }
      });

      gsap.from(textElement.querySelectorAll('p, .feature-number, .feature-list li'), {
        x: isEven ? 50 : -50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: row,
          start: "top 80%",
        }
      });

      gsap.from(imageElement, {
        x: isEven ? -100 : 100,
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: row,
          start: "top 80%",
        }
      });
    });
  }, { scope: containerRef });

  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char" style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="zigzag-landing" ref={containerRef}>
      <section className="hero-banner">
        <video className="hero-video-bg" autoPlay loop muted playsInline>
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-badge">SYSTEM ONLINE</div>

          <h1 className="hero-title">
            {splitText("GAMERLOG")}
          </h1>

          <p className="hero-subtitle">
            The ultimate MERN stack blogging platform built specifically for the gaming community. Share, edit, and rank the best gaming experiences.
          </p>

          <button className="cyber-btn cyan-theme" onClick={() => navigate('/login')}>
            Join The Network
          </button>
        </div>
      </section>

      <section className="features-container">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-row"
            style={{ '--theme-color': feature.color }}
          >

            <div className="feature-text-area">
              <span className="feature-number" style={{ color: feature.color }}>
                {feature.id}
              </span>
              <h2 className="feature-title" style={{ color: feature.color }}>
                {splitText(feature.title)}
              </h2>
              <p className="feature-description">
                {feature.desc}
              </p>
              <ul className="feature-list">
                {feature.list.map((item, i) => (
                  <li key={i}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', background: feature.color, boxShadow: `0 0 5px ${feature.color}` }}></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="feature-image-area">
              <img src={feature.img} alt={feature.title} className="feature-image" loading="lazy" />
            </div>

          </div>
        ))}
      </section>

      <footer style={{
        textAlign: 'center',
        padding: '100px 20px',
        borderTop: '1px solid #333',
        background: '#050505'
      }}>
        <h2 style={{ fontFamily: 'Orbitron', fontSize: '3rem', margin: '0 0 20px 0', textTransform: 'uppercase' }}>
          Ready to play?
        </h2>
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '1.2rem' }}>
          Create an account and publish your first gaming blog today.
        </p>
        
        <button className="cyber-btn cyan-theme" onClick={() => navigate('/register')}>
          Create Account
        </button>
      </footer>

    </div>
  );
};

export default LandingPage;