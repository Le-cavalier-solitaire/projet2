import React from "react";
import "../assets/text-animation.css";

/**
 * Maintien du composant
 */
export const TextAnimator = () => {
  const texts = [
    "Connectez-vous pour commencer!",
    "Explorer dans les différents onglets!",
    "Ne divulguez pas vos identifiants!"
  ];

  return (
    <div className="animated-text-container">
      {texts.map((text, index) => (
        <div key={index} className="animated-text font-semibold font-mono text-[38px]">
          {text}
        </div>
      ))}
    </div>
  );
};
