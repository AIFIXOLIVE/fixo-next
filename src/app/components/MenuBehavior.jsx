'use client';

import { useEffect } from 'react';

export default function MenuBehavior() {
  useEffect(() => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    const handleToggleClick = (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    };

    const handleDocumentClick = (e) => {
      if (
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    };

    const handleLinkClick = () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
    };

    menuToggle.addEventListener('click', handleToggleClick);
    document.addEventListener('click', handleDocumentClick);
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    let touchStartX_nav = null;
    let touchStartX_doc = null;

    const handleTouchStartNav = (e) => {
      touchStartX_nav = e.touches[0].clientX;
    };

    const handleTouchMoveNav = (e) => {
      if (touchStartX_nav === null) return;
      const currentX = e.touches[0].clientX;
      const diffX = currentX - touchStartX_nav;
      if (diffX > 50) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        touchStartX_nav = null;
      }
    };

    const handleTouchStartDoc = (e) => {
      if (!navLinks.classList.contains('active')) {
        touchStartX_doc = e.touches[0].clientX;
      }
    };

    const handleTouchMoveDoc = (e) => {
      if (touchStartX_doc === null) return;
      const currentX = e.touches[0].clientX;
      const diffX = touchStartX_doc - currentX;
      if (window.innerWidth - touchStartX_doc < 20 && diffX > 50) {
        navLinks.classList.add('active');
        menuToggle.classList.add('active');
        touchStartX_doc = null;
      }
    };

    menuToggle.addEventListener('touchstart', handleTouchStartNav, { passive: true });
    navLinks.addEventListener('touchmove', handleTouchMoveNav, { passive: true });
    document.addEventListener('touchstart', handleTouchStartDoc, { passive: true });
    document.addEventListener('touchmove', handleTouchMoveDoc, { passive: true });
    document.addEventListener('touchend', () => {
      touchStartX_doc = null;
    });

    return () => {
      // Cleanup
      menuToggle.removeEventListener('click', handleToggleClick);
      document.removeEventListener('click', handleDocumentClick);
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, []);

  return null;
}
