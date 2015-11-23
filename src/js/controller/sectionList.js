import {isMobile} from '../lib/util';

export default function(el, dataList) {
    var chars = el.select(".js-list")
    .style("position", "relative")
    .selectAll("div")
    .data(dataList).enter();
    
    chars
    .append("div")
    .attr("id", d => d.id)
    .attr("class", "l-item" + (isMobile() ? "":" a-item")) 
    .style("position", "absolute")
    .style("top", d => d.top)
    .style("left", d => d.left)
    .style("width", d => d.size + "px")
    .style("height", d => d.size + "px")
    .style("background-image", d => d.img)
    .on("touchstart", d => addItemSelected(el, d))
    .on("click", d => { if (isMobile()) return; addItemSelected(el, d);})
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
    //.text((d,i) => i+". "+d.name);
}

function addItemSelected(el, d) {
    var itemEl = el.select(".js-item");     
    
    itemEl.classed("d-n", false);
    itemEl.select(".js-name").text(d.name);
    itemEl.select(".js-desc").text(d.bio);
    itemEl.select(".js-know").text(d.known_info);
    itemEl.select(".js-img").style("background-image", d.imgSelect);
}
