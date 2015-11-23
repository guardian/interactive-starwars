import iframeMessenger from 'guardian/iframe-messenger';
import d3 from './lib/d3.lite.min';
import share from './lib/share';
import classList from './lib/classList';
import throttle from './lib/throttle';
import {getDataById, testMobile, isMobile} from './lib/util';
import mainHTML from './view/main.html!text';
import addCharacters from './controller/characters';
import addSection from './controller/section';
import stateOnScroll from './controller/states';
import navigationOnScroll from './controller/navigation';

var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

export function init(el, context, config, mediator) {
    iframeMessenger.enableAutoResize(); 
    testMobile();
    
    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);
    if (!isMobile()) { el.querySelector(".l-stars").classList.add("a-stars");}

    // load json data 
    var key = "1KfSbVnGHzwAkfzZ2pebC6yhVjV88xsWnXubCAu9bIt4",
        url = "http://interactive.guim.co.uk/docsdata-test/" + key + ".json";
    
    d3.json(url, (err, json) => {
        
        if (err) return console.warn(err);
        var data = json.sheets.data_dev,
            dataRef = json.sheets.relations_dev,
            dataCha = getDataById(data, "cha"),
            dataLoc = getDataById(data, "loc"),
            dataOrg = getDataById(data, "org"),
            dataTec = getDataById(data, "tec"),
            dataOth = getDataById(data, "oth");
        
        addCharacters(el, dataCha, dataRef, config.assetPath);
        addSection(el, dataLoc, "loc");
        addSection(el, dataOrg, "org");
        addSection(el, dataTec, "tec");
        addSection(el, dataOth, "oth");
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
    [].slice.apply(el.querySelectorAll('.interactive-share')).forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click',() => shareFn(network));
    });
}
