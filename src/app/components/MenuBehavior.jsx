'use client';
import { useEffect } from 'react';

export default function MenuBehavior() {
  useEffect(() => {

    document.addEventListener('DOMContentLoaded', function () {
      const menuToggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');

      menuToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
      });

      document.addEventListener('click', function (e) {
        if (
          navLinks.classList.contains('active') &&
          !navLinks.contains(e.target) &&
          !menuToggle.contains(e.target)
        ) {
          navLinks.classList.remove('active');
          menuToggle.classList.remove('active');
        }
      });

      document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function () {
          navLinks.classList.remove('active');
          menuToggle.classList.remove('active');
        });
      });

      let touchStartX_nav = null;
      let touchStartX_doc = null;

      navLinks.addEventListener(
        'touchstart',
        function (e) {
          touchStartX_nav = e.touches[0].clientX;
        },
        { passive: true }
      );

      navLinks.addEventListener(
        'touchmove',
        function (e) {
          if (touchStartX_nav === null) return;
          const currentX = e.touches[0].clientX;
          const diffX = currentX - touchStartX_nav;
          if (diffX > 50) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            touchStartX_nav = null;
          }
        },
        { passive: true }
      );

      document.addEventListener(
        'touchstart',
        function (e) {
          if (!navLinks.classList.contains('active')) {
            touchStartX_doc = e.touches[0].clientX;
          }
        },
        { passive: true }
      );

      document.addEventListener(
        'touchmove',
        function (e) {
          if (touchStartX_doc === null) return;
          const currentX = e.touches[0].clientX;
          const diffX = touchStartX_doc - currentX;
          if (window.innerWidth - touchStartX_doc < 20 && diffX > 50) {
            navLinks.classList.add('active');
            menuToggle.classList.add('active');
            touchStartX_doc = null;
          }
        },
        { passive: true }
      );

      document.addEventListener('touchend', function () {
        touchStartX_doc = null;
      });
    });
  }, []);

  return null;
}
