import scrollAnimate from '../lib/scrollAnimate';

var pageEl = document.body; 

export function loadNavigation(data) {
    var navEls;
    
    navEls = d3.select(".js-nav")
    .selectAll("li")
    .data(data).enter()
    .append("li")
    .attr("data-nav", d => d.id)
    .attr("class", d => "btn-nav");
    
    navEls
    .append("span")
    .html('<svg class="svg-nav" viewBox="0 0 30 30"><path d="M22.8 14.6L15.2 7l-.7.7 5.5 6.6H6v1.5h14l-5.5 6.6.7.7 7.6-7.6v-.9" /></svg>');
    navEls
    .append("span")
    .text(d => d.type);
}

export function addNavigationOnScroll(el) {
    // scroll sections
    var nav = el.querySelector(".js-nav");    
    nav.addEventListener("click", e => {
        var state = e.target.dataset.nav;
        if (state === undefined) return;

        scrollAnimate(
            pageEl.scrollTop,
            el.querySelector(".js-" + state).offsetTop,
            250
        );
    });

    var topList = el.querySelectorAll(".js-top"),
        topArr = Array.prototype.slice.call(topList);
    topArr.forEach(top => {
        top.addEventListener("click", e => {
            scrollAnimate(
                pageEl.scrollTop,
                0,
                250
            );
        });
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
