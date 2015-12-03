import secHTML from '../view/section.html!text';
import {getLayout} from '../lib/utils';
import addSectionList from '../controller/sectionList';

const maxItems = 21;
const maxRadius = 76;
const difRadius = 12;
const marginTop = {
    cha:  -5, tec: -36,
    loc: -60, org: -60, oth: -60
};
const txtSections = {
    0: "",
    1: "Here are the <type> known to be appearing in the film"
};

export default function(el, data, sec, assetPath) {
     
    // load general section data
    var secEl, typeEls;
    
    secEl = el.querySelector('.js-' + sec);
    secEl.innerHTML = secHTML;
    secEl.querySelector(".js-num").textContent = data.length;
    
    typeEls = Array.prototype.slice.call(secEl.querySelectorAll(".js-type"));
    typeEls.forEach( d => d.textContent = data[0].type);


    // remap items in section data
    var p = getLayout(),
        r = maxRadius;
    
    data.sort((a, b) => {
        // random important >= all existance
        if (!a.importance) a.importance = 3; 
        if (!b.importance) b.importance = 3;

        if (a.importance > b.importance) { return 1; }
        if (a.importance < b.importance) { return -1;}
        // a must be equal to b
        return 0;
    });
    if (data.length > maxItems) { data = data.slice(0, maxItems); }

    data = data.map((d, i) => {
        d.size = maxRadius - (d.importance-1) * difRadius;
        d.top  = "calc(" + p[i].y + "% - " + d.size/2 + "px)";
        d.left = "calc(" + p[i].x + "% - " + d.size/2 + "px)";
        
        return d;
    });


    // add items to the section
    addSectionList(d3.select(".js-"+sec), data, marginTop[sec]);
}
