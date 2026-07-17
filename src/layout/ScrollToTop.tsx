import React, { useState, useEffect } from 'react';
const ScrollToTop: React.FC = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => { const f = () => setVis(window.pageYOffset > 300); document.addEventListener('scroll', f); return () => document.removeEventListener('scroll', f); }, []);
  return <div id='scroll-to-top' className='init'>{vis && <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><i className='fa fa-chevron-up'/></div>}</div>;
};
export default ScrollToTop;
