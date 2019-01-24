var _ = require('lodash')
var fs = require('fs')
var Json2csvParser = require('json2csv').Parser

// Get the level associated with a specific MasterFormat code
function getLevel(code) {
	var l1 = /^\d{2} 00 00$/
	var l2 = /^\d{2} \d0 00$/
	var l3 = /^\d{2} \d{2} 00$/
	var l4 = /^\d{2} \d{2} \d{2}$/
	var l5 = /^\d{2} \d{2} \d{2}\.\d{1,2}$/

	if (l1.test(code)) { return 1 }
	else if (l2.test(code)) { return 2 }
	else if (l3.test(code)) { return 3 }
	else if (l4.test(code)) { return 4 }
	else if (l5.test(code)) { return 5 }
	else { return 0 }
}

var mfMap = require("../masterformat-2016-map.json")

var mfWithLevels = _.map(mfMap, function(value, key) {
	return {
		code: key,
		label: value,
		level: getLevel(key)
	}
})


// Write data to .csv and .json
var fields = ['code', 'label', 'level'];
var opts = { fields };

try {
    var parser = new Json2csvParser(opts);
    var csv = parser.parse(mfWithLevels);
    console.log(csv);

    fs.writeFile("./masterformat-2016-with-levels.csv", csv, function(err) {
        if(err) { return console.log(err); }
        console.log("masterformat-2016-with-levels.csv was saved!");
    });
} catch (err) {
	console.error(err);
}

fs.writeFile("./masterformat-2016-with-levels.json", JSON.stringify(mfWithLevels), function(err) {
    if(err) { return console.log(err); }
    console.log("masterformat-2016-with-levels.json was saved!");
});



