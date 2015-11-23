import secHTML from '../view/section.html!text';
import {getPolygon, getLayout} from '../lib/util';
import addSectionList from '../controller/sectionList';

const radiusLoc = 64;

export default function(el, data, sec) {
    
    var secEl = el.querySelector('.js-' + sec);
    secEl.innerHTML = secHTML;
    secEl.querySelector(".js-num").textContent = data.length;
    
    var typeEls = Array.prototype.slice.call(secEl.querySelectorAll(".js-type"));
    typeEls.forEach( d => d.textContent = data[0].type);
   
    var p = getLayout(),//getPolygon(data.length),
        r = radiusLoc;
    data = data.map((d, i) => {
        d.size = r;
        d.top  = "calc(" + p[i].y + "% - " + r/2 + "px)";
        d.left = "calc(" + p[i].x + "% - " + r/2 + "px)";
        return d;
    });
    //console.log(data);

    addSectionList(d3.select(".js-"+sec), data);
}
