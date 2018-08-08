import React from 'react';

import logo from '../assets/img/linea-logo-mini.png';

const Footer = () => {
    return(
        <footer className="footer bg-inverse">
            <span className="text-white float-left">Developer Portal Instance</span>
            <span className="text-white float-right">Powered by <a href="http://www.linea.gov.br/" target="_blank"><img src={logo} alt="LineA" /></a></span>
        </footer>
    );
};

export default Footer;