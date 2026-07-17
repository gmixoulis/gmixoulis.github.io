import React, { useEffect, useState } from 'react';
import PaginatedTimeline from '../layout/PaginatedTimeline';

interface Publication { year?: string; title?: string; publication?: string; link?: string; cited_by?: { value?: number }; }

const Resume: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  useEffect(() => { fetch('/publications.json').then(r => r.json()).then(setPublications).catch(console.error); }, []);
  const isUni = (t: string) => t.toLowerCase().includes('university') || t.toLowerCase().includes('πανεπιστήμιο');
  const sanitize = (t: string) => t ? t.replace(/[^\w\s\-()"Α-Ωα-ωΆ-ώ]/g, '').trim() : '';
  const fmtPub = (pub: Publication, year: string) => {
    if (!pub.publication) return '';
    let b = pub.publication.split(',')[0].trim().replace(/^(20\d{2})\s*/g, '').replace(/\s*(20\d{2})$/g, '').trim();
    if (isUni(b)) { if (year === '2020') return `${sanitize(b)} (BSc Thesis)`; if (year === '2022') return `${sanitize(b)} (MSc Thesis)`; }
    return sanitize(b);
  };
  const grouped = publications.reduce<Record<string, Publication[]>>((a, p) => { const y = p.year || 'Unknown'; (a[y] = a[y] || []).push(p); return a; }, {});
  const years = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));

  const exp: React.ReactNode[] = [
    <li className='d_timeline-item' key='cy'><h3 className='d_timeline-title'>05 / 2026 - Present</h3><div className='d_timeline-text'><span className='d_title'>Web3 Full-Stack Developer</span><span className='d_company'>Cyberscope by TAC</span><ul><li>Building and maintaining end-to-end Web3 products, from smart contracts and on-chain integrations to the React/Next.js frontends and Node services. Contributing to blockchain security tooling and audit workflows. Shipping across the stack — Solidity, ethers/viem, TypeScript, and cloud deployment.</li></ul></div></li>,
    <li className='d_timeline-item' key='si'><h3 className='d_timeline-title'>2024 - 2026</h3><div className='d_timeline-text'><span className='d_title'>Blockchain Developer &amp; Researcher</span><span className='d_company'>Sidroco Holdings LTD</span><ul><li>Spearheaded blockchain-driven innovation, delivering NFT marketplace for 5G technologies and advanced dashboards. Coordinated multinational European projects ensuring compliance and visibility. Designed and deployed practical platforms (Hyperledger Fabric prototypes, Moodle LMS for Erasmus+).</li></ul></div></li>,
    <li className='d_timeline-item' key='de'><h3 className='d_timeline-title'>2023 - 2025</h3><div className='d_timeline-text'><span className='d_title'>Lecturer &amp; Academic Partner</span><span className='d_company'>University of Derby / Mediterranean College</span><ul><li>Delivered engaging courses in Networks & Security, Web Scripting, and Application Development. Championed inclusivity and fairness in assessment. Actively represented the institution in events and public speaking on Web3 and edge technologies.</li></ul></div></li>,
    <li className='d_timeline-item' key='un'><h3 className='d_timeline-title'>2022 - 2024</h3><div className='d_timeline-text'><span className='d_title'>Blockchain &amp; Full-Stack Developer</span><span className='d_company'>University of Nicosia / IFF</span><ul><li>Led frontend development on large-scale applications (Next.js, Flask, NestJS, Docker). Delivered a Web3-based NFT marketplace. Coordinated cross-functional teams, optimizing workflows with shell scripting and Docker pipelines.</li></ul></div></li>,
    <li className='d_timeline-item' key='wp'><h3 className='d_timeline-title'>2018 - 2021</h3><div className='d_timeline-text'><span className='d_title'>WordPress Developer</span><span className='d_company'> FreeLancer </span>Websites: <a href='https://marlab.ode.uom.gr/' rel='noreferrer' target='_blank'>MarLab</a>, <a href='https://celc.web.auth.gr/' rel='noreferrer' target='_blank'>CELC</a>, <a href='https://eudem.polsci.auth.gr/' target='_blank' rel='noreferrer'>EUDEM</a><br/><ul><li>Meeting with clients to discuss website design and function.</li><li>Created, Updated, Modified WordPress webpage</li><li>Created Organization's Introduction Video</li></ul></div></li>,
    <li className='d_timeline-item' key='mk'><h3 className='d_timeline-title'> October 2018</h3><div className='d_timeline-text'><span className='d_title'>Web Developer</span><span className='d_company'>MKI Hellas / Volunteer</span><ul><li>Develop a chatbot with DialogFlow, Webpage & DB with VueJs and Firebase</li></ul></div></li>,
  ];

  const edu: React.ReactNode[] = [
    <li className='d_timeline-item' key='m'><h3 className='d_timeline-title'>2020 - 2022</h3><p className='d_timeline-text'><span className='d_title'>Master in Data and Web Science</span><span className='d_company'>Aristotle University of Thessaloniki</span>The main topic is the specialization in Data and Web Science.<br/><br/><strong style={{ color: 'pearl' }}>Courses:</strong> Blockchain, Big Data (Scala - Spark), Advanced Machine Learning, Web Data Mining, Natural Language Processing, etc.</p></li>,
    <li className='d_timeline-item' key='b'><h3 className='d_timeline-title'>2015 - 2020</h3><p className='d_timeline-text'><span className='d_title'>Bachelor of Applied Informatics</span><span className='d_company'>University of Macedonia</span>Information and Communication Technologies can be efficiently implemented if there is sound knowledge not only of the Science of Informatics but also of the scope of its application.<br/><br/><strong style={{ color: 'pearl' }}>Courses:</strong> Cryptography, Computer Architecture, Operating Systems, Neural Networks, OO Programming (Java), Blockchain, Big Data Mining, etc.</p></li>,
  ];

  const pubs: React.ReactNode[] = years.map(year => (
    <li className='d_timeline-item' key={year}><h3 className='d_timeline-title'>{year}</h3>
      {grouped[year].map((pub, i) => {
        const pt = fmtPub(pub, year); const title = sanitize(pub.title || '');
        return <p className='d_timeline-text' key={i}>{pt && <span className='d_title'>{pt}</span>}<span><a href={pub.link} target='_blank' rel='noopener noreferrer' style={{ color: 'rgb(207, 31, 31)', display: 'block', fontSize: '16px', marginBottom: '10px' }}>"{title}"</a>{pub.cited_by?.value != null && <><strong>Citations:</strong> {pub.cited_by.value}</>}</span></p>;
      })}
    </li>
  ));

  const awards: React.ReactNode[] = [
    <li className='d_timeline-item' key='dm'><h3 className='d_timeline-title'>2020 - 2022</h3><p className='d_timeline-text'><span className='d_title'>DeepMind Scholarship</span><span className='d_company'>Aristotle University of Thessaloniki</span> Thesis and MSc studies were conducted under the fully funded scholarship from DeepMind Technologies Limited.</p></li>,
    <li className='d_timeline-item' key='br'><h3 className='d_timeline-title'>2020 - 2021</h3><p className='d_timeline-text'><span className='d_title'> Basic Research 2020-21 </span><span className='d_company'>University of Macedonia</span> Received funding from the Research Committee of the University of Macedonia.</p></li>,
    <li className='d_timeline-item' key='ih'><h3 className='d_timeline-title'>06 / 2022</h3><p className='d_timeline-text'><span className='d_title'> 3rd place on Infinitech Hackathon </span><span className='d_company'>Crowdpolicy</span> The Infinitech hackathon is one of the open innovation actions in the context of the "Infinitech Project".</p></li>,
    <li className='d_timeline-item' key='ex'><h3 className='d_timeline-title'>2014 - 2015</h3><p className='d_timeline-text'><span className='d_title'>Excelence Award</span><span className='d_company'>1st Lyceum of Kalamaria</span> An award that is provided to every student that achieved highest score in the last class of the lyceum.</p></li>,
  ];

  return (
    <div className='container'><div className='row'><div className='col-md-12 text-center'><h2>My Resume</h2><div className='space-border'/></div></div>
    <div className='row gh-5'>
      <div className='col-lg-6' data-aos='fade-up' data-aos-once='true'><div className='p-4'><h3 className='s_border'>Experiences</h3><PaginatedTimeline items={exp} maxHeight={560}/></div></div>
      <div className='col-lg-6' data-aos='fade-up' data-aos-once='true'><div className='p-4'><h3 className='s_border'>Education</h3><PaginatedTimeline items={edu} maxHeight={560}/></div></div>
      <div className='spacer-double'/>
    </div>
    <div className='row gh-5'>
      <div className='col-lg-6' data-aos='fade-up' data-aos-once='true'><div className='p-4'><h3 className='s_border'>Publications</h3><PaginatedTimeline id='publications' items={pubs} maxHeight={560}/></div></div>
      <div className='col-lg-6' data-aos='fade-up' data-aos-once='true'><div className='p-4'><h3 className='s_border'>Awards</h3><PaginatedTimeline id='awards' items={awards} maxHeight={560}/></div></div>
      <div className='spacer-double'/>
    </div></div>
  );
};
export default Resume;
