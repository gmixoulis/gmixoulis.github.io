import React from 'react';
interface Props { id?: string; items: React.ReactNode[]; maxHeight?: number; }
const PaginatedTimeline: React.FC<Props> = ({ id, items, maxHeight = 560 }) => (
  <div className='paginated-timeline'><ul className='d_timeline' id={id} style={{ maxHeight, overflowY: 'auto' }}>{items}</ul></div>
);
export default PaginatedTimeline;
