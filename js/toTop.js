import { layers, wheel } from "./paralax.js";

const scrollTopBtn = document.getElementById('toTop');


let lastScroll = 0;

// Функция для обработки прокрутки страницы и отображения/скрытия кнопки "наверх"
window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (window.scrollY > 300) {
        if (currentScroll > lastScroll) {
            // Скрываем кнопку при прокрутке вниз
            scrollTopBtn.classList.remove('hidden');
        } else {
            // Показываем кнопку при прокрутке вверх
            if (window.scrollY > 100) {
                scrollTopBtn.classList.add('hidden');
            }
        }
    }
    lastScroll = currentScroll <= 0 ? 0 : currentScroll; // Не учитываем отрицательный скролл
});

// Функция для плавной прокрутки страницы вверх
function scrollToTop() {
    
    layers.forEach((layer) => {
        layer.classList.add('no-transition');
    })
    wheel.classList.add('no-transition');

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

// Назначаем обработчик клика на кнопку "наверх" для вызова функции scrollToTop
scrollTopBtn.addEventListener('click', scrollToTop);