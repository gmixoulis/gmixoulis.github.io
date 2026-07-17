import React, { useState, useEffect } from 'react';
const Preloader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1600); return () => clearTimeout(t); }, []);
  return <div id='mainpreloader'>{loading ? <div className='preloader fadeOut'><div className='mainpreloader'><span/></div></div> : children}</div>;
};
export default Preloader;
