import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import Section from '../layout/Section';
const responsive = { 0: { items: 1 }, 568: { items: 2 }, 1024: { items: 3, itemsFit: 'contain' as const } };

const Portfolio: React.FC = () => {
  const modules = import.meta.glob('../../public/img/portfolio/*.{png,gif,PNG,jpg,jpeg,JPG}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const items = Object.entries(modules).map(([path, src]) => {
    const fileInfo = path.split('/').pop()!.replace(/\.(png|gif|PNG|jpe?g|JPG)$/, '');
    return <div className='item' key={fileInfo} data-value={fileInfo}><a href={`https://${fileInfo}`} target='_blank' rel='noopener noreferrer'><img src={src} alt={fileInfo} width={450} height={350}/></a></div>;
  });
  return <Section id='portfolio' title='Web Apps Portfolio'><div className='col-md-8 text-center m-auto'>
    <AliceCarousel autoPlay autoPlayInterval={2000} animationDuration={2000} animationType='fadeout' infinite items={items} responsive={responsive} disableDotsControls disableButtonsControls/>
  </div></Section>;
};
export default Portfolio;
