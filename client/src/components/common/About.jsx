import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './About.css';

// Image Imports
import about1 from '../../assets/about1.jpg';
import about2 from '../../assets/about2.jpg';
import about3 from '../../assets/about3.jpg';
import about4 from '../../assets/about4.jpg';
import about5 from '../../assets/about5.jpg';
import system from '../../assets/system1.jpg';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  useGSAP(() => {
    const textBlocks = gsap.utils.toArray('.about-reveal-text');
    textBlocks.forEach((block) => {
      gsap.from(block, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
        }
      });
    });

    const titleTimeline = gsap.timeline();
    titleTimeline
      .from('.about-massive-title .char', {
        opacity: 0,
        y: 100,
        rotateX: -90,
        stagger: 0.05,
        duration: 0.8,
        ease: 'back.out(1.7)'
      })
      .from('.about-cyber-badge', {
        width: 0,
        opacity: 0,
        duration: 1,
        ease: 'power4.inOut'
      }, '-=0.5');

    gsap.from('.bento-box', {
      scale: 0.95,
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: '.studio-strict-bento',
        start: 'top 80%',
      }
    });

    gsap.to('.about-tech-parallax-img', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-tech-architecture',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
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
    <div className="about-expanded" ref={containerRef}>

      <section className="">
        <div className="about-hero-content-wrapper">
          <div className="about-cyber-badge">SYSTEM.LOG // ORIGINS</div>
          <h1 className="about-massive-title">
            <div className="title-line">{splitText("BEYOND THE")}</div>
            <div className="title-line about-text-cyan">{splitText("LEADERBOARD")}</div>
          </h1>
        </div>
      </section>

      <section className="about-origin-story-section">
        <div className="about-origin-grid">
          <div className="about-editorial-text about-reveal-text">
            <h2 className="about-section-title about-text-cyan">01. THE GENESIS</h2>
            <p className="about-drop-cap-paragraph">
              <span className="about-drop-cap about-text-cyan">T</span>he gaming landscape has evolved, but the way we talk about it has devolved into 280-character hot takes and algorithmic video shorts. We realized that true gaming culture—the deep dives into lore, the 5,000-word strategy guides, the heartfelt reviews of indie masterpieces—was losing its home on the internet.
            </p>
            <p>
              GamerLog was conceptualized to solve this fragmentation. We wanted to build a digital sanctuary. A place where content isn't buried by a feed algorithm after 24 hours, but archived, searchable, and respected.
            </p>
            <p>
              By giving players a dedicated platform with powerful rich-text editing and total content control, we are shifting the power back to the creators. This isn't just a blog; it is a repository of gaming history, written by the people who actually play the games.
            </p>
          </div>

          <div className="about-origin-image-container about-reveal-text">
            <img
              src={about1}
              alt="Retro Gaming Controller"
              className="about-editorial-image"
              loading="lazy"
            />
            <div className="about-image-caption about-text-cyan">Fig 1. Return to the roots of gaming discourse.</div>
          </div>

        </div>
      </section>

      <section className="about-values-section">
        <div className="about-values-header about-reveal-text">
          <h2 className="about-section-title about-text-cyan">02. CORE DIRECTIVES</h2>
          <p className="about-subtitle">The foundational pillars that dictate our platform's development.</p>
        </div>

        <div className="studio-strict-bento">

          <div className="bento-box bento-text-wide">
            <div className="bento-text-content">
              <span className="bento-number text-cyan">01 //</span>
              <h3>Authenticity First</h3>
              <p>We reject corporate-sponsored reviews. Our system doesn't dictate what you read—the community does. If a strategy guide rises to the top, it is because players tested it, verified it, and endorsed it. Pure, unfiltered gamer opinions.</p>
            </div>
          </div>
          <div className="bento-box bento-img-square">
            <img src={about3} alt="Gaming Setup" loading="lazy" />
          </div>

          <div className="bento-box bento-img-square">
            <img src={about4} alt="VR Gaming" loading="lazy" />
          </div>
          <div className="bento-box bento-text-square">
            <div className="bento-text-content">
              <span className="bento-number text-cyan">02 //</span>
              <h3>Unrestricted Editing</h3>
              <p>Games receive patches; your guides should too. Seamlessly update strategies, fix typos, or rewrite conclusions without losing your URL.</p>
            </div>
          </div>
          <div className="bento-box bento-img-square">
            <img src={about5} alt="eSports" loading="lazy" />
          </div>

          <div className="bento-box bento-img-square">
            <img src={system} alt="Architecture" loading="lazy" />
          </div>
          <div className="bento-box bento-text-wide">
            <div className="bento-text-content">
              <span className="bento-number text-cyan">03 //</span>
              <h3>True Ownership</h3>
              <p>Your digital footprint belongs to you. We provide the robust architecture, but you hold the keys. Create, modify, or permanently purge your data from the network at any time with zero friction.</p>
            </div>
          </div>

        </div>
      </section>

      <section className="about-tech-architecture about-reveal-text">
        <div className="about-tech-architecture-inner">
          <div className="about-tech-text-content">
            <h2 className="about-section-title about-text-cyan">03. SYSTEM ARCHITECTURE</h2>
            <h3 className="about-tech-subheading">Why the MERN Stack?</h3>

            <div className="about-tech-paragraph-block">
              <h4 className="about-text-cyan">M — MongoDB</h4>
              <p>Gaming content is highly variable. A short review requires different data structures than a massive walkthrough with embedded images. MongoDB's NoSQL nature allows us to store complex, nested blog objects flexibly and retrieve them instantly.</p>
            </div>

            <div className="about-tech-paragraph-block">
              <h4 className="about-text-cyan">E & N — Express.js & Node.js</h4>
              <p>Handling hundreds of concurrent reads and writes (Likes, Comments, Edits) requires a non-blocking architecture. Node.js combined with the Express framework provides a lightning-fast RESTful API that handles user authentication (JWT) and database querying securely.</p>
            </div>

            <div className="about-tech-paragraph-block">
              <h4 className="about-text-cyan">R — React.js</h4>
              <p>We wanted the site to feel like a modern video game UI: snappy, responsive, and devoid of loading screens. React allows us to build a Single Page Application (SPA) where navigating between user profiles, the main feed, and reading a blog happens instantaneously via state management.</p>
            </div>
          </div>

          <div className="about-tech-visual-content">
            <div className="about-tech-image-window">
              <img
                src={system}
                alt="Code Matrix"
                className="about-tech-parallax-img"
                loading="lazy"
              />
              <div className="about-cyber-scanline"></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;