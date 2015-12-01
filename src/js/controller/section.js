import secHTML from '../view/section.html!text';
import {isMobile, getLayout} from '../lib/util';
import {addItemSelected} from '../controller/sectionItemSelected';

const radiusLoc = 64;

export default function(el, data, sec) {
    
    var secEl, typeEls;
    
    secEl = el.querySelector('.js-' + sec);
    secEl.innerHTML = secHTML;
    secEl.querySelector(".js-num").textContent = data.length;
    
    typeEls = Array.prototype.slice.call(secEl.querySelectorAll(".js-type"));
    typeEls.forEach( d => d.textContent = data[0].type);
   
    var p = getLayout(),
        r = radiusLoc;
    
    data = data.map((d, i) => {
        d.size = r;
        d.top  = "calc(" + p[i].y + "% - " + r/2 + "px)";
        d.left = "calc(" + p[i].x + "% - " + r/2 + "px)";
        return d;
    });

    addSectionList(d3.select(".js-"+sec), data);
}

function addSectionList(el, dataList) {
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
    .on("click", d => {if (isMobile()) return; addItemSelected(el, d);})
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
