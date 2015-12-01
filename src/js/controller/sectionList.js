import Hammer from '../lib/hammer.min';
import {isMobile} from '../lib/utils';
import {addItemSelected} from '../controller/sectionItemSelected';

export default function(el, dataList, mt) {
    var chars = el.select(".js-list")
    .style("margin-top", mt + "px")
    .selectAll("div")
    .data(dataList).enter();
    
    chars
    .append("div")
    .attr("id", d => d.id)
    .attr("class", "l-item" + (isMobile() ? "":" a-item")) 
    //.attr("class", "l-item a-item") 
    .style("position", "absolute")
    .style("top", d => d.top)
    .style("left", d => d.left)
    .style("width", d => d.size + "px")
    .style("height", d => d.size + "px")
    .style("background-image", d => d.img)
    .on("touchstart", (d) => el.select("#"+d.id).classed("a-item", true))
    .on("touchend", (d) => el.select("#"+d.id).classed("a-item", false))
    .on("click", d => {if (isMobile()) return; addItemSelected(el, d);})
    .each(d => {if (!isMobile()) return; addHammerEvents(el, d);})
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
}

function addHammerEvents(el, d) {
    var mc = Hammer(document.querySelector("#"+d.id));
    mc.on("tap", e => {
        addItemSelected(el, d);
    });
}
