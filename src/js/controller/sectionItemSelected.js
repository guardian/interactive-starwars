import Hammer from '../lib/hammer.min';
import itemHTML from '../view/sectionItemSelected.html!text';
import {isMobile} from '../lib/utils';
import svgs from '../../assets/svgfull.json!json';

const bg ={
    dark:    ["rgba(255, 91, 58, 0.5)", "rgba(78, 3,117, 0.25)"],
    light:   ["rgba( 94,191,186, 0.5)", "rgba( 0,44, 89, 0.25)"],
    unknown: ["rgba(189,189,189, 0.5)", "rgba(51,51, 51, 0.25)"]
};

var pageEl, mainEl, transitEl, listEls, modalEl_qs, modalEl_d3, data;
export default function(d) {
    pageEl = document.body;
    mainEl = document.querySelector(".js-main");
    transitEl = document.querySelector(".js-transit");
    modalEl_qs = document.querySelector(".js-modal"); //TODO: remove duplicates
    modalEl_d3 = d3.select(".js-modal").html(itemHTML);
    data = d;
}

export function addItemSelected(sectionEl, d) {
    // record scrollTop position
    var pageY = pageEl.scrollTop;       
    // display transition effects
    if (isMobile()) {
        transitEl.classList.add("a-transit");//-"+d.side);
        transitEl.style.top = pageY + "px";
    } else {
        mainEl.classList.add("a-hyperspace");
    }
    listEls = sectionEl.selectAll(".js-list div")
          .classed("a-zoom-out",item => item.id!==d.id ? true:false)
          .classed("a-zoom-in", item => item.id===d.id ? true:false);
    
    /* modal */
    // open: 
    // 1. show item bio modal page
    // 2. lock scroll event in main page
    // 3. remove transition effects
    window.setTimeout(() => {
        addItemBio(d);                                              //1
        mainEl.classList.add("l-lock");                             //2
        if (isMobile()) { transitEl.classList.remove("a-transit");} //3
        else { mainEl.classList.remove("a-hyperspace"); }
        listEls.classed("a-zoom-in", false)
               .classed("a-zoom-out", false);
    }, 500);
    
    // close:
    // 1. in main page, unlock scroll and bring back the scrollTop position
    // 2. hide modal page
    modalEl_d3.select(".js-close")
    .on("click", () => {
        mainEl.classList.remove("l-lock");  //1
        pageEl.scrollTop = pageY;
        modalEl_d3.classed("d-n", true);    //2
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
     
    // remove/add item related list (if exists)
    var relsEl = modalEl_d3.select(".js-rels"); 
    relsEl.selectAll("li").remove();
    
    var dataRel = getItemRelatedList(d.related_to, d.relationship);
    if (dataRel.length === 0) { 
        relsEl.classed("d-n", true); 
    }
    else { 
        relsEl.classed("d-n", false); 
        addItemRelatedList(relsEl, dataRel);
    }

    // add item image (optional)
    addItemImage(modalEl_qs.querySelector(".js-pic"), d); 
}

function addItemImage(el, d) {
    el.src = d.imgsrc;
    el.onerror = () => { el.classList.add("d-n");};
    el.onload = () => { el.classList.remove("d-n"); }; 
}

function getItemRelatedList(names, rels) {
    names = names.split(",");
    names = names.map(n => n.trim());
    rels = rels.split(",");
    rels = rels.map(r => r.trim());
    
    return names[0]==="" ? []:names.map((name, i) => {
        var obj = data.filter(d => d.name === name)[0];
        obj.relation = rels[i];
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
          '<p class="fs-textSans1 c-g4">' + d.relation + '</p>'
    );
}

function addHammerEvents(d) {
    var mc = Hammer(modalEl_qs.querySelector("#rel-"+d.id));
    mc.on("tap", e => {
        addItemBio(d);
    });
}
