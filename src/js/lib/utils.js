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
        
        {x:36, y:32}, //1
        {x:36, y:68},
        {x:63, y:32},
        {x:63, y:68},
        {x:25, y:50},
        {x:75, y:50},

        {x:50, y:16}, //7
        {x:50, y:84},
        {x:11, y:36},
        {x:11, y:64},
        {x:89, y:36},
        {x:89, y:64},       
        
        {x:81, y:19}, //13
        {x:81, y:81},
        {x:19, y:19},
        {x:19, y:81},
    
        {x:33, y:6}, //17
        {x:33, y:93},
        {x:67, y:7},
        {x:67, y:93}
    ];
}

var flagMobile;
export function testMobile() {
    flagMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}
export function isMobile() {
    return flagMobile;
}

export function getWindowSize() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    return {
        width: x,
        height: y    
    };
}
