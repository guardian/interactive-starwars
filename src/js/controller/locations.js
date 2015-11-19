import locHTML from '../view/locations.html!text';
import {getLayout} from '../lib/util';

const radiusLoc = 64;
export default function(el, data) {
    // TODO: when js-nav-loc is clicked
    el.querySelector('.js-loc').innerHTML = locHTML;
    el.querySelector(".js-loc-num").textContent = data.length;
   
    var p = getLayout(),
        r = radiusLoc;
    data = data.map((d, i) => {
        d.top  = "calc(" + p[i].y + "% - " + r/2 + "px)",
        d.left = "calc(" + p[i].x + "% - " + r/2 + "px)"
        return d;
    });
    //console.log(data);

    d3.select(".js-loc-list")
    .style("position", "relative")
    .selectAll("div")
    .data(data).enter()
    .append("div")
    .attr("class", "l-item a-item")
    .style("position", "absolute")
    .style("top", d => d.top)
    .style("left", d => d.left)
    .style("width", d => r + "px")
    .style("height", d => r + "px")
    .style("background-color", (d, i) => "dimgrey")
    .append("div")
    .attr("class", "l-ring a-ring");
}
