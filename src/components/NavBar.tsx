"use client";

import { useEffect, useState } from "react";

export default function NavBar() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      setScrollPercentage(scrollPercent);

      // ✅ Show navbar when user starts scrolling
      if (!hasScrolled && scrollTop > 0) {
        setIsVisible(true);
        setHasScrolled(true); // Prevents it from resetting on further scrolls
      }
    };

    // ✅ Show navbar after 3 seconds if no scrolling happens
    const timer = setTimeout(() => {
      if (!hasScrolled) {
        setIsVisible(true);
      }
    }, 3000);

    window.addEventListener("scroll", updateScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", updateScroll);
    };
  }, [hasScrolled]);

  return (
    <>
      {/* Sticky Navigation Bar */}
      <nav
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-full px-6 py-2 flex space-x-6 z-50 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {["home", "services", "about", "contact"].map((section) => (
          <a
            key={section}
            href={`#${section}`}
            className="text-gray-700 hover:text-blue-600 transition"
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </a>
        ))}
      </nav>

      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 w-full h-1 bg-blue-500 transition-all"
        style={{ width: `${scrollPercentage}%` }}
      ></div>
    </>
  );
}
