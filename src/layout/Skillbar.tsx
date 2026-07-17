import React from 'react';
interface Props { bgColor: string; progress: number; }
const ProgressBar: React.FC<Props> = ({ bgColor, progress }) => (
  <div className='progress-bar' style={{ height: 6, width: '100%', backgroundColor: '#303030', borderRadius: 50 }}>
    <div style={{ height: '100%', width: `${progress}%`, backgroundColor: bgColor, borderRadius: 'inherit', textAlign: 'right' }}>
      <span className='main-bar'>{progress}%</span>
    </div>
  </div>
);
export default ProgressBar;
