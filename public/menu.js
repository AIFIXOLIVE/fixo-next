document.addEventListener('DOMContentLoaded', function() {
 
 // Переменные для работы с мобильным меню
 const menuToggle = document.querySelector('.menu-toggle');
 const navLinks = document.querySelector('.nav-links');

 // Переключение меню по клику на кнопку + анимация кнопки
 menuToggle.addEventListener('click', function(e) {
   e.stopPropagation(); // предотвращаем срабатывание клика по документу
   navLinks.classList.toggle('active');
   menuToggle.classList.toggle('active');
 });

 // Закрытие меню при клике вне его и кнопки
 document.addEventListener('click', function(e) {
   if (navLinks.classList.contains('active') &&
       !navLinks.contains(e.target) &&
       !menuToggle.contains(e.target)) {
     navLinks.classList.remove('active');
     menuToggle.classList.remove('active');
   }
 });

 // Закрытие мобильного меню при клике на ссылку
 document.querySelectorAll('.nav-links a').forEach(link => {
   link.addEventListener('click', function() {
     navLinks.classList.remove('active'); // Убираем активное меню
     menuToggle.classList.remove('active'); // Убираем активное состояние кнопки
   });
 });

 // Обработка свайпов для закрытия и открытия меню
 let touchStartX_nav = null; // для закрытия меню (на самом меню)
 let touchStartX_doc = null; // для открытия меню (на документе)

 // Свайп на меню для закрытия
 navLinks.addEventListener('touchstart', function(e) {
   touchStartX_nav = e.touches[0].clientX;
 }, { passive: true });

 navLinks.addEventListener('touchmove', function(e) {
   if (touchStartX_nav === null) return;
   const currentX = e.touches[0].clientX;
   const diffX = currentX - touchStartX_nav;
   if (diffX > 50) { // если свайп вправо больше 50px – закрываем меню
     navLinks.classList.remove('active');
     menuToggle.classList.remove('active');
     touchStartX_nav = null;
   }
 }, { passive: true });

 // Свайп по документу для открытия меню, если оно закрыто
 document.addEventListener('touchstart', function(e) {
   if (!navLinks.classList.contains('active')) {
     touchStartX_doc = e.touches[0].clientX;
   }
 }, { passive: true });

 document.addEventListener('touchmove', function(e) {
   if (touchStartX_doc === null) return;
   const currentX = e.touches[0].clientX;
   const diffX = touchStartX_doc - currentX; // свайп влево
   if ((window.innerWidth - touchStartX_doc < 20) && diffX > 50) {
     navLinks.classList.add('active');
     menuToggle.classList.add('active');
     touchStartX_doc = null;
   }
 }, { passive: true });

 document.addEventListener('touchend', function() {
   touchStartX_doc = null;
 });
});
