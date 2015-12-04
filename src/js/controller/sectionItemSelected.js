import Hammer from '../lib/hammer.min';
import itemHTML from '../view/sectionItemSelected.html!text';
import {isMobile} from '../lib/utils';
import svgs from '../../assets/svgfull.json!json';

const bg ={
    //dark:    ["#4E0375", "#FF5B3A"],
    //light:   ["#002C59", "#5EBFBA"],
    //unknown: ["#333333", "#767676"]
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
    // display transition effects
    var pageY = pageEl.scrollTop;       
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
    // 2. record scrollTop of main page and lock scroll event
    // 3. remove transition effects
    window.setTimeout(() => {
        addItemBio(d);
        mainEl.classList.add("l-lock");
        if (isMobile()) { transitEl.classList.remove("a-transit");}//-"+d.side); }
        else { mainEl.classList.remove("a-hyperspace"); }
        listEls.classed("a-zoom-in", false)
               .classed("a-zoom-out", false);
    }, 500);
    
    // close
    // 1. unlock scroll event of the main page
    // 2. hide item bio modal page
    modalEl_d3.select(".js-close")
    .on("click", () => {
        mainEl.classList.remove("l-lock");
        pageEl.scrollTop = pageY;
        modalEl_d3.classed("d-n", true);
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
    modalEl_d3.select(".js-actor").text(d.actor? ("cast: " + d.actor):"");
    modalEl_d3.select(".js-img")
    .html(() => {var str = svgs[d.id]; return str? svgs[d.id]:"<svg></svg>";});
     
    // remove/add item related list (if exists)
    modalEl_d3.selectAll(".js-rels li").remove();
    var dataRel = getItemRelatedList(d.related_to, d.relationship);
    if (dataRel.length === 0) return;
    addItemRelatedList(dataRel);
}

function getItemRelatedList(names, rels) {
    rels = rels.split(",");
    rels = rels.map(r => r.trim());

    var dataRel = data.filter(d => names.indexOf(d.name) !== -1);
    dataRel = dataRel.map((d, i) => { d.relation = rels[i]; return d; });

    return dataRel;
}

function addItemRelatedList(dataRel) {
    var relEls = d3.select(".js-rels")
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
    .html(d => '<h4 class="fs-textSans4">' + d.name + '</h4>' + 
          '<p class="fs-textSans1 c-g4">' + d.relation + '</p>'
    );
}

function addHammerEvents(d) {
    var mc = Hammer(modalEl_qs.querySelector("#rel-"+d.id));
    mc.on("tap", e => {
        addItemBio(d);
    });
}
