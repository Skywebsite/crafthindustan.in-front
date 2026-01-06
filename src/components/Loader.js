import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <DotLottieReact
          src="https://lottie.host/a49d2e4d-aae7-4745-af4c-c0a60146e393/dlwJ5Ah0Sz.lottie"
          loop
          autoplay
          className="loader-animation"
        />
        <p className="loader-text">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;

