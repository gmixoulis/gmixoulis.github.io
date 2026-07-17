import React, { useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import Section from '../layout/Section';

const slides = [
  { image: '/img/gallery/gym.png', title: 'Workout' },
  { image: '/img/gallery/news.png', title: 'Keep updated with the latest news' },
  { image: '/img/gallery/languages.png', title: 'Learn Foreign Languages' },
  { image: '/img/gallery/anime.png', title: 'Watch Anime' },
  { image: '/img/gallery/theatre.png', title: 'Theatre Acting and Watching Theatre' },
  { image: '/img/gallery/protest.png', title: 'Active Citizen / Politicized' },
];

const cardStyle: React.CSSProperties = { margin: '0 10px', borderRadius: '8px', overflow: 'hidden', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' };
const items = slides.map((s, i) => (
  <div key={i} style={cardStyle}>
    <img src={s.image} alt={s.title} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}/>
    <div style={{ padding: '12px 14px', fontSize: '15px', fontWeight: 600, color: '#333', textAlign: 'center', minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.title}</div>
  </div>
));
const responsive = { 0: { items: 1 }, 576: { items: 2 }, 768: { items: 3 }, 1024: { items: 4 } };

const Activities: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Section id='activities' title='Extracurricular Activities' bgImage='/img/background/5.jpg'><div className='row'>
      <div className='col-md-10 text-center m-auto'><div className='carousel-wrapper'>
        <button type='button' className='carousel-arrow carousel-arrow--prev' aria-label='Previous' onClick={() => setActiveIndex(i => Math.max(0, i-1))}><i className='fa fa-angle-left'/></button>
        <AliceCarousel activeIndex={activeIndex} onSlideChanged={(e: { item: number }) => setActiveIndex(e.item)} mouseTracking items={items} responsive={responsive} disableDotsControls disableButtonsControls/>
        <button type='button' className='carousel-arrow carousel-arrow--next' aria-label='Next' onClick={() => setActiveIndex(i => Math.min(items.length-4, i+1))}><i className='fa fa-angle-right'/></button>
      </div></div>
    </div></Section>
  );
};
export default Activities;
