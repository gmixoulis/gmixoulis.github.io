import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";


const Navbar= function() {

  const [showmenu, btn_icon] = useState(false);
  useEffect(() => {
    const header = document.getElementById("header-wrap");
    const flytext = document.getElementById("fly");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
       btn_icon(false);
        if (window.pageYOffset > sticky) {
          header.classList.add("sticky");
          totop.classList.add("show");
          flytext.classList.add("hide");
        } else {
          header.classList.remove("sticky");
          flytext.classList.remove("hide");
          totop.classList.remove("show");
        } 
      });
      return () => {
        window.removeEventListener("scroll", scrollCallBack);
      };
    }, []);
    return(
        <nav className="navbar transition">
        <div className="container">
          <Link  className="navbar-brand" activeClass="active" spy to="hero-area">
            <img src="./img/logo.png" className="img-fluid d-block imginit" alt="logo"/>
            
          </Link>
          {/* Desktop menu Here */}
          <div className="dekstopmenu">
             <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link transition" activeClass="active" spy to="hero-area">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link transition" activeClass="active" spy to="about">
                  About me
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link transition" activeClass="active" spy to="whatido">
                  What I Do
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link transition" activeClass="active" spy to="MyGallery">
                  Certificates
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link transition" activeClass="active" spy to="resume">
                  My resume
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link transition" activeClass="active" spy to="blog">
                  Recent Posts
                </Link>
              </li>
             
            </ul>
          </div>
          {/* Desktop menu Here */}

          {/* mobile menu here */}
          {showmenu && 
          <div className="mobilemenu" >
            <ul className="navbar-nav mr-auto w-100 justify-content-end clearfix">
              <li className="nav-item">
                <Link className="nav-link" activeClass="active" smooth spy to="hero-area">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" activeClass="active" smooth spy to="about">
                  About me
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link transition" smooth activeClass="active" spy to="whatido">
                  What I Do
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link transition" smooth activeClass="active" spy to="MyGallery">
                  Certificates
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link transition" smooth activeClass="active" spy to="resume">
                  My resume
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link transition"smooth activeClass="active" spy to="blog">
                  Recent Posts
                </Link>
              </li>
              
            </ul>
          </div>
          }
          <button className="burgermenu" type="button" onClick={() => btn_icon(!showmenu)}>
            <i className="fa fa-bars" aria-hidden="true"></i>
          </button>
          {/* mobile menu here */}
        </div>
      </nav>
    )
}

export default Navbar;