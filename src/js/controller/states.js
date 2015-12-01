/* state control on scroll event 
 * for prev/next navigations */

const states = {
    cha: { next: { txt: "Next: the locations", dst: "loc" }},
    chaSelect: { next: { txt: "Next: the locations", dst: "loc" },
                 prev: { txt: "Previous: the characters", dst:"cha" }},
    loc: { prev: { txt: "Previous: the characters", dst:"cha" },
           next: { txt: "Next: the organisations", dst:"org"}},
    org: { prev: { txt: "Previous: the locations", dst:"loc" },
           next: { txt: "Next: the technologies", dst:"tec"}},
    tec: { prev: { txt: "Previous: the organisations", dst:"org" },
           next: { txt: "Next: the others", dst:"oth"}},
    oth: { prev: { txt: "Previous: the technologies", dst:"tec" }}
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
        yLoc = document.querySelector(".js-loc").offsetTop,
        yOrg = document.querySelector(".js-org").offsetTop,
        yTec = document.querySelector(".js-tec").offsetTop,
        yOth = document.querySelector(".js-oth").offsetTop;
    
    // test state        
    if      (y <= yCha) { curState = "cha"; }
    else if (y >= yOth) { curState = "oth"; }
    else if (y >= yTec) { curState = "tec"; }
    else if (y >= yOrg) { curState = "org"; }
    else if (y >= yLoc) { curState = "loc"; }
    else { curState = "non"; console.log("test: a new state is needed!!!"); }
}

function updateState() {
    //console.log(curState);
    var prev = document.querySelector(".js-prev"),
        next = document.querySelector(".js-next"),
        prevTxt = prev.querySelector("span"),
        nextTxt = next.querySelector("span");
   
    prev.classList.add("d-n");
    next.classList.add("d-n");
    
    switch (curState) {
        case "cha": 
            //showNav(next, nextTxt, curState, "next");
            //select.classList.remove("a-h-full");
            break;
        /*case "chaSelect":
            if (select.classList.contains("d-n")) return;
            showNav(prev, prevTxt, curState, "prev");
            //showNav(next, nextTxt, curState, "next");
            break;*/ 
        case "loc": 
            //showNav(prev, prevTxt, curState, "prev");
            //showNav(next, nextTxt, "cha", "next");
            //select.classList.remove("a-h-full");
            break;            
        /*case "cha": 
        case "loc": 
        case "org":
        case "tec":
        case "oth":
            showNav(prev, prevTxt, curState, "prev");
            //showNav(next, nextTxt, curState, "next");
            break;*/ 
    }
    
    preState = curState;
}

function showNav(navEl, txtEl, key, direction) {
    txtEl.textContent = states[key][direction].txt;
    navEl.dataset.nav = states[key][direction].dst;
    navEl.classList.remove("d-n");
}
