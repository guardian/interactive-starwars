/* state control on scroll event 
 * for prev/next navigations */

const states = {
    cha: { next: { txt: "Next: the locations", dst: "loc" }},
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

    // test state        
    if      (y <= yCha)             { curState = "cha"; }
    else if (y > yCha && y < yLoc) { curState = "non"; }
    else if (y >= yLoc)             { curState = "loc"; }
    else { curState = "non"; console.log("test: a new state is needed!!!"); }
    
}

function updateState() {
    var prev = document.querySelector(".js-prev"),
        next = document.querySelector(".js-next"),
        prevTxt = prev.querySelector("span"),
        nextTxt = next.querySelector("span");
   
    prev.classList.add("d-n");
    next.classList.add("d-n");
    
    switch (curState) {
        case "cha": 
            nextTxt.textContent = states.cha.next.txt;
            next.dataset.nav = states.cha.next.dst;
            next.classList.remove("d-n");
        break;            
        case "loc": 
            prevTxt.textContent = states.loc.prev.txt;
            prev.classList.remove("d-n");
            prev.dataset.nav = states.loc.prev.dst;
            console.log(prev.dataset.nav);
        break;            
    }
    
    preState = curState;
}
