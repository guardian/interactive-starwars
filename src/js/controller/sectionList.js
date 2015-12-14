import Hammer from '../lib/hammer.min';
import {isMobile, isApp} from '../lib/utils';
import {addItemSelected} from '../controller/sectionItemSelected';
import svgs from '../../assets/svg.json!json';

export default function(el, dataList, mt) {
    var chars = el.select(".js-list")
    .style("margin-top", mt + "px")
    .selectAll("div")
    .data(dataList).enter();
    
    var icons = chars
    .append("div")
    .attr("id", d => d.id)
    .attr("class", "l-item" + (isMobile() ? "":" a-item")) 
    .style("position", "absolute")
    .style("top", d => d.top)
    .style("left", d => d.left)
    .style("width", d => d.size + "px")
    .style("height", d => d.size + "px")
    .on("click", d => {if (isMobile()) return; addItemSelected(el, d);})
    .on("touchstart", (d) => {
        if(isApp()){window.GuardianJSInterface.registerRelatedCardsTouch(true);}
        el.select("#"+d.id).classed("a-item", true);
    })
    .on("touchend", (d) => { 
        el.select("#"+d.id).classed("a-item", false);
        if(isApp()){window.GuardianJSInterface.registerRelatedCardsTouch(false);}
    })
    .each(d => {if (!isMobile()) return; addHammerEvents(el, d);});
    
    icons
    .html(d => {var str = svgs[d.id]; return str? svgs[d.id]:"<svg></svg>";});
    icons
    .append("div")
    .attr("class", "l-ring a-ring")
    .style("margin-top", d => (-d.size-7) + "px");
    
    chars
    .append("div")
    .attr("class", "f-item pe-n")
    .style("position", "absolute")
    .style("top", d => d.top)
    .style("left", d => d.left)
    .style("width", d => d.size + "px")
    .style("margin-top", d => (d.size-12) + "px")
    .text(d => d.name);
    // NOTE: mark order for debug
    //.text((d,i) => i+", "+d.name);
}

function addHammerEvents(el, d) {
    var id = document.querySelector("#"+d.id),
        //mc = Hammer(id);
        mc = new Hammer.Manager(id, {});

    mc.add(new Hammer.Tap({event: 'longtap', time: 500})); 
    mc.on("longtap press", e => {
        //console.log("tap or press");
        addItemSelected(el, d);
    });
}
