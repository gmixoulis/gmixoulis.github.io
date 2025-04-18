import React, { useEffect, useRef } from 'react';
import CookieConsent from 'react-cookie-consent';
import { Background, Parallax } from 'react-parallax';
import { Link } from 'react-scroll';
import Snowfall from 'react-snowfall';
import Navbar from '../layout/Navbar';
import Preloader from '../layout/Preloader';
import ScrollToTopBtn from '../layout/ScrollToTop';
import About from '../section/about';
import Activites from '../section/activities';
import Blockquote from '../section/blockquote';
import Blog from '../section/blog';
import Footer from '../section/footer';
import MyGallery from '../section/gallery_auto';
import Hero from '../section/hero';
import Resume from '../section/resume';
import Whatido from '../section/whatido';
import { GlobalStyles } from './style/video';
//import ReactMessageBar from "react-message-bar";
import '../index.css';
import Portfolio from '../section/portfolio';

export default function Home() {
  localStorage.removeItem('default-message');
  const videoEl = useRef(null);
  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch((error) => {
        console.error('Error attempting to play', error);
      });
  };

  useEffect(() => {
    attemptPlay();
  }, []);
  let date = new Date();
  let month = date.getMonth() + 1;

  return (
    <>
      {month === 12 && (
        <Snowfall
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
          }}
        />
      )}

      <GlobalStyles />
      <Preloader />

      <div className='home'>
        <header id='header-wrap'>
          <Navbar />
        </header>

        {/* HERO */}
        <section id='hero-area' className='bg-bottom py-0'>
          <Parallax strength={300}>
            <Background className='custom-video'>
              <video
                playsInline
                loop
                muted
                alt='All the devices'
                src='./video/local-video-1.mp4'
                ref={videoEl}
              />
            </Background>
            <Hero />
            <Link smooth spy to='about'>
              <span className='mouse transition' id='fly'>
                <span className='scroll'></span>
              </span>
            </Link>
          </Parallax>
        </section>

        {/* ABOUT */}
        <section id='about' className='pb-0'>
          <About />
          <Blockquote />
        </section>

        {/* What I DO */}
        <section id='whatido'>
          <Whatido />
        </section>

        {/* Gallery */}
        <section id='MyGallery'>
          <MyGallery />
        </section>

        <section id='resume'>
          <Resume />
        </section>

        <section id='portfolio' className='pb-0'>
          <Portfolio />
        </section>

        <section id='activities' className='pb-0'>
          <Activites />
        </section>

        {/* Gallery */}
        <section id='blog' className='pb-0'>
          <Blog />
        </section>

        {/* contact */}
        <section id='contact' className='pb-0'>
          <Footer />
        </section>

        <div className='float-text'>
          <div className='de_social-icons'>
            <a href='https://www.facebook.com/george.mihoulis/' target='blank'>
              <span className='buton'>
                <i className='fa fa-facebook fa-lg'></i>
              </span>
            </a>
            <a href='https://twitter.com/GeorgeMicou' target='blank'>
              {' '}
              <span className='buton'>
                <i className='fa fa-twitter fa-lg'></i>
              </span>
            </a>
            <a
              href='https://www.linkedin.com/in/george-michoulis/'
              target='blank'
            >
              {' '}
              <span className='buton'>
                <i className='fa fa-linkedin fa-lg'></i>
              </span>
            </a>
            <a href='https://github.com/gmixoulis' target='blank'>
              {' '}
              <span className='buton'>
                <i className='fa fa-github fa-lg'></i>
              </span>
            </a>
            <a
              href='https://scholar.google.com/citations?user=nk0lq8YAAAAJ&hl=el'
              target='blank'
            >
              {' '}
              <span className='buton'>
                <i className='fa fa-google fa-lg'></i>
              </span>
            </a>
          </div>
        </div>
      </div>

      <ScrollToTopBtn />
      <CookieConsent>
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </>
  );
}
