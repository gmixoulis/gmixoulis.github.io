import React from 'react';
import Section from '../layout/Section';
const cards = [
  { icon: 'icon_globe', title: 'Research', text: 'As Blockchain researcher with multiple publications and work on blockchain projects and start-ups, my main skills have been honed to examine the data in and usage of these ledgers to determine the effectiveness of the blockchain, identify areas for improvement, and develop strategies for implementing changes.' },
  { icon: 'icon_tools', title: 'Development', text: 'As a developer on both blockchain (web3, nfts, defi) and data science (machine and deep learning emphasizing on graph embeddings) domains I have experimented and worked with many softwares, technologies, editors, programming languages and frameworks.' },
  { icon: 'icon_book', title: 'Learn', text: 'Throughout my academic years I have developed the Hacker attitude, which is to enjoy building and breaking things to understand how they work. Moreover, I believe that lifelong learning is my way of life.' },
];
const Whatido: React.FC = () => (
  <Section id='whatido' title='What I Do'><div className='row'>
    {cards.map((c, i) => (
      <div className='col-lg-4' key={c.title} data-aos='fade' data-aos-delay={300+i*100} data-aos-duration='1000' data-aos-easing='ease' data-aos-once='true'>
        <div className='de_3d-box'><div className='d-inner'><i className={`${c.icon} id-color-2`}/><div className='text'><h3>{c.title}</h3>{c.text}</div></div></div>
      </div>
    ))}
  </div></Section>
);
export default Whatido;
