import charHTML from '../view/sectionChar.html!text';
import {getRandom, getLayout, isMobile} from '../lib/util';
import {addItemSelected} from '../controller/sectionItemSelected';

const maxChar = 21;
const maxRadius = 64;

export default function(el, dataCha, assetPath) {
    el.querySelector('.js-cha').innerHTML = charHTML;
    
    var pts = getLayout();
    
    // TODO: filter and sort on importance
    dataCha = dataCha.filter((d) => d.importance !== "" );
    // NOTE: current layout has 16 spots
    if (dataCha.length > maxChar) { dataCha = dataCha.slice(0, maxChar); }
    dataCha.sort((a, b) => {
        if (a.importance > b.importance) { return 1; }
        if (a.importance < b.importance) { return -1;}
        // a must be equal to b
        return 0;
    });
    //console.log(dataCha);

    el.querySelector(".js-cha-num").textContent = dataCha.length;
    
    dataCha = dataCha.map((d, i) => {
        //d.size = getRandom(48, maxRadius);
        d.size = maxRadius - (d.importance-1) * 6;
        d.top = "calc(" + pts[i].y + "% - " + d.size/2 + "px)"; 
        d.left = "calc(" + pts[i].x + "% - " + d.size/2 + "px)"; 
        
        // TODO: remove temp imgs
        //var n = (i%2===0) ? 1:2;   
        d.img = "url('" + assetPath + "/assets/imgs/char/" + d.id + ".svg')"; 
        d.imgSelect = "url('" + assetPath + "/assets/imgs/char/" + d.id + "-full.svg')"; 
        return d;
    });

    addList(d3.select(".js-cha"), dataCha);
}

function addList(el, dataList) {
    var chars = d3.select(".js-list")
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
}
