export function getDataById(data, key) {
    return data.filter(d => d.id.indexOf(key) !== -1);
}

export function getRandom(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

export function getPolygon(n) {
    var pts = [],
        x = 100, y = 100, 
        r = 100, s = r*2;
    for (var i=0; i<n; i++) {
        var ptX = Math.round((x + r * Math.sin(0.5 + 2*Math.PI*i/n)) * 100 / s),
            ptY = Math.round((y + r * Math.cos(0.5 + 2*Math.PI*i/n)) * 100 / s);
        pts.push({x: ptX, y: ptY});
    }
    console.log(pts);
    return pts;
}

// NOTE: temp clac
export function getLayout() {
    return [
        {x:50, y:50}, //0
        
        {x:38, y:33}, //1
        {x:38, y:67},
        {x:62, y:33},
        {x:62, y:67},
        {x:27, y:50},
        {x:73, y:50},

        {x:50, y:17}, //7
        {x:50, y:83},
        {x:15, y:36},
        {x:15, y:64},
        {x:85, y:36},
        {x:85, y:64},       
        
        {x:78, y:20}, //13
        {x:78, y:80},
        {x:22, y:20},
        {x:22, y:80},
    
        {x:34, y:7}, //17
        {x:34, y:93},
        {x:66, y:7},
        {x:66, y:93}
    ];
}

var flagMobile;
export function testMobile() {
    flagMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}
export function isMobile() {
    return flagMobile;
}
