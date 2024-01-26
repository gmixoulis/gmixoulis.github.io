import React from "react";
import AOS from "aos";
AOS.init();

const hero = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <h2>My Resume</h2>
          <div className="space-border"></div>
        </div>
      </div>
      <div className="row gh-5">
        <div className="col-lg-6" data-aos="fade-up" data-aos-once="true">
          <div className="p-4">
            <h3 className="s_border">Experiences</h3>
            <ul className="d_timeline">
               <li className="d_timeline-item">
                <h3 className="d_timeline-title">2024 - now</h3>
                <div className="d_timeline-text">
                  <span className="d_title">
                    Blockchain Developer &amp;  Researcher
                  </span>
                  <span className="d_company">Sidroco Holdings LTD</span>
                  <ul>
                    <li>
                      Develop research ideas and proposals for European programs. Coordinate and manage European programs. Develop cutting-edge blockchain-based technologies
                    </li>
                  </ul>
                </div>
              </li>
              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2022 - 2024</h3>
                <div className="d_timeline-text">
                  <span className="d_title">
                    Blockchain &amp; Full-Stack Developer
                  </span>
                  <span className="d_company">University of Nicosia / IFF</span>
                  <ul>
                    <li>
                      Develop Flask based Application. Use of Gulp.js, NestJS with app routing and
                      Jqurey. Coordinate the front-end team. Use Shell Scripts and Docker containers. Develop
                      Research Papers. Develop NFT markeplace (Web3).{" "}
                    </li>
                  </ul>
                </div>
              </li>

              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2018 - 2021</h3>
                <div className="d_timeline-text">
                  <span className="d_title">WordPress Developer</span>
                  <span className="d_company"> FreeLancer </span>
                  Websites:{" "}
                  <a
                    href="https://marlab.ode.uom.gr/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {" "}
                    MarLab
                  </a>
                  ,{" "}
                  <a
                    href="https://celc.web.auth.gr/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {" "}
                    CELC{" "}
                  </a>
                  ,{" "}
                  <a
                    href="https://eudem.polsci.auth.gr/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    EUDEM{" "}
                  </a>
                  <br></br>
                  <ul>
                    <li>
                      Meeting with clients to discuss website design and
                      function.
                    </li>
                    <li> Created, Updated, Modified WordPress webpage</li>
                    <li> Created Organization's Introduction Video</li>
                  </ul>
                </div>
              </li>
              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2018 - 2021</h3>
                <div className="d_timeline-text">
                  <span className="d_title">Web Developer</span>
                  <span className="d_company">MKI Hellas / Volunteer </span>
                  <ul>
                    <li>
                      Develop a chatbot with DialogFlow, Webpage & DB with VueJs
                      and Firebase
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-lg-6" data-aos="fade-up" data-aos-once="true">
          <div className="p-4">
            <h3 className="s_border">Education</h3>
            <ul className="d_timeline">
              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2020 - 2022</h3>
                <p className="d_timeline-text">
                  <span className="d_title">
                    Master in Data and Web Science
                  </span>
                  <span className="d_company">
                    Aristotle University of Thessaloniki
                  </span>
                  The main topic is the specialization in Data and Web Science.
                  The efficient and effective data management is a critical.
                  Challenges arise at all levels of the Information Technology
                  Stage in terms of infrastructure, management, access, and
                  exploitation of information for knowledge mining that will be
                  provided in a direct way.
                  <br></br> <br></br>
                  <strong style={{ color: "pearl" }}>Courses:</strong>{" "}
                  Blockchain, Big Data (Scala - Spark), Advanced Machine
                  Learning, Web Data Mining, Natural Language Processing, etc.
                </p>
              </li>
              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2015 - 2020</h3>
                <p className="d_timeline-text">
                  <span className="d_title">
                    Bachelor of Applied Informatics
                  </span>
                  <span className="d_company">University of Macedonia</span>
                  Information and Communication Technologies can be efficiently
                  implemented if there is sound knowledge not only of the
                  Science of Informatics but also of the scope of its
                  application. Thus, students are required to attend advanced
                  courses in Management Science, Economics, Finance, Business
                  Administration, Quantitative Methods, as well as Computer and
                  Internet Law.
                  <br></br> <br></br>
                  <strong style={{ color: "pearl" }}>Courses:</strong>{" "}
                  Cryptography, Computer Architecture, Operating Systems, Neural
                  Networks, OO Programming (Java), Blockchain, Big Data Mining,
                  etc.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="spacer-double"></div>
      </div>

      <div className="row gh-5">
        <div className="col-lg-6" data-aos="fade-up" data-aos-once="true">
          <div className="p-4">
            <h3 className="s_border">Publications</h3>
            <ul className="d_timeline" id="publications">
              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2022</h3>

                <p className="d_timeline-text">
                  <span className="d_title">
                    UBRI Connect 2022 | RippleImpact
                  </span>
                  <span className="d_company">
                    {" "}
                    <i>
                      {" "}
                      "BBF: Towards a Blockchain Benchmarking Framework"{" "}
                    </i>{" "}
                  </span>

                  <span className="d_title">
                    Simulation Modelling Practice and Theory
                  </span>
                  <span className="d_company">
                    {" "}
                    <i>
                      {" "}
                      "A process-aware approach for blockchain-based
                      verification of academic qualifications"{" "}
                    </i>
                  </span>

                  <span className="d_title">
                    Women in Bioinformatics and Data Science LA
                  </span>
                  <span className="d_company">
                    {" "}
                    <i>
                      "Graph Embedding and Node Features for Drug Target
                      Interaction: The GenGRAM-DTA Approach"
                    </i>{" "}
                  </span>

                  <span className="d_title">
                    4th Summit on Gender Equality in Computing
                  </span>
                  <span className="d_company">
                    <i>
                      "A Gender Equality Observatory on Scientific Research"
                    </i>
                  </span>
                  <span className="d_company">
                    <i>
                      "Blockchain in Higher Education: permissioned and
                      permissionless approaches"
                    </i>
                  </span>
                </p>
              </li>
              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2021</h3>
                <p className="d_timeline-text">
                  <span className="d_title">
                    Φοιτητικό Συνέδριο του τμήματος Διοικητικής Επιστήμης και
                    Τεχνολογίας
                  </span>
                  <span className="d_company">
                    <i>
                      "Επαλήθευση εγκυρότητας Ακαδημαϊκών Τίτλων με χρήση του
                      Ethereum Blockchain"
                    </i>
                  </span>
                </p>
              </li>
              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2020</h3>
                <p className="d_timeline-text">
                  <span className="d_title">
                    XIV Balkan Conference on Operational Research
                  </span>
                  <span className="d_company">
                    Verification of Academic Qualifications through Ethereum
                    Blockchain: An Introduction to VerDe
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-lg-6" data-aos="fade-up" data-aos-once="true">
          <div className="p-4">
            <h3 className="s_border">Awards</h3>
            <ul className="d_timeline" id="awards">
              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2020 - 2022</h3>
                <p className="d_timeline-text">
                  <span className="d_title">DeepMind Scholarship</span>
                  <span className="d_company">
                    Aristotle University of Thessaloniki
                  </span>{" "}
                  Thesis and MSc studies were conducted under the fully funded
                  scholarship from DeepMind Technologies Limited. DeepMind is a
                  division of Alphabet, Inc. responsible for developing
                  general-purpose artificial intelligence (AGI) technology. The
                  DeepMind’s scholarships provide financial support to students
                  from underrepresented groups seeking to study graduate courses
                  relating to AI and adjacent fields.
                </p>
              </li>
              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2020 - 2022</h3>
                <p className="d_timeline-text">
                  <span className="d_title"> Basic Research 2020-21 </span>
                  <span className="d_company">
                    University of Macedonia{" "}
                  </span>{" "}
                  Received funding from the Research Committee of the University
                  of Macedonia under the Basic Research 2020-21 funding
                  programme.
                </p>
              </li>

              <li className="d_timeline-item">
                <h3 className="d_timeline-title">06 / 2022</h3>
                <p className="d_timeline-text">
                  <span className="d_title">
                    {" "}
                    3rd place on Infinitech Hackathon{" "}
                  </span>
                  <span className="d_company">Crowdpolicy </span> The Infinitech
                  hackathon is one of the open innovation actions in the context
                  of the “Infinitech Project”, implementing the Infinitech Way.
                </p>
              </li>
              <li className="d_timeline-item">
                <h3 className="d_timeline-title">2014 - 2015</h3>
                <p className="d_timeline-text">
                  <span className="d_title">Excelence Award</span>
                  <span className="d_company">1st Lyceum of Kalamaria</span> An
                  award that is provided to every student that achieved highest
                  scone in the last class of the lyceum.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="spacer-double"></div>
      </div>
    </div>
  );
};

export default hero;
