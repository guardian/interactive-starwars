export function getDataById(data, key) {
    return data.filter(d => d.id.indexOf(key) !== -1);
}

export function getRandom(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

export function getHexagon(width, height, imgSize) {
    var h = (Math.sqrt(3)/2),
        r = ((width < height) ? width/2 : height/2) - imgSize/2,
        shift = 4/5,
        x = r*h,
        y = r - imgSize/2,
        hexagonPos = [
        {x: x,       y: y - r*shift},
        {x: x + r*h, y: y - r/2},
        {x: x + r*h, y: y + r/2},
        {x: x,       y: y + r*shift},
        {x: x - r*h, y: y + r/2},
        {x: x - r*h, y: y - r/2}
    ];
    return {
        center: {x:x, y:y},
        height: r*shift*2,
        vertices: hexagonPos
    };
}

// NOTE: temp clac
export function getLayout() {
    return [
        {x:50, y:50},
        
        {x:35, y:33},
        {x:35, y:67},
        {x:65, y:33},
        {x:65, y:67},
        {x:25, y:50},
        {x:75, y:50},

        {x:50, y:15},
        {x:50, y:85},
        {x:15, y:20},
        {x:15, y:80},
        {x:80, y:20},
        {x:80, y:80},
        
        {x:10, y:37},
        {x:10, y:63},
        {x:90, y:37},
        {x:90, y:63}
    ];
}
