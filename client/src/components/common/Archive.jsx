import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Shuffle from './Shuffle';
import './Archive.css';
import land1 from '../../assets/land1.jpg';
import land2 from '../../assets/land2.jpg';
import land3 from '../../assets/land3.jpg';
import about3 from '../../assets/about3.jpg';
import about5 from '../../assets/about5.jpg';
import achive from '../../assets/achive.jpg';


const Achive = () => {
  const containerRef = useRef(null);
  const achievementData = [
    {
      id: 1,
      title: "PLATINUM: The Completionist",
      desc: "Awarded for publishing 100 comprehensive walkthroughs with a 95% community approval rating.",
      rarity: "LEGENDARY",
      date: "FEB 21, 2026",
      points: "+500 XP",
      img: land1
    },
    {
      id: 2,
      title: "First Blood",
      desc: "You published your very first gaming review on the GamerLog network. Welcome to the squad.",
      rarity: "COMMON",
      date: "FEB 10, 2026",
      points: "+50 XP",
      img: land2
    },
    {
      id: 3,
      title: "Lore Master",
      desc: "Achieved by writing a 5,000+ word deep-dive article into the backstory of any RPG universe.",
      rarity: "EPIC",
      date: "JAN 15, 2026",
      points: "+250 XP",
      img: land3
    },
    {
      id: 4,
      title: "Social Butterfly",
      desc: "Leave 50 constructive comments on articles written by other community members.",
      rarity: "RARE",
      date: "DEC 05, 2025",
      points: "+100 XP",
      img: about3
    },
    {
      id: 5,
      title: "The Architect",
      desc: "Successfully utilized the Rich Text Editor to embed 10 interactive maps in a single guide.",
      rarity: "RARE",
      date: "NOV 22, 2025",
      points: "+150 XP",
      img: about5
    },
    {
      id: 6,
      title: "Viral Sensation",
      desc: "One of your blog posts received over 10,000 community 'Likes' within 24 hours of publishing.",
      rarity: "LEGENDARY",
      date: "OCT 31, 2025",
      points: "+1000 XP",
      img: achive
    }
  ];


//     // 1. Header Animation
//     gsap.from('.achieve-header-ui', {
//       y: -30,
//       opacity: 0,
//       duration: 1,
//       ease: 'power3.out'
//     });

//     // 2. Staggered Card Reveal on Scroll
//     gsap.from('.achieve-card', {
//       y: 50,
//       opacity: 0,
//       duration: 0.8,
//       stagger: 0.15,
//       ease: 'power2.out',
//       scrollTrigger: {
//         trigger: '.achieve-grid',
//         start: 'top 85%'
//       }
//     });
//   }, { scope: containerRef });

  return (
    <div className="achievements-page" ref={containerRef}>
            <section className="achieve-header-section">
        <div className="achieve-header-ui">
          <div className="system-status">
            <span className="blinking-dot"></span> PROFILE SYNCED
          </div>
          
          <h1 className="achieve-title">
            <Shuffle text="ACHIEVEMENTS" shuffleTimes={5} duration={1} colorTo="#00f3ff" />
          </h1>
          
          <p className="achieve-subtitle">
            Your unlocked milestones, community trophies, and progression stats on the GamerLog network.
          </p>

          <div className="player-stats-bar">
             <div className="stat-block">
                <span className="stat-label">TOTAL XP</span>
                <span className="stat-value text-cyan">2,050</span>
             </div>
             <div className="stat-block">
                <span className="stat-label">UNLOCKED</span>
                <span className="stat-value">6 / 50</span>
             </div>
             <div className="stat-block">
                <span className="stat-label">GLOBAL RANK</span>
                <span className="stat-value text-green">#4,201</span>
             </div>
          </div>
        </div>
      </section>

      <section className="achieve-content">
        <div className="achieve-grid">
          {achievementData.map((item) => (
            <article key={item.id} className="achieve-card">
              
              <div className="card-image-wrapper">
                <img src={item.img} alt={item.title} className="card-img" />
                <div className={`rarity-badge rarity-${item.rarity.toLowerCase()}`}>
                  {item.rarity}
                </div>
                <div className="card-glitch-overlay"></div>
              </div>

              <div className="card-content">
                <div className="card-meta">
                  <span>UNLOCKED: {item.date}</span>
                  <span className="meta-divider">//</span>
                  <span className="text-cyan">{item.points}</span>
                </div>
                
                <h2 className="card-title">{item.title}</h2>
                <p className="card-desc">{item.desc}</p>
                
                <div className="card-footer">
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: '100%' }}></div>
                  </div>
                  <span className="completion-text">100% COMPLETED</span>
                </div>
              </div>

            </article>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Achive;