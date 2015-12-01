import itemHTML from '../view/sectionItemSelected.html!text';
import {isMobile} from '../lib/util';

var pageEl, mainEl, starsEl, listEls, modalEl, data;
export default function(d) {
    pageEl = document.body;
    mainEl = document.querySelector(".js-main");
    starsEl = d3.select(".a-stars");
    modalEl = d3.select(".js-modal").html(itemHTML);
    data = d;
}

export function addItemSelected(sectionEl, d) {
    // display transition effects
    starsEl.classed("a-hyperspace", true);
    listEls = sectionEl.selectAll(".js-list div")
              .classed("a-zoom-out",item => item.id!==d.id ? true:false)
              .classed("a-zoom-in", item => item.id===d.id ? true:false);
    
    /* modal */
    // open: 
    // 1. show item bio modal page
    // 2. record scrollTop of main page and lock scroll event
    // 3. remove transition effects
    var pageY;
    window.setTimeout(() => {
        addItemBio(d);
        pageY = pageEl.scrollTop;       
        mainEl.classList.add("l-lock");
        starsEl.classed("a-hyperspace", false);
        listEls.classed("a-zoom-in", false)
               .classed("a-zoom-out", false);
    }, 500);
    
    // close
    // 1. unlock scroll event of the main page
    // 2. hide item bio modal page
    modalEl.select(".js-close")
    .on("click", () => {
        mainEl.classList.remove("l-lock");
        pageEl.scrollTop = pageY;
        modalEl.classed("d-n", true);
    });
}

function addItemBio(d) {
    // add item bio
    modalEl.classed("d-n", false);
    modalEl.select(".js-name").text(d.name);
    modalEl.select(".js-desc").text(d.bio);
    modalEl.select(".js-know").text(d.known_info);
    modalEl.select(".js-img").style("background-image", d.imgSelect);
    
    // remove/add item related list (if exists)
    modalEl.selectAll(".js-rels li").remove();
    
    var dataRel = getItemRelatedList(d.related_to);
    if (dataRel.length === 0) return;
    addItemRelatedList(dataRel);
}

function getItemRelatedList(rels) {
    var dataRel = data.filter(d => rels.indexOf(d.name) !== -1);
    // TODO: map relationship
    //console.log(rels, list);
    return dataRel;
}

function addItemRelatedList(dataRel) {
    var relEls = d3.select(".js-rels")
    .selectAll("li")
    .data(dataRel).enter()
    .append("li")
    .on("touchstart", d => addItemBio(d))
    .on("click", d => {if (isMobile()) return; addItemBio(d);});
    
    relEls
    .append("div")
    .attr("class", "l-rels-img")
    .style("background-image", d => d.imgSelect);
    
    relEls
    .append("div")
    .attr("class", "l-rels-txt")
    .html(d => '<span class="fs-textSans4">' + d.name + '</span><br>' + 
          '<span class="fs-textSans1">' + d.relation + '</span>'
    );
}
