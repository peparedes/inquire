import React from 'react';
import { Button } from 'react-bootstrap';

import './About.scss';

const About = () => (
  <div className="About">
    <img
      src="/inquire.png"
      alt="Inquire"
    />
    <h1>INQUIRE.AI</h1>
    <p>A search engine for qualitative research.</p>
    <div>
      <Button href="http://stanford.edu">Read the Paper</Button>
      <Button href="https://stanford.edu"><i className="fa fa-star" /> Get Started</Button>
    </div>
    <footer>
      <p>Want to join the project? <a href="http://stanford.edu">Contact Pablo Paredes.</a>.</p>
    </footer>
  </div>
);

export default About;
