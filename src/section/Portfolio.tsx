import React from 'react';
import Carousel from '../components/Carousel';
import Section from '../layout/Section';

const Portfolio: React.FC = () => {
  const modules = import.meta.glob('../../public/img/portfolio/*.{png,gif,PNG,jpg,jpeg,JPG}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const slides = Object.entries(modules).map(([path, src]) => {
    const fileInfo = path.split('/').pop()!.replace(/\.(png|gif|PNG|jpe?g|JPG)$/, '');
    return (
      <a className='portfolio-tile' href={`https://${fileInfo}`} target='_blank' rel='noopener noreferrer' key={fileInfo} data-value={fileInfo}>
        <img className='square-media' src={src} alt={fileInfo} loading='lazy' />
        <span className='portfolio-tile__label'>{fileInfo}</span>
      </a>
    );
  });

  return (
    <Section id='portfolio' title='Web Apps Portfolio'>
      <div className='col-md-10 m-auto'>
        <Carousel slides={slides} autoplayDelay={2500} className='embla--portfolio' />
      </div>
    </Section>
  );
};

export default Portfolio;
