import iframeMessenger from 'guardian/iframe-messenger';
import d3 from './lib/d3.lite.min';
import share from './lib/share';
import classList from './lib/classList';
import throttle from './lib/throttle';
import {addCapToString, getDataById, testMobile, isMobile} from './lib/utils';
import mainHTML from './view/main.html!text';
import {initSection, loadSection} from './controller/section';
import addSectionItemSelected from './controller/sectionItemSelected';
import navigationOnScroll from './controller/navigation';

var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

export function init(el, context, config, mediator) {
    iframeMessenger.enableAutoResize(); 
    testMobile();
    
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
            secs = ["cha", "loc", "org", "tec", "oth"];
        
        // furniture
        var header = meta.splice(0, 1)[0],
            headerSecs = {};
        el.querySelector(".js-headline").textContent = header.title;
        el.querySelector(".js-standfirst").textContent = header.description;
        d3.select(".js-nav")
        .selectAll("li")
        .data(meta).enter()
        .append("li")
        .attr("data-nav", d => d.id)
        .attr("class", d => "btn-nav")
        .text(d => d.type);

        // sections
        meta.forEach(m => headerSecs[m.id] = m);
        initSection(headerSecs);
        secs.forEach(s => loadSection(el, getDataById(data, s), s, config.assetPath));
        addSectionItemSelected(data);
         
        navigationOnScroll(el);
    });


    // switch modes
    var modeEl = document.querySelector(".js-theatre"),
        bodyCl = document.querySelector("body").classList;
    
    modeEl.addEventListener("click", () => {
        bodyCl.toggle("o-3_4");
        modeEl.textContent = bodyCl.contains("o-3_4") ? "At home?":"In the theatre?";
    });


    // share buttons
    [].slice.apply(el.querySelectorAll('.btn-share')).forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click',() => shareFn(network));
    });

    // preload transit bg images
    var preloadEl = document.querySelector(".js-transit-preload");
    preloadEl.classList.add("a-transit");
}
