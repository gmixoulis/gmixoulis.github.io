import React from 'react';
import ReactDOM from 'react-dom/client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'font-awesome/css/font-awesome.min.css';
import 'elegant-icons/style.css';
import 'et-line/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/style.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

AOS.init({ offset: 200, duration: 800, easing: 'ease-in-out-sine', delay: 200, mirror: true });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
reportWebVitals();
