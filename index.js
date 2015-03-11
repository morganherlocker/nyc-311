var JSONStream = require('JSONStream');
var fs = require('fs');
var turf = require('turf');

var rs = fs.createReadStream('./311.json');
var js = JSONStream.parse('.data.*');
pace = require('pace')(8875664);

// pipe data from the 311.json file so memory usage is kept low
rs.pipe(js);

// create 1/2 mi grid over nyc
var bbox = [ -74.404,40.484,-73.443,40.977 ];
var grid = turf.squareGrid(bbox, 0.5, 'miles');

grid.features.forEach(function(cell) {
    // precompute bboxes
    cell.bbox = turf.extent(cell);
    cell.properties.total = 0;
});

var categories = {};
var months = {};
js.on('data', function (obj) {    
    pace.op();
    // check for valid lat, lons
    if(parseFloat(obj[57]) > -180 && parseFloat(obj[58]) > -180) {
        var pt = turf.point([parseFloat(obj[58]), parseFloat(obj[57])]);
        for(var i = 0; i < grid.features.length; i++) {
            if(pt.geometry.coordinates[0] >= grid.features[i].bbox[0] &&
               pt.geometry.coordinates[0] <= grid.features[i].bbox[2] &&
               pt.geometry.coordinates[1] >= grid.features[i].bbox[1] &&
               pt.geometry.coordinates[1] <= grid.features[i].bbox[3] &&
               turf.inside(pt, grid.features[i])) {
                var dateParts = obj[9].split('-');
                if(dateParts[0] >= 2010) {
                    var month = dateParts[0]+'/'+dateParts[1];
                    months[month] = true;
                    if(!grid.features[i].properties[month]) grid.features[i].properties[month] = 0;
                    grid.features[i].properties[month]++;
                    grid.features[i].properties.total++;
                }
                break;
            }
        }
    }
});

js.on('end', function() {
    months = Object.keys(months);
    // remove cells with no calls across all months
    grid.features = grid.features.filter(function(cell) {
        if(cell.properties.total > 0) return true;
    });
    // populate undefined months with a 0 value
    grid.features.forEach(function(cell) {
        delete cell.bbox;
        months.forEach(function(month) {
            if(!cell.properties[month]) cell.properties[month] = 0;
        });
    });
    fs.writeFileSync('grid.geojson', JSON.stringify(grid));
    console.log('complete');
});

