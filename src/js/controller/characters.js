import {getRandom, getLayout} from '../lib/util';
import charSelectedHTML from '../view/characterSelected.html!text';
import scrollAnimate from '../lib/scrollAnimate';

const maxRadius = 64;

export default function(el, data) {
    var pts = getLayout();

    // TODO: filter and sort on importance
    data = data.filter((d) => d.importance !== "" );
    // NOTE: current layout has 16 spots
    if (data.length > 16) {
        data = data.slice(0, 16);
    }
    data.sort((a, b) => {
        if (a.importance > b.importance) { return 1; }
        if (a.importance < b.importance) { return -1;}
        // a must be equal to b
        return 0;
    });
    //console.log(data);

    var select = el.querySelector(".js-cha-select");
    el.querySelector(".js-cha-num").textContent = data.length;
    select.innerHTML = charSelectedHTML;
    
    data = data.map((d, i) => {
        //d.size = getRandom(48, maxRadius);
        d.size = maxRadius - (d.importance-1) * 6;
        d.top = "calc(" + pts[i].y + "% - " + d.size/2 + "px)"; 
        d.left = "calc(" + pts[i].x + "% - " + d.size/2 + "px)"; 
        
        // TODO: remove temp imgs
        var n = (i%2===0) ? 1:2;   
        d.img = "url('/assets/imgs/char" + n + ".svg')"; 
        return d;
    });

    var chars = d3.select(".js-cha-list")
    .style("position", "relative")
    .selectAll("div")
    .data(data).enter();
    
    chars
    .append("div")
    .attr("id", d => d.id)
    .attr("class", "l-item a-item")
    .style("position", "absolute")
    .style("top", d => d.top)
    .style("left", d => d.left)
    .style("width", d => d.size + "px")
    .style("height", d => d.size + "px")
    .style("background-image", d => d.img)
    .on("click", d => transition(el, select, d))
    .append("div")
    .attr("class", "l-ring a-ring");
    
    chars
    .append("div")
    .attr("class", "f-item pe-n")
    .style("position", "absolute")
    .style("top", d => d.top)
    .style("left", d => d.left)
    .style("width", d => d.size + "px")
    .style("margin-top", d => (d.size-12) + "px")
    .text(d => d.name);
    //.text((d, i) => i + ". " + d.name);
}

function transition(chaEls, selectEl, d) {
    //console.log(d, "is selected");
    selectEl.classList.add("d-n");
    var star = d3.select(".a-stars"),
        list = d3.selectAll(".js-cha-list div");
    star.classed("a-fall", true);
    list.classed("a-zoom-out",  item => item.id!==d.id ? true:false)
        .classed("a-zoom-in", item => item.id===d.id ? true:false);
    // select all related chars
    // zoom out rest of the chars with speed effect
    
    // scroll down
    // related chars fall on the char-selected section
    window.setTimeout(() => {
        star.classed("a-fall", false);
        selectEl.classList.remove("d-n");
        scrollAnimate(
            window.scrollY,
            selectEl.offsetTop,
            100
        );
        list.classed("a-zoom-in", false)
            .classed("a-zoom-out", false);
    }, 900);

    // display all data
    selectEl.querySelector(".js-cha-name").textContent = d.name;
    selectEl.querySelector(".js-cha-desc").textContent = d.bio;
    selectEl.querySelector(".js-cha-img").style.backgroundImage = d.img;
}
