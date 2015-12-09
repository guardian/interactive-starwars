import Hammer from '../lib/hammer.min';
import itemHTML from '../view/sectionItemSelected.html!text';
import {isMobile} from '../lib/utils';
import svgs from '../../assets/svgfull.json!json';

const bg ={
    dark:    ["rgba(255, 91, 58, 0.5)", "rgba(78, 3,117, 0.25)"],
    light:   ["rgba( 94,191,186, 0.5)", "rgba( 0,44, 89, 0.25)"],
    unknown: ["rgba(189,189,189, 0.5)", "rgba(51,51, 51, 0.25)"]
};

var htmlEl, mainEl, transitEl, listEls, modalEl_qs, modalEl_d3, picEl, data;
export default function(d, size) {
    htmlEl = document.querySelector("html");
    mainEl = document.querySelector(".js-main");
    transitEl = document.querySelector(".js-transit");
    transitEl.style.left = 0;
    transitEl.style.height = (size.height + 200) + "px";    // NOTE: hotfix for ipad height calc

    modalEl_qs = document.querySelector(".js-modal");       // TODO: remove duplicates
    modalEl_d3 = d3.select(".js-modal").html(itemHTML);
    picEl = modalEl_qs.querySelector(".js-pic");
    modalEl_qs.style.minHeight = size.height + "px"; 
        
    data = d;
}

export function addItemSelected(sectionEl, d) {
    // display transition effects
    listEls = sectionEl.selectAll(".js-list div")
    .classed("a-zoom-out",item => item.id!==d.id ? true:false)
    .classed("a-zoom-in1", item => item.id===d.id ? true:false);
    
    if (isMobile()) {
        transitEl.classList.add("a-transit");
        transitEl.style.top = (htmlEl.scrollTop - 150) + "px";         
        // NOTE: hotfix for ipad height calc issue
        //listEls.classed("a-zoom-in2", item => item.id===d.id ? true:false);
    } else {
        mainEl.classList.add("a-hyperspace");
        //listEls.classed("a-zoom-in1", item => item.id===d.id ? true:false);
    }
    
    /* modal */
    // open: 
    // 1. show item bio modal page
    // 2. lock scroll event in main page
    // 3. remove transition effects
    window.setTimeout(() => {
        addItemBio(d);                              // 1
        htmlEl.style.overflowY = "hidden";          // 2 and fix IE scrollbar issue
        mainEl.classList.remove("a-hyperspace");    // 3
        transitEl.classList.remove("a-transit");
        listEls.classed("a-zoom-in1", false)
               .classed("a-zoom-in2", false)
               .classed("a-zoom-out", false);
    }, 500);
    
    // close:
    // 1. in main page, unlock scroll and bring back the scrollTop position
    // 2. hide modal page
    modalEl_d3.select(".js-close")
    .on("click", () => {
        transitEl.classList.remove("a-transit");    // NOTE: just in case
        htmlEl.style.overflowY = "scroll";          // 1 and fix IE scrollbar issue
        modalEl_d3.classed("d-n", true);            // 2
    });
}

function addItemBio(d) {
    modalEl_qs.scrollTop = 0;

    // add item bio
    modalEl_d3.classed("d-n", false)
    .style("background-image", "radial-gradient("+bg[d.side][0]+","+bg[d.side][1]+")");

    modalEl_d3.select(".js-name").text(d.name);
    modalEl_d3.select(".js-desc").text(d.bio);
    modalEl_d3.select(".js-know").text(d.known_info);
    modalEl_d3.select(".js-actor").text(d.actor? ("Played by: " + d.actor + "."):"");
    modalEl_d3.select(".js-img")
    .html(() => {var str = svgs[d.id]; return str? svgs[d.id]:"<svg></svg>";});
    picEl.classList.add("d-n");

    // remove/add item related list (if exists)
    var relsEl = modalEl_d3.select(".js-rels"); 
    relsEl.selectAll("li").remove();
    
    var dataRel = getItemRelatedList(d.related_to, d.relationship);
    if (dataRel) { 
        relsEl.classed("d-n", false); 
        addItemRelatedList(relsEl, dataRel);
    }
    else { 
        relsEl.classed("d-n", true); 
    }

    // add item image (optional)
    addItemImage(picEl, d); 
}

function addItemImage(el, d) {
    el.src = d.imgsrc;
    el.onload = () => { el.classList.remove("d-n"); }; 
    //el.onerror = () => { el.classList.add("d-n");};
}

function getItemRelatedList(names, relas) {
    var nameList = (names.split(",")).map(n => n.trim()),
        relaList = (relas.split(",")).map(r => r.trim());
    
    return names==="" ? undefined:nameList.map((name, i) => {
        var obj = data.filter(d => d.name === name)[0];
        obj.relation = relaList[i];
        return obj;
    });
}

function addItemRelatedList(el, dataRel) {
    var relEls = el.select("ul")
    .selectAll("li")
    .data(dataRel).enter()
    .append("li")
    .attr("id", d => "rel-"+d.id)
    //.on("touchstart", d => addItemBio(d))
    .on("click", d => {if (isMobile()) return; addItemBio(d);})
    .each(d => {if (!isMobile()) return; addHammerEvents(d);});
    
    relEls
    .append("div")
    .attr("class", "l-rels-img")
    .html(d => {var str = svgs[d.id]; return str? svgs[d.id]:"<svg></svg>";});
    
    relEls
    .append("div")
    .attr("class", "l-rels-txt")
    .html(d => '<h5>' + d.name + '</h5>' + 
          '<p class="f-rels-txt">' + d.relation + '</p>'
    );
}

function addHammerEvents(d) {
    var mc = Hammer(modalEl_qs.querySelector("#rel-"+d.id));
    mc.on("tap", e => {
        addItemBio(d);
    });
}
