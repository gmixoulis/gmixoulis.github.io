import React, { useEffect, useRef } from 'react';
import CookieConsent from 'react-cookie-consent';
import { Parallax, Background } from 'react-parallax';
import { Link } from 'react-scroll';
import Snowfall from 'react-snowfall';
import Navbar from '../layout/Navbar';
import Preloader from '../layout/Preloader';
import ScrollToTopBtn from '../layout/ScrollToTop';
import About from '../section/About';
import Activities from '../section/Activities';
import Blockquote from '../section/Blockquote';
import Blog from '../section/Blog';
import Footer from '../section/Footer';
import MyGallery from '../section/GalleryAuto';
import Hero from '../section/Hero';
import Resume from '../section/Resume';
import Whatido from '../section/Whatido';
import Portfolio from '../section/Portfolio';
import { GlobalStyles } from './style/video';
import '../index.css';

const Home: React.FC = () => {
  const videoEl = useRef<HTMLVideoElement>(null);
  useEffect(() => { videoEl.current?.play().catch(() => {}); }, []);
  const month = new Date().getMonth() + 1;
  const socials = [
    { href: 'https://www.facebook.com/george.mihoulis/', icon: 'fa-facebook' },
    { href: 'https://twitter.com/GeorgeMicou', icon: 'fa-twitter' },
    { href: 'https://www.linkedin.com/in/george-michoulis/', icon: 'fa-linkedin' },
    { href: 'https://github.com/gmixoulis', icon: 'fa-github' },
    { href: 'https://scholar.google.com/citations?user=nk0lq8YAAAAJ&hl=el', icon: 'fa-google' },
  ];
  return (
    <>
      {month === 12 && <Snowfall style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: 99999 }}/>}
      <GlobalStyles/><Preloader/>
      <div className='home'>
        <header id='header-wrap'><Navbar/></header>
        <section id='hero-area' className='bg-bottom py-0'><Parallax strength={300}>
          <Background className='custom-video'><video playsInline loop muted src='/video/local-video-1.mp4' ref={videoEl}/></Background>
          <Hero/><Link smooth spy to='about'><span className='mouse transition' id='fly'><span className='scroll'/></span></Link>
        </Parallax></section>
        <section id='about' className='pb-0'><About/><Blockquote/></section>
        <section id='whatido'><Whatido/></section>
        <section id='MyGallery'><MyGallery/></section>
        <section id='resume'><Resume/></section>
        <section id='portfolio' className='pb-0'><Portfolio/></section>
        <section id='activities' className='pb-0'><Activities/></section>
        <section id='blog' className='pb-0'><Blog/></section>
        <section id='contact' className='pb-0'><Footer/></section>
        <div className='float-text'><div className='de_social-icons'>
          {socials.map(s => <a key={s.icon} href={s.href} target='_blank' rel='noopener noreferrer'><span className='buton'><i className={`fa ${s.icon} fa-lg`}/></span></a>)}
        </div></div>
      </div>
      <ScrollToTopBtn/>
      <CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
    </>
  );
};
export default Home;
