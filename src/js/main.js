import iframeMessenger from 'guardian/iframe-messenger';
import d3 from './lib/d3.lite.min';
import share from './lib/share';
import classList from './lib/classList';
import {addCapToString, getDataById, getWindowSize, testMobile, isMobile, testApp, isApp} from './lib/utils';
import mainHTML from './view/main.html!text';
import {loadNavigation, addNavigationOnScroll} from './controller/navigation';
import {initSection, loadSection} from './controller/section';
import initSectionItemSelected from './controller/sectionItemSelected';

export function init(el, context, config, mediator) {
    iframeMessenger.enableAutoResize(); 
    testMobile();
    testApp();

    // load main page 
    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);
    var mainEl = el.querySelector(".js-main");
    if (!isMobile()) { mainEl.classList.add("l-stars", "a-stars"); }
    else { mainEl.classList.add("l-stars-lite"); }

    // load json data 
    var key = "1KfSbVnGHzwAkfzZ2pebC6yhVjV88xsWnXubCAu9bIt4",
        url = "http://interactive.guim.co.uk/docsdata-test/" + key + ".json";
    
    d3.json(url, (err, json) => {
        
        if (err) return console.warn(err);
        
        var meta = json.sheets.furniture,
            data = json.sheets.data,
            link = json.sheets.related_links,
            secs = ["cha", "org", "tec"];
        
        // furniture
        var header = meta.splice(0, 1)[0],
            headerNav = meta.filter(m => ("cha org tec").indexOf(m.id)>-1);
        el.querySelector(".js-headline").textContent = header.title;
        el.querySelector(".js-standfirst").textContent = header.description;
        loadNavigation(headerNav); 
        
        // sections
        var size = getWindowSize(),
            id2title = {};
        meta.forEach(m => id2title[m.id] = m);
        initSection(id2title, size);
        secs.forEach(s => { 
            // NOTE: hotfix due to last day
            var dataSec = getDataById(data, s);
            if (s === "org") { dataSec = dataSec.concat(getDataById(data, "oth")); }
            loadSection(el, dataSec, s, config.assetPath);
        });
        initSectionItemSelected(data, size, config.assetPath);
        
        // navigation and related new links    
        addNavigationOnScroll(el);
        el.querySelector("nav").classList.remove("d-n");
        
        addRelatedNewsLinks(link);       
    });


    // switch modes
    var modeEl = document.querySelector(".js-theatre"),
        bodyCl = document.querySelector("body").classList;
    
    modeEl.addEventListener("click", () => {
        bodyCl.toggle("o-3_4");
        modeEl.textContent = bodyCl.contains("o-3_4") ? "Exit Theatre Mode?":"Switch to Theatre Mode";
    });


    // share buttons
    var g = guardian.config.page,
        gHeadline = g.headline,
        gUrl = g.shortUrl,
        tPic = "waiting for pic"; // TODO: add tPic  
    var shareFn = share(g.headline, gUrl+" "+tPic, '#Interactive');
    [].slice.apply(el.querySelectorAll('.btn-share')).forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click',() => shareFn(network));
    });


    // preload transit bg image
    var preloadEl, testEl;
    preloadEl = document.querySelector(".js-transit-preload");
    preloadEl.classList.add("a-transit");
}

function addRelatedNewsLinks(data){
    d3.select(".js-link")
    .selectAll("li")
    .data(data).enter()
    .append("li")
    .append("div")
    .append("a")
    .attr("href", d => d.url)
    .append("p")
    .attr("class", "f-link")
    .text(d => d.headline); 
}
