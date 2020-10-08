const fs = require('fs');
const pdf = require('pdf-parse');
let headings = require('./headers');


let filenames = fs.readdirSync("G:\\pdf_parse");
filenames.forEach(function(file){
    if(file.split(".")[1] == "pdf"){
        let dataBuffer = fs.readFileSync(file);
        getpdfData(dataBuffer);
    }
})

async function getpdfData(dataBuffer){
    pdf(dataBuffer).then(function(data) {
        const result = data.text;   
        headings.forEach(function(item, index) {
            item.value = getParsedValue(result, item.first, item.last);
            console.log(item);
        })
    });
}

function getParsedValue(result, first, last) {
    if((result.indexOf(first) != -1) && (result.indexOf(last) != -1)){
        return result.substring(result.indexOf(first)+first.length, result.indexOf(last)).replace("\n", "").replace(new RegExp("\n", 'g'), " ");
    }
    else {
        return null;
    }
}