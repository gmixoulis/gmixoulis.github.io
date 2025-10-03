import AOS from 'aos';
import React, { useEffect, useState } from 'react';

AOS.init();

const Resume = () => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    fetch('/publications.json')
      .then((res) => res.json())
      .then(setPublications)
      .catch(console.error);
  }, []);

  const isUniversity = (text) => {
    const lower = text.toLowerCase();
    return lower.includes('university') || lower.includes('πανεπιστήμιο');
  };

  const sanitizeText = (text) => {
    if (!text) return '';
    // Remove unwanted characters but keep parentheses, dashes, spaces, and quotes
    return text.replace(/[^\w\s\-()"Α-Ωα-ωΆ-ώ]/g, '').trim(); // keeps Greek too
  };

  const formatPublicationName = (pub, year) => {
    if (!pub.publication) return '';
    let base = pub.publication.split(',')[0].trim();
    base = base.replace(/^(20\d{2})\s*/g, ''); // removes year at the beginning
    base = base.replace(/\s*(20\d{2})$/g, ''); // removes year at the end

    // Trim after removing numbers
    base = base.trim();
    if (isUniversity(base)) {
      if (year === '2020') return `${sanitizeText(base)} (BSc Thesis)`;
      if (year === '2022') return `${sanitizeText(base)} (MSc Thesis)`;
    }

    return sanitizeText(base);
  };

  const grouped = publications.reduce((acc, pub) => {
    const year = pub.year || 'Unknown';
    if (!acc[year]) acc[year] = [];
    acc[year].push(pub);
    return acc;
  }, {});

  const sortedYears = Object.keys(grouped).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-12 text-center'>
          <h2>My Resume</h2>
          <div className='space-border'></div>
        </div>
      </div>
      <div className='row gh-5'>
        <div className='col-lg-6' data-aos='fade-up' data-aos-once='true'>
          <div className='p-4'>
            <h3 className='s_border'>Experiences</h3>
            <ul className='d_timeline'>
              <li className='d_timeline-item'>
                <h3 className='d_timeline-title'>2024 - now</h3>
                <div className='d_timeline-text'>
                  <span className='d_title'>
                    Blockchain Developer &amp; Researcher
                  </span>
                  <span className='d_company'>Sidroco Holdings LTD</span>
                  <ul>
                    <li>
                     Spearheaded blockchain-driven innovation, delivering NFT marketplace for 5G technologies and advanced dashboards, while contributing to Horizon/MSCA/KA2 proposals that secured EU funding and elevated the company’s research portfolio.
Coordinated, managed, and disseminated multinational European projects, ensuring compliance, visibility, and impactful presence through presentations, workshops, and international events.
Designed and deployed practical platforms (e.g., Hyperledger Fabric prototypes, Moodle LMS for Erasmus+) that transformed proposals into real, demonstrable technological outputs.
                    </li>
                  </ul>
                </div>
              </li>
               <li className='d_timeline-item'>
                <h3 className='d_timeline-title'>2023 - 2025</h3>
                <div className='d_timeline-text'>
                  <span className='d_title'>
                    Lecturer &amp; Academic Partner
                  </span>
                  <span className='d_company'>University of Derby / Mediterranean College </span>
                  <ul>
                    <li>
                     Delivered engaging courses in Networks & Security, Web Scripting, and Application Development, equipping students with practical coding, networking, and cryptography skills through hands-on labs.

Championed inclusivity and fairness in assessment, supporting diverse learners and guiding students through oral exams, projects, and personalized feedback.

Actively represented the institution in events and public speaking on Web3 and edge technologies, enhancing the college’s reputation and student exposure to cutting-edge fields.
                    </li>
                  </ul>
                </div>
              </li>
              <li className='d_timeline-item'>
                <h3 className='d_timeline-title'>2022 - 2024</h3>
                <div className='d_timeline-text'>
                  <span className='d_title'>
                    Blockchain &amp; Full-Stack Developer
                  </span>
                  <span className='d_company'>University of Nicosia / IFF</span>
                  <ul>
                    <li>
                     Led frontend development on large-scale applications (Next.js, Flask, NestJS, Docker), driving agile sprints with Asana/Trello while documenting best practices to improve long-term maintainability.

Delivered a Web3-based NFT marketplace, bridging blockchain and user-centric design, demonstrating research-to-production translation.

Coordinated cross-functional teams, optimizing workflows with shell scripting and Docker pipelines, ensuring delivery of robust, scalable systems under tight deadlines.
                    </li>
                  </ul>
                </div>
              </li>

              <li className='d_timeline-item'>
                <h3 className='d_timeline-title'>2018 - 2021</h3>
                <div className='d_timeline-text'>
                  <span className='d_title'>WordPress Developer</span>
                  <span className='d_company'> FreeLancer </span>
                  Websites:{' '}
                  <a
                    href='https://marlab.ode.uom.gr/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    {' '}
                    MarLab
                  </a>
                  ,{' '}
                  <a
                    href='https://celc.web.auth.gr/'
                    rel='noreferrer'
                    target='_blank'
                  >
                    {' '}
                    CELC{' '}
                  </a>
                  ,{' '}
                  <a
                    href='https://eudem.polsci.auth.gr/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    {' '}
                    EUDEM{' '}
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
              <li className='d_timeline-item'>
                <h3 className='d_timeline-title'> October 2018</h3>
                <div className='d_timeline-text'>
                  <span className='d_title'>Web Developer</span>
                  <span className='d_company'>MKI Hellas / Volunteer </span>
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

        <div className='col-lg-6' data-aos='fade-up' data-aos-once='true'>
          <div className='p-4'>
            <h3 className='s_border'>Education</h3>
            <ul className='d_timeline'>
              <li className='d_timeline-item'>
                <h3 className='d_timeline-title'>2020 - 2022</h3>
                <p className='d_timeline-text'>
                  <span className='d_title'>
                    Master in Data and Web Science
                  </span>
                  <span className='d_company'>
                    Aristotle University of Thessaloniki
                  </span>
                  The main topic is the specialization in Data and Web Science.
                  The efficient and effective data management is a critical.
                  Challenges arise at all levels of the Information Technology
                  Stage in terms of infrastructure, management, access, and
                  exploitation of information for knowledge mining that will be
                  provided in a direct way.
                  <br></br> <br></br>
                  <strong style={{ color: 'pearl' }}>Courses:</strong>{' '}
                  Blockchain, Big Data (Scala - Spark), Advanced Machine
                  Learning, Web Data Mining, Natural Language Processing, etc.
                </p>
              </li>
              <li className='d_timeline-item'>
                <h3 className='d_timeline-title'>2015 - 2020</h3>
                <p className='d_timeline-text'>
                  <span className='d_title'>
                    Bachelor of Applied Informatics
                  </span>
                  <span className='d_company'>University of Macedonia</span>
                  Information and Communication Technologies can be efficiently
                  implemented if there is sound knowledge not only of the
                  Science of Informatics but also of the scope of its
                  application. Thus, students are required to attend advanced
                  courses in Management Science, Economics, Finance, Business
                  Administration, Quantitative Methods, as well as Computer and
                  Internet Law.
                  <br></br> <br></br>
                  <strong style={{ color: 'pearl' }}>Courses:</strong>{' '}
                  Cryptography, Computer Architecture, Operating Systems, Neural
                  Networks, OO Programming (Java), Blockchain, Big Data Mining,
                  etc.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className='spacer-double'></div>
      </div>

      <div className='row gh-5'>
        <div className='col-lg-6' data-aos='fade-up' data-aos-once='true'>
          <div className='p-4'>
            <h3 className='s_border'>Publications</h3>
            <ul className='d_timeline' id='publications'>
              {sortedYears.map((year) => (
                <li className='d_timeline-item' key={year}>
                  <h3 className='d_timeline-title'>{year}</h3>
                  {grouped[year].map((pub, i) => {
                    const publicationTitle = formatPublicationName(pub, year);
                    const title = sanitizeText(pub.title);
                    return (
                      <p className='d_timeline-text' key={i}>
                        {publicationTitle && (
                          <span className='d_title'>{publicationTitle}</span>
                        )}
                        <span className=''>
                          <a
                            href={pub.link}
                            target='_blank'
                            rel='noopener noreferrer'
                            style={{
                              color: 'rgb(207, 31, 31)',
                              display: 'block',
                              fontSize: '16px',
                              marginBottom: '10px',
                            }}
                          >
                            "{title}"
                          </a>
                          {pub.cited_by?.value != null && (
                            <>
                              <strong>Citations:</strong> {pub.cited_by.value}
                            </>
                          )}
                        </span>
                      </p>
                    );
                  })}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='col-lg-6' data-aos='fade-up' data-aos-once='true'>
          <div className='p-4'>
            <h3 className='s_border'>Awards</h3>
            <ul className='d_timeline' id='awards'>
              <li className='d_timeline-item'>
                <h3 className='d_timeline-title'>2020 - 2022</h3>
                <p className='d_timeline-text'>
                  <span className='d_title'>DeepMind Scholarship</span>
                  <span className='d_company'>
                    Aristotle University of Thessaloniki
                  </span>{' '}
                  Thesis and MSc studies were conducted under the fully funded
                  scholarship from DeepMind Technologies Limited. DeepMind is a
                  division of Alphabet, Inc. responsible for developing
                  general-purpose artificial intelligence (AGI) technology. The
                  DeepMind’s scholarships provide financial support to students
                  from underrepresented groups seeking to study graduate courses
                  relating to AI and adjacent fields.
                </p>
              </li>
              <li className='d_timeline-item'>
                <h3 className='d_timeline-title'>2020 - 2022</h3>
                <p className='d_timeline-text'>
                  <span className='d_title'> Basic Research 2020-21 </span>
                  <span className='d_company'>
                    University of Macedonia{' '}
                  </span>{' '}
                  Received funding from the Research Committee of the University
                  of Macedonia under the Basic Research 2020-21 funding
                  programme.
                </p>
              </li>

              <li className='d_timeline-item'>
                <h3 className='d_timeline-title'>06 / 2022</h3>
                <p className='d_timeline-text'>
                  <span className='d_title'>
                    {' '}
                    3rd place on Infinitech Hackathon{' '}
                  </span>
                  <span className='d_company'>Crowdpolicy </span> The Infinitech
                  hackathon is one of the open innovation actions in the context
                  of the “Infinitech Project”, implementing the Infinitech Way.
                </p>
              </li>
              <li className='d_timeline-item'>
                <h3 className='d_timeline-title'>2014 - 2015</h3>
                <p className='d_timeline-text'>
                  <span className='d_title'>Excelence Award</span>
                  <span className='d_company'>1st Lyceum of Kalamaria</span> An
                  award that is provided to every student that achieved highest
                  scone in the last class of the lyceum.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className='spacer-double'></div>
      </div>
    </div>
  );
};

export default Resume;


