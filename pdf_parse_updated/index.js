const fs = require('fs');
const pdf = require('pdf-parse');
let headings = require('./headers');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
  {id: 'Date', title: 'Date'},
  {id: 'HOSPITAL NO', title: 'HOSPITAL NO'},
  {id: 'Episode NO', title: 'Episode NO'},
  {id: 'Department', title: 'Department'},
  {id: 'Doctor', title: 'Doctor'},
  {id: 'Patient Name', title: 'Patient Name'},
  {id: 'Age', title: 'Age'},
  {id: 'Advice', title: 'Advice'},
  {id: 'DIAGNOSIS', title: 'DIAGNOSIS'},
  {id: 'Gender', title: 'Gender'},
  {id: 'HISTORY OF CURRENT ILLNESS', title: 'HISTORY OF CURRENT ILLNESS'},
  {id: 'PAST HISTORY', title: 'PAST HISTORY'},
  {id: 'COURSE OF TREATMENT IN HOSPITAL', title: 'COURSE OF TREATMENT IN HOSPITAL'},
  ]
});

const dataToCSV = [];

let totalPDFFIles = 0;

let filenames = fs.readdirSync("G:\\pdf_parse");
filenames.forEach(function(file, index){
    if(file.split(".")[1] == "pdf"){
        totalPDFFIles = totalPDFFIles + 1;
        let dataBuffer = fs.readFileSync(file);
        getpdfData(dataBuffer);
    }
})

async function getpdfData(dataBuffer){
    pdf(dataBuffer).then(function(data) {
        const result = data.text;   
        let json = {};
        headings.forEach(function(item, index) {
            item.value = getParsedValue(result, item.first, item.last, item.final);
            json[item.key] = item.value;
        })
        dataToCSV.push(json);
        console.log(json);
        if(dataToCSV.length == totalPDFFIles){
            csvWriter
            .writeRecords(dataToCSV)
            .then(()=> console.log('The CSV file was written successfully'));
        }
    });
}

function getParsedValue(result, first, last, final) {
	if(result.indexOf(first) == -1){
        return null;
    }
    else if((result.indexOf(first) != -1) && (result.indexOf(last) != -1)){
        return result.substring(result.indexOf(first)+first.length, result.indexOf(last)).replace("\n", "").replace(new RegExp("\n", 'g'), " ");
    }
    else if(final != null){
        let finalVal = final.map(function(val){
            if(result.indexOf(val) != -1) {
                return result.substring(result.indexOf(first)+first.length, result.indexOf(val)).replace("\n", "").replace(new RegExp("\n", 'g'), " ");
            }
        })
        let data = finalVal.filter(function( element ) {
            return element !== undefined;
        });
        return data[0];
    }
    else {
        return null;
    }
}