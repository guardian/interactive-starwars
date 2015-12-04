import scrollAnimate from '../lib/scrollAnimate';

var pageEl = document.body; 

export default function(sectionEl) {
    // scroll sections
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
    
    // swipe sections
    /*var mainEl = document.querySelector(".js-main");
    var mc = new Hammer(mainEl);
    mc.on("swipe pan", e => {
        console.log("switch section");
    });
    mc.on("tap", e => {
        console.log("tap");
    });*/
}
