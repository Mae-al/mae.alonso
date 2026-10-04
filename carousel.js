// Carrousel automatique : transforme tout groupe de MIN_IMAGES images ou plus
// dans un bloc .step-image en carrousel. En dessous, les images restent empilées.
(function () {
    var MIN_IMAGES = 3;

    document.querySelectorAll('.step-image').forEach(function (group) {
        var imgs = Array.from(group.querySelectorAll(':scope > img'));
        if (imgs.length < MIN_IMAGES) return;

        var carousel = document.createElement('div');
        carousel.className = 'carousel';
        carousel.innerHTML =
            '<div class="carousel-track" tabindex="0" aria-label="Carrousel d\'images"></div>' +
            '<div class="carousel-footer">' +
                '<button class="carousel-btn prev" aria-label="Image précédente">&#8592;</button>' +
                '<div class="carousel-dots"></div>' +
                '<span class="carousel-count"></span>' +
                '<button class="carousel-btn next" aria-label="Image suivante">&#8594;</button>' +
            '</div>';

        var track = carousel.querySelector('.carousel-track');
        var dots = carousel.querySelector('.carousel-dots');
        var count = carousel.querySelector('.carousel-count');
        var prev = carousel.querySelector('.prev');
        var next = carousel.querySelector('.next');

        imgs.forEach(function (img, i) {
            var slide = document.createElement('div');
            slide.className = 'carousel-slide';
            img.loading = i === 0 ? 'eager' : 'lazy';
            slide.appendChild(img);
            track.appendChild(slide);

            var dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', 'Image ' + (i + 1));
            dot.addEventListener('click', function () { goTo(i); });
            dots.appendChild(dot);
        });

        group.appendChild(carousel);

        function current() { return Math.round(track.scrollLeft / track.clientWidth); }
        function goTo(i) {
            i = Math.max(0, Math.min(imgs.length - 1, i));
            track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
        }
        function update() {
            var i = current();
            dots.querySelectorAll('.carousel-dot').forEach(function (d, k) {
                d.classList.toggle('active', k === i);
            });
            count.textContent = (i + 1) + ' / ' + imgs.length;
            prev.disabled = i === 0;
            next.disabled = i === imgs.length - 1;
        }

        prev.addEventListener('click', function () { goTo(current() - 1); });
        next.addEventListener('click', function () { goTo(current() + 1); });
        track.addEventListener('scroll', update, { passive: true });
        track.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current() - 1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current() + 1); }
        });
        window.addEventListener('resize', function () {
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = current() * track.clientWidth;
            track.style.scrollBehavior = '';
        });
        update();
    });
})();