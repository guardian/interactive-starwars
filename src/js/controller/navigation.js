import scrollAnimate from '../lib/scrollAnimate';

var pageEl = document.body; 

export default function(sectionEl) {
    var nav = sectionEl.querySelector(".js-nav");    
    nav.addEventListener("click", e => {
        var state = e.target.dataset.nav;
        if (state === undefined) return;

        scrollAnimate(
            pageEl.scrollTop,
            sectionEl.querySelector(".js-" + state).offsetTop,
            250
        );
    });
}
