import React from 'react';
import { Parallax } from 'react-parallax';
interface SectionProps { id?: string; title?: string; bgImage?: string; strength?: number; className?: string; children?: React.ReactNode; }
const Section: React.FC<SectionProps> = ({ id, title, bgImage, strength = 300, className = '', children }) => (
  <div id={id} className={`section bg-bottom py-0 ${className}`}>
    {title && (<><div className='spacer-single'/><div className='row'><div className='col-md-12 text-center'><h2>{title}</h2><div className='space-border'/></div></div></>)}
    {bgImage ? (<div className='section bg-top bg-bottom py-0'><Parallax className='py-5' bgImage={bgImage} strength={strength}><div className='py-5 position-relative'><div className='container'>{children}</div></div></Parallax></div>) : <div className='container'>{children}</div>}
  </div>
);
export default Section;
