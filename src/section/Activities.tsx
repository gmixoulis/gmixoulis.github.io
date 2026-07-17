import React from 'react';
import Carousel from '../components/Carousel';
import Section from '../layout/Section';

const slides = [
  { image: '/img/gallery/gym.png', title: 'Workout' },
  { image: '/img/gallery/news.png', title: 'Keep updated with the latest news' },
  { image: '/img/gallery/languages.png', title: 'Learn Foreign Languages' },
  { image: '/img/gallery/anime.png', title: 'Watch Anime' },
  { image: '/img/gallery/theatre.png', title: 'Theatre Acting and Watching Theatre' },
  { image: '/img/gallery/protest.png', title: 'Active Citizen / Politicized' },
];

const Activities: React.FC = () => {
  const cards = slides.map((s) => (
    <div className='activity-card' key={s.image}>
      <img className='square-media' src={s.image} alt={s.title} loading='lazy' />
      <div className='activity-card__title'>{s.title}</div>
    </div>
  ));

  return (
    <Section id='activities' title='Extracurricular Activities' bgImage='/img/background/5.jpg'>
      <div className='col-md-10 m-auto'>
        <Carousel slides={cards} autoplayDelay={3000} className='embla--activities' />
      </div>
    </Section>
  );
};

export default Activities;
