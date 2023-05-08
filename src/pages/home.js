import React, { useEffect, useRef } from "react";
import { Parallax, Background } from "react-parallax";
import { Link } from "react-scroll";
import Navbar from "../layout/Navbar";
import Hero from "../section/hero";
import About from "../section/about";
import Blockquote from "../section/blockquote";
import Whatido from "../section/whatido";
import MyGallery from "../section/gallery_auto";
import Resume from "../section/resume";
import Blog from "../section/blog";
import Footer from "../section/footer";
import Preloader from "../layout/Preloader";
import ScrollToTopBtn from "../layout/ScrollToTop";
import { GlobalStyles } from "./style/video";
import CookieConsent from "react-cookie-consent";
import Activites from "../section/activities";
import Snowfall from "react-snowfall";
import ReactMessageBar from "react-message-bar";

import "../index.css";

export default function Home() {
  localStorage.removeItem("default-message");
  const videoEl = useRef(null);
  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch((error) => {
        console.error("Error attempting to play", error);
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
            position: "fixed",
            width: "100vw",
            height: "100vh",
            zIndex: 99999,
          }}
        />
      )}

      <GlobalStyles />
      <Preloader />

      <div className="home">
        <header id="header-wrap">
          <ReactMessageBar>
            {" "}
            <a
              id="messageA"
              target="blank"
              href="https://www.facebook.com/profile.php?id=100092402166774"
            >
              {" "}
              <img
                alt="mera25"
                width={"70rem"}
                src="https://mera25.gr/wp-content/uploads/2023/04/logo__official_ekloges2023_symmaxia_28-3-2023-1.png"
              ></img>
              Εκλογές 2023!!
            </a>
          </ReactMessageBar>
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
            <Hero />
            <Link smooth spy to="about">
              <span className="mouse transition" id="fly">
                <span className="scroll"></span>
              </span>
            </Link>
          </Parallax>
        </section>

        {/* ABOUT */}
        <section id="about" className="pb-0">
          <About />
          <Blockquote />
        </section>

        {/* What I DO */}
        <section id="whatido">
          <Whatido />
        </section>

        {/* Gallery */}
        <section id="MyGallery">
          <MyGallery />
        </section>

        {/* Gallery */}
        <section id="resume">
          <Resume />
        </section>

        <section id="activities" className="pb-0">
          <Activites />
        </section>

        {/* Gallery */}
        <section id="blog" className="pb-0">
          <Blog />
        </section>

        {/* contact */}
        <section id="contact" className="pb-0">
          <Footer />
        </section>

        <div className="float-text">
          <div className="de_social-icons">
            <a href="https://www.facebook.com/george.mihoulis/" target="blank">
              <span className="buton">
                <i className="fa fa-facebook fa-lg"></i>
              </span>
            </a>
            <a href="https://twitter.com/GeorgeMicou" target="blank">
              {" "}
              <span className="buton">
                <i className="fa fa-twitter fa-lg"></i>
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/george-michoulis/"
              target="blank"
            >
              {" "}
              <span className="buton">
                <i className="fa fa-linkedin fa-lg"></i>
              </span>
            </a>
            <a href="https://github.com/gmixoulis" target="blank">
              {" "}
              <span className="buton">
                <i className="fa fa-github fa-lg"></i>
              </span>
            </a>
            <a
              href="https://scholar.google.com/citations?user=nk0lq8YAAAAJ&hl=el"
              target="blank"
            >
              {" "}
              <span className="buton">
                <i className="fa fa-google fa-lg"></i>
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
