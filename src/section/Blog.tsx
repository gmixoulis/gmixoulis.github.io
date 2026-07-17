import React from 'react';
import Section from '../layout/Section';
const Blog: React.FC = () => (
  <Section id='blog' title='Recent Posts' bgImage='/img/background/tokyo3.jpg'><div className='row'>
    <div className='de_count text-center'>
      <iframe title='LinkedIn posts' src='https://widgets.sociablekit.com/linkedin-profile-posts/iframe/97069' frameBorder='0' width='100%' height='1000'/>
    </div>
  </div></Section>
);
export default Blog;
