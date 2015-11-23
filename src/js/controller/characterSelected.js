import scrollAnimate from '../lib/scrollAnimate';
import charSelectedHTML from '../view/sectionItemSelected.html!text';

var data = {};

export default function(d, dataCha, dataRef) {
    data.cha = dataCha;
    data.ref = dataRef;

    
    var selectEl = document.querySelector(".js-cha-select");
    selectEl.innerHTML = charSelectedHTML;

    //selectEl.classList.remove("a-h-full");
    selectEl.classList.add("d-n");
    var star = d3.select(".a-stars"),
        list = d3.selectAll(".js-cha-list div");
   
    // get relation list 
    var dataChaRef = getRelationList(d, dataCha, dataRef);
    star.classed("a-fall", true);
    //list.classed("a-zoom-out",  item => item.id!==d.id ? true:false)
    list.classed("a-cha",  item => item.id!==d.id ? true:false)
        .classed("a-zoom-in", item => item.id===d.id ? true:false);
    // select all related chars
    // zoom out rest of the chars with speed effect
    
    // scroll down
    // related chars fall on the char-selected section
    window.setTimeout(() => {
        star.classed("a-fall", false);
        selectEl.classList.remove("d-n");
        //selectEl.classList.add("a-h-full");
        scrollAnimate(
            window.scrollY,
            selectEl.offsetTop,
            100
        );
        list.classed("a-zoom-in", false);
        //list.classed("a-zoom-out", true);
    }, 800);

    addCharSelected(selectEl, d, dataChaRef);
}

function getRelationList(d) {
    var ids, rels,
        refs = data.ref.filter(r => r.src_id === d.id);     
    if (refs.length!==0) {
        ids = refs[0].dst_ids; 
        rels = refs[0].dst_relations.split(",");
        rels = rels.map(d => d.trim()); 
    } else {
        // TODO: remove this temp list
        ids = "cha-02, cha-05, cha-09";
        rels = ["unknown1", "unknown2", "unknown3"];
    }
    refs = data.cha.filter(d => ids.indexOf(d.id) !== -1);
    refs = refs.map((d, i) => { d.relation = rels[i]; return d; });
    return refs;
}

function addCharSelected(el, d, dataChaRef) {
    // display char data
    var info = d.known_info!=="" ? d.known_info : "I'm not sure what we know for the moment, but we'll keep you up-to-date. Please stay tune and don't forget to reserve your tickes. Enjoy ..."; 
    el.querySelector(".js-cha-name").textContent = d.name;
    el.querySelector(".js-cha-desc").textContent = d.bio;
    el.querySelector(".js-cha-know").textContent = info;
    el.querySelector(".js-cha-img").style.backgroundImage = d.imgSelect;
   
    
    // display char relation 
    d3.selectAll(".js-rels li").remove();
    
    var relEls = d3.select(".js-rels")
    .selectAll("li")
    .data(dataChaRef).enter()
    .append("li")
    .on("click", d => addCharSelected(el, d, getRelationList(d)));
    
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
