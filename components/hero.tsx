"use client";

import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import styles from "../app/page.module.css";

const Hero = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);

  let xPercent = 0;
  const direction = -1;
  let animationFrameId: number; 

  useEffect(() => {
    const animate = () => {
      xPercent += 0.030  * direction;

      if (xPercent < -100) {
        xPercent = 0;
      } else if (xPercent > 0) {
        xPercent = -100;
      }

      gsap.to(firstText.current, { xPercent, duration: 0.1, ease: "none" });
      gsap.to(secondText.current, { xPercent, duration: 0.1, ease: "none" });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId); 
    };
  }, []);

  return (
    <div className="main my-auto">
      <div className={styles.sliderContainer}>
        <div className={`${styles.slider} text-6xl md:text-8xl flex`}>
          <p ref={firstText} className="my-auto whitespace-nowrap">
            Your Gateway to Article Summarization.
          </p>
          <p ref={secondText} className="my-auto whitespace-nowrap">
            Your Gateway to Article Summarization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
