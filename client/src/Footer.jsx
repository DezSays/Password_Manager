import React from "react";
import { FaGithub, FaLinkedin, FaRegIdCard } from 'react-icons/fa';
import './index.css'

const Footer = () => {
  return (
    <footer className="bg-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex space-x-6">
          <a
            href="https://github.com/dezSays/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white"
          >
            <FaGithub size={30} />
          </a>
          <a
            href="https://www.linkedin.com/in/dezarea-bryan/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white"
          >
            <FaLinkedin size={30} />
          </a>
          <a
            href="https://dezthedev.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white"
          >
            <FaRegIdCard size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
