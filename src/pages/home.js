import React, { useEffect, useRef } from "react";
import { Parallax, Background } from "react-parallax";
import { Link } from "react-scroll";
import Navbar from '../layout/Navbar';
import Hero from '../section/hero';
import About from '../section/about';
import Blockquote from '../section/blockquote';
import Whatido from '../section/whatido';
import Gallery from '../section/gallery';
import Resume from '../section/resume';
import Counter from '../section/counter';
import Blog from '../section/blog';
import Contact from '../section/contact';
import Footer from '../section/footer';
import Preloader from "../layout/Preloader";
import ScrollToTopBtn from '../layout/ScrollToTop';
import { GlobalStyles } from './style/video';


export default function Home() {
const videoEl = useRef(null);
  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch(error => {
        console.error("Error attempting to play", error);
      });
  };

  useEffect(() => {
    attemptPlay();
  }, []);

  return (
    <>
      <GlobalStyles/>
    <Preloader/>
    <div className="home">

      <header id="header-wrap">
        <Navbar />
      </header>

      {/* HERO */}
      <section id="hero-area" className="bg-bottom py-0">
        <Parallax strength={300}>
          <Background className="custom-video">
              <video
                playsInline
                loop
                muted
                alt="All the devices"
                src="./video/local-video-1.mp4"
                ref={videoEl}
              />
          </Background>
        <Hero/>
        <Link smooth spy to="about">
          <span className="mouse transition" id="fly">
              <span className="scroll"></span>
          </span>
        </Link>
        </Parallax>
      </section>

      {/* ABOUT */}
      <section id="about" className="pb-0">
        <About/>
        <Blockquote/>
      </section>

      {/* What I DO */}
      <section id="whatido">
        <Whatido/>
      </section>

      {/* Gallery */}
      <section id="gallery">
        <Gallery/>
      </section>

      {/* Gallery */}
      <section id="resume" className="pb-0">
        <Resume/>
      </section>

      {/* Gallery */}
      <section id="blog" className="pb-0">
        <Blog/>
      </section>

      {/* contact */}
      <section id="contact" className="pb-0">
       
        <Footer/>
      </section>

      


      <div className="float-text">
          <div className="de_social-icons">
          <a href="https://www.facebook.com/george.mihoulis/" target="_blank"><span className="buton"><i className="fa fa-facebook fa-lg"></i></span></a>
          <a href="https://twitter.com/GeorgeMicou" target="_blank">  <span className="buton"><i className="fa fa-twitter fa-lg"></i></span></a>
          <a href="https://www.linkedin.com/in/george-michoulis/" target="_blank">  <span className="buton"><i className="fa fa-linkedin fa-lg"></i></span></a>
          <a href="https://github.com/gmixoulis" target="_blank">  <span className="buton"><i className="fa fa-github fa-lg"></i></span></a>
          <a href="https://scholar.google.com/citations?user=nk0lq8YAAAAJ&hl=el" target="_blank">  <span className="buton"><i className="fa fa-google fa-lg"></i></span></a>
          </div>
          
      </div>
    </div>
    <ScrollToTopBtn />
    </>
  );
}
