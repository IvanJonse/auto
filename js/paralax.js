export const layers = document.querySelectorAll('.layer');
export const wheel = document.getElementById('hero__bg');
const about = document.getElementById('about__bg');
const body = document.body;

let fadeVal = 1;
let step = 0.015;
let lastScrollTop = 0;

function parlax() {

    let currentOpacity = fadeVal;   
    let currentScrollPos = window.pageYOffset || window.scrollY;

    if (window.scrollY  < 860) {
        if (fadeVal > 1) {
            fadeVal = 1;
        }

        const aboutTopSection = about.getBoundingClientRect().top + 580;

        layers.forEach((layer, index) => {
                let opacityNext = currentOpacity - (0.09 * index);
                currentOpacity = opacityNext;
                
                const speed = layer.getAttribute('data-speed');
            
                layer.style.transform = `translateY(${window.scrollY * speed / 160}px) translate3d(0, 0, 0)`;
                layer.style.opacity = `${currentOpacity.toFixed(2)}`;
              
                if (lastScrollTop > aboutTopSection) {
                    layer.classList.add('hidden');
                    fadeVal = 0;
                } else {
                    layer.classList.remove('hidden');
                }
            }
        )
        
        const speed = wheel.getAttribute('data-speed');
        wheel.style.transform = `
            translateY(${window.scrollY * speed / 85}px)
            rotate(${window.scrollY * speed / 100}deg) 
            translate3d(0, 0, 0)
        `;
        wheel.style.opacity = `${currentOpacity + 1.8}`;

        if (lastScrollTop > aboutTopSection) {
            wheel.classList.add('hidden');
            fadeVal = 0;
        } else {
            wheel.classList.remove('hidden');
        }

        //направление скролла вверх или вниз
        if (currentScrollPos > lastScrollTop) {
            fadeVal -= step;
            body.classList.remove('scrolled'); 
        } else {
            fadeVal += step;
            if (window.scrollY < 300) {
                body.classList.add('scrolled');
                layers.forEach((layer) => {
                    layer.style.transform = 'translate(0) translate3d(0, 0, 0)';
                    layer.style.opacity = '1';
                })
                wheel.style.transform = 'translate(0) rotate(0) translate3d(0, 0, 0)';
                wheel.style.opacity = '1';
            } 
        }

        lastScrollTop = currentScrollPos;
    }

    if (window.scrollY === 0) {
        fadeVal = 1;

        layers.forEach((layer) => {
            layer.classList.remove('no-transition');
        })
        wheel.classList.remove('no-transition');
    }
 }  

window.addEventListener('scroll', parlax);

