import itemHTML from '../view/sectionItemSelected.html!text';
import {isMobile} from '../lib/utils';
import svgs from '../../assets/svgfull.json!json';

var pageEl, mainEl, starsEl, listEls, modalEl, scrollEl, data;
export default function(d) {
    pageEl = document.body;
    mainEl = document.querySelector(".js-main");
    scrollEl = document.querySelector(".js-modal"); //TODO: remove duplicates
    modalEl = d3.select(".js-modal").html(itemHTML);
    data = d;
}

export function addItemSelected(sectionEl, d) {
    // display transition effects
    mainEl.classList.add("a-hyperspace");
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
        mainEl.classList.remove("a-hyperspace");
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
    scrollEl.scrollTop = 0;

    // add item bio
    modalEl.classed("d-n", false);
    modalEl.select(".js-name").text(d.name);
    modalEl.select(".js-desc").text(d.bio);
    modalEl.select(".js-know").text(d.known_info);
    modalEl.select(".js-img")
    .html(() => {var str = svgs[d.id]; return str? svgs[d.id]:"<svg></svg>";});
     
    // remove/add item related list (if exists)
    modalEl.selectAll(".js-rels li").remove();
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
    .on("touchstart", d => addItemBio(d))
    .on("click", d => {if (isMobile()) return; addItemBio(d);});
    
    relEls
    .append("div")
    .attr("class", "l-rels-img")
    .html(d => {var str = svgs[d.id]; return str? svgs[d.id]:"<svg></svg>";});
    
    relEls
    .append("div")
    .attr("class", "l-rels-txt")
    .html(d => '<span class="fs-textSans4">' + d.name + '</span><br>' + 
          '<span class="fs-textSans1">' + d.relation + '</span>'
    );
}
