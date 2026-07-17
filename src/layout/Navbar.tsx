import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
const navItems = [
  { to: 'hero-area', label: 'Home' }, { to: 'about', label: 'About me' },
  { to: 'whatido', label: 'What I Do' }, { to: 'MyGallery', label: 'Certificates' },
  { to: 'resume', label: 'My resume' }, { to: 'blog', label: 'Recent Posts' },
];
const Navbar: React.FC = () => {
  const [showmenu, setShowmenu] = useState(false);
  useEffect(() => {
    const header = document.getElementById('header-wrap'); const flytext = document.getElementById('fly'); const totop = document.getElementById('scroll-to-top');
    if (!header || !flytext || !totop) return;
    const sticky = header.offsetTop;
    const onScroll = () => {
      setShowmenu(false);
      if (window.pageYOffset > sticky) { header.classList.add('sticky'); totop.classList.add('show'); flytext.classList.add('hide'); }
      else { header.classList.remove('sticky'); flytext.classList.remove('hide'); totop.classList.remove('show'); }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className='navbar transition'><div className='container'>
      <Link className='navbar-brand' activeClass='active' spy to='hero-area'><img src='/img/logo.png' className='img-fluid d-block imginit' alt='logo'/></Link>
      <div className='dekstopmenu'><ul className='navbar-nav'>
        {navItems.map(i => <li className='nav-item' key={i.to}><Link className='nav-link transition' activeClass='active' spy to={i.to}>{i.label}</Link></li>)}
      </ul></div>
      {showmenu && <div className='mobilemenu'><ul className='navbar-nav mr-auto w-100 justify-content-end clearfix'>
        {navItems.map(i => <li className='nav-item' key={i.to}><Link className='nav-link transition' activeClass='active' smooth spy to={i.to}>{i.label}</Link></li>)}
      </ul></div>}
      <button className='burgermenu' type='button' onClick={() => setShowmenu(!showmenu)}><i className='fa fa-bars' aria-hidden='true'/></button>
    </div></nav>
  );
};
export default Navbar;
