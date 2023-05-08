import React from "react";

const footer = () => {
  let date= new Date();
  let year= date.getFullYear();
  
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <a href="." target="_blank" rel="noreferrer">
              <span className="copy">
                &copy; Copyright {year} - George Michoulis
              </span>
            </a>
          </div>
          <div className="col-md-6">
            <div className="social-icons">
              <a
                href="https://www.facebook.com/george.mihoulis/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="buton">
                  <i className="fa fa-facebook "></i>
                </span>
              </a>
              <a
                href="https://twitter.com/GeorgeMicou"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                <span className="buton">
                  <i className="fa fa-twitter "></i>
                </span>
              </a>
              <a
                href="https://www.linkedin.com/in/george-michoulis/"
                rel="noreferrer"
                target="_blank"
              >
                {" "}
                <span className="buton">
                  <i className="fa fa-linkedin "></i>
                </span>
              </a>
              <a
                href="https://github.com/gmixoulis"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                <span className="buton">
                  <i className="fa fa-github "></i>
                </span>
              </a>
              <a
                href="https://scholar.google.com/citations?user=nk0lq8YAAAAJ&hl=el"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                <span className="buton">
                  <i className="fa fa-google "></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default footer;
