const parseLog = require('./parseLog');
const path = require('path');
const option = ['simple',    //simple：just 3 itmes for top 3, discarding tied ones.
                'precise'];  //precise: including tied ones, if some itmes have the same frequency, number of top 3 items may greater than 3;

option.map((x,idx)=> {
        const ret = parseLog(path.resolve(__dirname,'data.log'),x);
        console.log('-'.repeat(100));    
        console.log(`Output under option '${x}' is:\n`,ret.output);  //print logParse report
        console.log('-'.repeat(100));
        console.log('Details:\n',ret.details);  //print detailed information for reference,  could be omitted...
    }
);