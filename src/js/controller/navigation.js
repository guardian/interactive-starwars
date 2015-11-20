import scrollAnimate from '../lib/scrollAnimate';

export default function(el) {
    var nav = el.querySelector(".js-nav");    
    nav.addEventListener("click", e => {
        var state = e.target.dataset.nav;
        if (state === undefined) return;

        scrollAnimate(
            window.scrollY,
            el.querySelector(".js-" + state).offsetTop,
            250
        );
    });
}
