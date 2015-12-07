import secHTML from '../view/section.html!text';
import {getLayout, getWindowSize} from '../lib/utils';
import addSectionList from '../controller/sectionList';

const maxItems = 21;

const marginTop = {
    cha:  24, tec: -36,
    loc: -60, org: -60, oth: -60
};

var metaData,
    maxRadius, difRadius;

export function initSection(meta) {
    var size = getWindowSize();
    maxRadius = size.width<480 ? 72:100;
    difRadius = size.width<480 ? 12:20;
    
    metaData = meta;    
}

export function loadSection(el, data, sec, assetPath) {
     
    // load general section data
    var secEl, typeEls;
    
    secEl = el.querySelector('.js-' + sec);
    secEl.innerHTML = secHTML;
    secEl.querySelector(".js-type").textContent = metaData[sec].type;
    secEl.querySelector(".js-title").textContent = metaData[sec].title;
    secEl.querySelector(".js-detail").textContent = metaData[sec].description;

    // remap items in section data
    var p = getLayout(),
        r = maxRadius;
    
    data.sort((a, b) => {
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
        d.imgsrc = assetPath + "/assets/imgs/jpegs/" + d.id + ".jpeg";         

        //d.image = "url('" + assetPath + "/assets/imgs/jpegs/" + d.id + ".jpeg')";         
        return d;
    });

    // add items to the section
    addSectionList(d3.select(".js-"+sec), data, marginTop[sec]);
}


