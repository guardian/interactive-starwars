import {getRandom, getLayout} from '../lib/util';

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

    el.querySelector(".js-cha-num").textContent = data.length;
    
    data = data.map((d, i) => {
        //d.size = getRandom(48, maxRadius);
        d.size = maxRadius - (d.importance-1) * 6;
        d.top = "calc(" + pts[i].y + "% - " + d.size/2 + "px)"; 
        d.left = "calc(" + pts[i].x + "% - " + d.size/2 + "px)"; 
        return d;
    });

    var chars = d3.select(".js-cha-list")
    .style("position", "relative")
    .selectAll("div")
    .data(data).enter();
    chars
    .append("div")
    .attr("class", "l-item a-item")
    .style("position", "absolute")
    .style("top", d => d.top)
    .style("left", d => d.left)
    .style("width", d => d.size + "px")
    .style("height", d => d.size + "px")
    .style("background-image", (d, i) => {
        // TODO: remove temp imgs
        var n = (i%2===0) ? 1:2;   
        return "url('/assets/imgs/char" + n + ".svg')";
    })
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
