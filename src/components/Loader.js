import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <DotLottieReact
          src="https://lottie.host/c5b0626f-cfcb-499f-a3be-794da26db6b9/vvWCrcxoIh.lottie"
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

