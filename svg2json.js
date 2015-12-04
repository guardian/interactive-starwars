var fs = require('fs');

var src = './svgs/',
    dst = './src/assets/svg';

var data = "", 
    datafull = "";

fs.readdir(src, function(err,files){
    if (err) throw err;

    var c = 0;
    files.forEach(function(file){
        c++;
        fs.readFile(src+file, 'utf-8', function(err, svg){
            if (err) throw err;
            if (file.indexOf("svg") !== -1) { 
                var id = file.replace(".svg", "");
                
                /* clean data */
                // remove extra tag/info created by ila
                svg = svg.replace('<?xml version="1.0" encoding="utf-8"?>\r\n<!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r\n<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\r\n\t viewBox="0 0 128 128" enable-background="new 0 0 128 128" xml:space="preserve">', '<svg viewBox="0 0 128 128">');
                
                // remove line breaks (and extra spaces)
                svg = svg.replace(/\r?\n|\r|\t/g, ''); 
                svg = svg.replace(/\s{2,}/g, ' '); 
                
                // fix id ref issue due to file combination 
                svg = svg.replace(/SVGID/g, id.toUpperCase()); 
                
                if (id.indexOf("full") === -1) {
                    data = data + "'" + id + "':'"+ svg + "',";
                } else {
                    id = id.replace("-full", "");
                    datafull = datafull + "'" + id + "':'"+ svg + "',";
                }
            }
            if (0 === --c) { 
                saveFile("{"+data+"}", ""); 
                saveFile("{"+datafull+"}", "full"); 
            }
        });
    });
    //saveFile("{"+data+"}", ""); 
    //saveFile("{"+datafull+"}", "full"); 
});

function saveFile(data, tag) {
    fs.writeFile(dst+tag+".json", data, function(err) {
        if (err) throw err;
        console.log("file is saved at:", dst);
    });
}
