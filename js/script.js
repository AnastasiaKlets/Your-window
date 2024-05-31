let prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("header").style.top = "0";
    } else {
        document.getElementById("header").style.top = "-200px";
    }
    prevScrollpos = currentScrollPos;
}

function slider({containerSelector, slideSelector, nextSlideSelector, prevSlideSelector, wrapperSelector, fieldSelector, indicatorsClass, elementsPerPage = 1, elementsPerPageMobile = 1, columnGap = 0, duration = 0, swipe = false, totalCounter, currentCounter}) {
    let slideIndex = 1,
        offset = 0,
        timer = 0,
        perPage = 1,
        gap = 0,
        startX,
        endX,
        total,
        current,
        mobile = window.matchMedia('(max-width: 992px)').matches,
        templates = [],
        mainClass,
        dots = [];
    const slides = document.querySelectorAll(slideSelector),
        container = document.querySelector(containerSelector),
        prev = document.querySelector(prevSlideSelector),
        next = document.querySelector(nextSlideSelector),
        wrapper = document.querySelector(wrapperSelector),
        field = document.querySelector(fieldSelector);

    if (indicatorsClass) {
        mainClass = indicatorsClass.slice(0, -11);
    }
    if (totalCounter) {
        total = container.querySelector(totalCounter);
        total.textContent = slides.length;
    }
    if (currentCounter) {
        current = container.querySelector(currentCounter)
        current.textContent = slideIndex;
    }

    let baseSlides = slides;
    mobile ? perPage = elementsPerPageMobile : perPage = elementsPerPage;
    mobile ? gap = columnGap / 2 : gap = columnGap;
    perPage == 1 ? gap = 0 : gap = gap;
    let width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width) / perPage - (gap * (slides.length - 1) / slides.length)) + 'px';

    field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";
    field.style.columnGap = gap + "px";

    slides.forEach((slide, index) => {
        slide.style.width = width;
        templates[index] = slide;
    });

    for (let i = 0; i < (perPage - 1); i++) {
        field.append(templates[i + 1].cloneNode(true));
    }

    if (indicatorsClass) {
        let indicators = document.createElement('div');
        indicators.classList.add(indicatorsClass);
        container.append(indicators);

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            if (!containerSelector.includes('features')) {
                mobile ? dot.style.width = 100 / slides.length + '%' : dot.style.width = '';
            }
            dot.setAttribute('data-slide-to', i + 1);
            dot.classList.add(`${mainClass}_dot`);
            if (i == 0) {
                dot.classList.add(`${mainClass}_active`);
            }
            if (containerSelector.includes('features')) {
                dot.textContent = `0${i + 1}.`;
            }
            if (containerSelector.includes('portfolio') && !mobile) {
                if (i < 4) {
                    dot.style.background = `url('../img/portfolio/portfolio_${i + 1}.jpg') no-repeat 50%/cover`;
                } else {
                    dot.classList.add("hide");
                }
            }
            indicators.append(dot);
            dots.push(dot);
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');
                slideIndex = slideTo;
                offset = (deleteNotDigits(width) + gap) * (slideTo - 1);
                changeActivity();
                makeTimer(duration);
            });
        });
    }

    makeTimer(duration);

    window.addEventListener('resize', (e) => {
        mobile = window.matchMedia('(max-width: 992px)').matches;
        mobile ? perPage = elementsPerPageMobile : perPage = elementsPerPage;
        mobile ? gap = columnGap / 2 : gap = columnGap;
        perPage == 1 ? gap = 0 : gap = gap;
        width = Math.floor(deleteNotDigits(window.getComputedStyle(wrapper).width) / perPage - (gap * (slides.length - 1) / slides.length)) + 'px';
        field.style.width = 100 * (slides.length + perPage - 1) / perPage + "%";
        field.style.columnGap = gap + "px";

        while (field.childElementCount > baseSlides.length) {
            field.removeChild(field.lastElementChild)
        }
        for (let i = 0; i < (perPage - 1); i++) {
            field.append(templates[i + 1].cloneNode(true));
        }
        changeMaterial()

        let slidesNew = document.querySelectorAll(slideSelector);
        slidesNew.forEach((slide, index) => {
            slide.style.width = width;
        });

        if (indicatorsClass) {
            let dots = document.querySelectorAll(`.${mainClass}_dot`);
            dots.forEach((dot, index) => {
                if (!containerSelector.includes('features')) {
                    mobile ? dot.style.width = 100 / slides.length + '%' : dot.style.width = '';
                }
                if (containerSelector.includes('portfolio')) {
                    if (mobile) {
                        dot.classList.remove("hide");
                        dot.style.background = '';
                    } else {
                        if (index < 4) {
                            dot.classList.remove("hide");
                            dot.style.background = `url('../img/portfolio/portfolio_${index + 1}.jpg') no-repeat 50%/cover`;
                        } else {
                            dot.classList.add("hide");
                            dot.style.background = '';
                        }
                    }
                }
            });
        }

        slideIndex = 1,
            offset = 0,
            changeActivity();
        onSwipe();
    });

    if (nextSlideSelector) {
        next.addEventListener("click", () => {
            moveNext();
            makeTimer(duration);
        });
    }

    if (prevSlideSelector) {
        prev.addEventListener("click", () => {
            movePrev();
            makeTimer(duration);
        });
    }

    function moveNext() {
        if (!containerSelector.includes('portfolio')) {
            field.classList.add('trans-5')
        }
        if (offset >= (deleteNotDigits(width) + gap) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNotDigits(width) + gap;
        }

        if (slideIndex == slides.length) {
            slideIndex = 1;
            field.classList.remove('trans-5')
        } else {
            slideIndex++;
        }
        changeActivity();
    }

    function movePrev() {
        if (!containerSelector.includes('portfolio')) {
            field.classList.add('trans-5')
        }
        if (offset < deleteNotDigits(width)) {
            offset = (deleteNotDigits(width) + gap) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width) + gap;
        }

        if (slideIndex == 1) {
            slideIndex = slides.length;
            field.classList.remove('trans-5')
        } else {
            slideIndex--;
        }
        changeActivity();
    }

    function changeActivity() {
        field.style.transform = `translateX(-${offset}px)`;
        if (currentCounter) {
            current.textContent = slideIndex;
        }
        if (indicatorsClass) {
            dots.forEach(dot => dot.classList.remove(`${mainClass}_active`));
            if (containerSelector.includes('portfolio') && slideIndex > 4 && !mobile) {
                return;
            }
            dots[slideIndex-1].classList.add(`${mainClass}_active`);
        }
    }

    function makeTimer(duration){
        if (duration == 0) {
            return;
        }
        clearInterval(timer);
        timer = setInterval(moveNext, duration);
    }

    function deleteNotDigits(str) {
        return +str.replace(/[^\d\.]/g, '');
    }

    const start = (e) => {
        startX = e.pageX || e.touches[0].pageX;
    }

    const end = () => {
        let distance = 20;
        if (endX < startX && Math.abs(startX - endX) > distance) {
            moveNext();
            makeTimer(duration);
        }
        if (endX > startX && Math.abs(endX - startX) > distance) {
            movePrev();
            makeTimer(duration);
        }
    }

    const move = (e) => {
        endX = e.pageX || e.touches[0].pageX;
    }

    onSwipe()

    function onSwipe() {
        field.addEventListener('mousedown', start);
        field.addEventListener('touchstart', start, {passive: true});

        field.addEventListener('mousemove', move);
        field.addEventListener('touchmove', move, {passive: true});

        field.addEventListener('mouseup', end);
        field.addEventListener('touchend', end);

        if (!swipe || !mobile) {
            field.removeEventListener('mousedown', start);
            field.removeEventListener('touchstart', start, {passive: true});

            field.removeEventListener('mousemove', move);
            field.removeEventListener('touchmove', move, {passive: true});

            field.removeEventListener('mouseup', end);
            field.removeEventListener('touchend', end);
        }
    }
}

function openModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function modal(triggerSelector, closeSelector, modalSelector) {
    const modalTrigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector);
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute(closeSelector) == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });
}

function changeMaterial() {
    if (document.querySelector('.materials_sliders') != null) {
        let matearials_images = document.querySelectorAll('.profiles_wrapper img, .accessories_wrapper img');
        let profiles_main = document.querySelector('.materials_images_profile');
        let accessories_main = document.querySelector('.materials_images_accessory');

        matearials_images.forEach(image => {
            image.addEventListener('click', (e) => {
                let main_image;
                let new_src = image.getAttribute('src').split('.')[0] + '_i.' + image.getAttribute('src').split('.')[1];
                new_src.includes('profiles') ? main_image = profiles_main : main_image = accessories_main;
                main_image.setAttribute('src', new_src);
            });
        });
    }
}

if (document.querySelector('.consult') != null) {
    modal('[data-modal]', 'data-close', '.consult');
    modal('[data-thanks]', 'data-close', '.thanks');
}

document.querySelector('.consult_form').addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal('.consult');
    openModal('.thanks');
});

if (document.querySelector('.reviews_field') != null) {
    slider({
        containerSelector: '.reviews_container',
        slideSelector: '.reviews_slide',
        nextSlideSelector: '.reviews_next',
        prevSlideSelector: '.reviews_prev',
        wrapperSelector: '.reviews_wrapper',
        fieldSelector: '.reviews_field',
        indicatorsClass: 'reviews_indicators',
        totalCounter: '#total',
        currentCounter: '#current',
        elementsPerPage: 3,
        elementsPerPageMobile: 1,
        columnGap: 24,
        swipe: true,
    });
}
if (document.querySelector('.features_field') != null) {
    slider({
        containerSelector: '.features_container',
        slideSelector: '.features_slide',
        nextSlideSelector: '.features_next',
        prevSlideSelector: '.features_prev',
        wrapperSelector: '.features_wrapper',
        fieldSelector: '.features_field',
        indicatorsClass: 'features_indicators',
        totalCounter: '#total',
        currentCounter: '#current',
        swipe: true,
    });
}
if (document.querySelector('.portfolio_field') != null) {
    slider({
        containerSelector: '.portfolio_container',
        slideSelector: '.portfolio_slide',
        nextSlideSelector: '.portfolio_next',
        prevSlideSelector: '.portfolio_prev',
        wrapperSelector: '.portfolio_wrapper',
        fieldSelector: '.portfolio_field',
        indicatorsClass: 'portfolio_indicators',
        totalCounter: '#total',
        currentCounter: '#current',
        swipe: true,
    });
}
if (document.querySelector('.profiles_field') != null) {
    slider({
        containerSelector: '.profiles_container',
        slideSelector: '.profiles_slide',
        nextSlideSelector: '.profiles_next',
        prevSlideSelector: '.profiles_prev',
        wrapperSelector: '.profiles_wrapper',
        fieldSelector: '.profiles_field',
        indicatorsClass: 'profiles_indicators',
        elementsPerPage: 5,
        elementsPerPageMobile: 5,
        columnGap: 20,
        swipe: true,
    });
}
if (document.querySelector('.accessories_field') != null) {
    slider({
        containerSelector: '.accessories_container',
        slideSelector: '.accessories_slide',
        nextSlideSelector: '.accessories_next',
        prevSlideSelector: '.accessories_prev',
        wrapperSelector: '.accessories_wrapper',
        fieldSelector: '.accessories_field',
        indicatorsClass: 'accessories_indicators',
        elementsPerPage: 5,
        elementsPerPageMobile: 5,
        columnGap: 20,
        swipe: true,
    });
}

changeMaterial()

