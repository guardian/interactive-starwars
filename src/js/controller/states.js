/* state control on scroll event 
 * for prev/next navigations */

const states = {
    cha: { next: { txt: "Next: the locations", dst: "loc" }},
    chaSelect: { next: { txt: "Next: the locations", dst: "loc" },
                 prev: { txt: "Previous: the characters", dst:"cha" }},
    loc: { prev: { txt: "Previous: the characters", dst:"cha" }}
};

var curState = "cha", preState = "cha";

;(function() {
    window.addEventListener("optimizedScroll", function() {
        testState();
        if (curState === preState) return;
        updateState();
    });  
})();

function testState(){
    var y = window.scrollY,
        yCha = document.querySelector(".js-cha").offsetTop,
        yLoc = document.querySelector(".js-loc").offsetTop;
    var select = document.querySelector(".js-cha-select"),
        yCSStr = select.offsetTop - 30,
        yCSEnd = select.offsetTop + 30;//+ select.offsetHeight;
    //console.log(y, yCSStr, yCSEnd);
    
    // test state        
    if      (y <= yCha) { curState = "cha"; }
    else if (y >= yLoc) { curState = "loc"; }
    else if (y >= yCSStr && y <= yCSEnd) { curState = "chaSelect"; }
    else { curState = "non"; console.log("test: a new state is needed!!!"); }
    
}

function updateState() {
    var prev = document.querySelector(".js-prev"),
        next = document.querySelector(".js-next"),
        select = document.querySelector(".js-cha-select"),
        prevTxt = prev.querySelector("span"),
        nextTxt = next.querySelector("span");
   
    prev.classList.add("d-n");
    next.classList.add("d-n");
    
    switch (curState) {
        case "cha": 
            showNav(next, nextTxt, curState, "next");
            select.classList.add("d-n");
            break;
        case "chaSelect":
            if (select.classList.contains("d-n")) return;
            showNav(prev, prevTxt, curState, "prev");
            showNav(next, nextTxt, curState, "next");
            break; 
        case "loc": 
            showNav(prev, prevTxt, curState, "prev");
            select.classList.add("d-n");
            break;            
    }
    
    preState = curState;
}

function showNav(navEl, txtEl, key, direction) {
    txtEl.textContent = states[key][direction].txt;
    navEl.dataset.nav = states[key][direction].dst;
    navEl.classList.remove("d-n");
}
