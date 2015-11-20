import iframeMessenger from 'guardian/iframe-messenger';
import d3 from './lib/d3.min';
import share from './lib/share';
import classList from './lib/classList';
import throttle from './lib/throttle';
import {getDataById} from './lib/util';
import mainHTML from './view/main.html!text';
import charHTML from './view/characters.html!text';
import stateOnScroll from './controller/states';
import navigationOnScroll from './controller/navigation';
import addCharacters from './controller/characters';
import addLocations from './controller/locations';

var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

export function init(el, context, config, mediator) {
    iframeMessenger.enableAutoResize();

    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    // load json data 
    var key = "1KfSbVnGHzwAkfzZ2pebC6yhVjV88xsWnXubCAu9bIt4",
        url = "http://interactive.guim.co.uk/docsdata-test/" + key + ".json";
    
    d3.json(url, (err, json) => {
        if (err) return console.warn(err);
        var data = json.sheets.data,
            dataCha = getDataById(data, "cha"),
            dataLoc = getDataById(data, "loc");
        
        el.querySelector('.js-cha').innerHTML = charHTML;
        addCharacters(el, dataCha);
        addLocations(el, dataLoc);
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
