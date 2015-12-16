import secHTML from '../view/section.html!text';
import {getLayout, getWindowSize} from '../lib/utils';
import {throttle} from '../lib/underscore.lite';
import addSectionList from '../controller/sectionList';

const maxItems = 21;

const marginTop = {
    cha:  24, tec: 0, org: 0
};

var metaData,
    maxRadius, difRadius,
    sizeWindow;

var isSmall;
function getCircleSize() {
    var isSmallStill;
    if (getWindowSize().width < 480) { isSmallStill = true; }
    else { isSmallStill = false; }
    
    if (isSmall === isSmallStill) return; 
    isSmall = isSmallStill;
    //console.log(isSmall);    
    
    return {
        maxR: isSmall? 72:100,
        difR: isSmall? 12:20
    };
}

export function initSection(meta, size) {
    var cs = getCircleSize();
    maxRadius = cs.maxR;
    difRadius = cs.difR;
    sizeWindow = size;

    metaData = meta;    
}
export function postSection() {
    window.addEventListener('resize', throttle(getCircleSize, 1000));
}

export function loadSection(el, data, sec, assetPath) {
     
    // load general section data
    var secEl, typeEls;
    
    secEl = el.querySelector('.js-' + sec);
    secEl.innerHTML = secHTML;
    secEl.style.minHeight = sizeWindow.height + "px";
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
        d.imgsrc = (!d.img) ? "":assetPath + "/assets/imgs/jpegs/" + d.id + ".jpg";         
        return d;
    });

    // add items to the section
    addSectionList(d3.select(".js-"+sec), data, marginTop[sec]);
    
    secEl.classList.remove("d-n");
}
