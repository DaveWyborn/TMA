"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const Wireframe = ({ selectedService }: { selectedService: string }) => {
  const getWireframeSrc = () => {
    if (selectedService === "analytics") {
      return "/images/Analytics.svg";
    } else if (selectedService === "visualisation") {
      return "/images/Visualisation.svg";
    } else if (selectedService === "consent") {
      return "/images/Consent.svg";
    } else {
      return "/images/TMA_Wireframe_Default.svg";
    }
  };

  return (
    <div className="wireframe-container">
      <Image src={getWireframeSrc()} alt="Wireframe" width={800} height={600} />
      <button className="popup-button" onClick={() => alert('Show Popup Here')}>Tell me more</button>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Wireframe), { ssr: false });
