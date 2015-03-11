var JSONStream = require('JSONStream');
var fs = require('fs');
var turf = require('turf');

var rs = fs.createReadStream('../311.json');
var js = JSONStream.parse('.data.*');
pace = require('pace')(8875664);

// pipe data from the 311.json file so memory usage is kept low
rs.pipe(js);

var months = {};
var boroughs = {};
js.on('data', function (obj) {    
    pace.op();
    var dateParts = obj[9].split('-');
    if(dateParts[0] >= 2010) {
        var month = dateParts[0]+'/'+dateParts[1];
        months[month] = true;

        if(!boroughs[obj[31]]) boroughs[obj[31]] = {};
        if(!boroughs[obj[31]][month]) boroughs[obj[31]][month] = 1;
        else boroughs[obj[31]][month]++;
    }
});

js.on('end', function() {
    console.log(JSON.stringify(boroughs));
    console.log('complete');
});

