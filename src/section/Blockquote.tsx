import React from 'react';
import Section from '../layout/Section';
const Blockquote: React.FC = () => (
  <Section bgImage='/img/background/Alan_Turing_Enigma.jpg'>
    <div className='row align-items-center'><div className='col-md-10 offset-md-1'>
      <div className='spacer-double'/>
      <blockquote className='q-big'><i className='d-big icon_quotations'/>We can only see a short distance ahead, <br/>but we can see plenty there that needs <br/>to be done.<span className='d-quote-by'>Alan Turing</span></blockquote>
      <div className='spacer-double'/><div className='spacer-double'/><div className='spacer-single'/>
    </div></div>
  </Section>
);
export default Blockquote;
