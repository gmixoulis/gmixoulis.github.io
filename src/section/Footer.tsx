import React from 'react';
const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const socials = [
    { href: 'https://www.facebook.com/george.mihoulis/', icon: 'fa-facebook' },
    { href: 'https://twitter.com/GeorgeMicou', icon: 'fa-twitter' },
    { href: 'https://www.linkedin.com/in/george-michoulis/', icon: 'fa-linkedin' },
    { href: 'https://github.com/gmixoulis', icon: 'fa-github' },
    { href: 'https://scholar.google.com/citations?user=nk0lq8YAAAAJ&hl=el', icon: 'fa-google' },
  ];
  return (
    <footer><div className='container'><div className='row'>
      <div className='col-md-6'><a href='/' rel='noreferrer'><span className='copy'>&copy; Copyright {year} - George Michoulis</span></a></div>
      <div className='col-md-6'><div className='social-icons'>
        {socials.map(s => <a key={s.icon} href={s.href} target='_blank' rel='noreferrer'><span className='buton'><i className={`fa ${s.icon}`}/></span></a>)}
      </div></div>
    </div></div></footer>
  );
};
export default Footer;
