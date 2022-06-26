const fs = require('fs');
const patternIP = /^((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))(\.((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))){3}/g;   //regExp of IP address
const patternReq = /GET|PUT|POST/;    //request type could be added as required, here is just an example.
module.exports = function parseLog(fileName, option){

    let output = {};
    let details = [];

    //get input string from log file.
    const input = fs.readFileSync(fileName,'utf-8');
 
    //separate log into lines.
    let lines = input.split('\n').filter(x=>x); 
   
    //make a list of all IP in the log.
    let allIPList = lines.reduce((total,line)=>{return total.concat(line.match(patternIP)).filter(x=>x)},[]); 

    //find unique IP from IP list.
    let uniqIPList = Array.from(new Set(allIPList));
    output.NumOfUniqIP = uniqIPList.length;
    
    //calculate top 3 active IP
    output.Top3ActIPs = getTop3(allIPList,option,details);
    
    //calculate top 3 visited URL
    output.Top3VisitURL = getTop3(getAllUrlList(lines), option,details);

    return {output,details};
}


/**
 * get all URL from log.
 * @param {*} lines 
 * @returns 
 */
function getAllUrlList(lines){
    let allUrlList = [];
    lines.map(line=> {
        let reqMethod = (line.match(patternReq)||[])[0];  //reqMethod: GET/PUT/PUST/...
        let reqIndex = !!reqMethod? line.indexOf(reqMethod):-1;
        if(!reqMethod || (reqIndex == -1)){
            console.log('There is no request method in this line!');
            return '';
        }

        //In log, url follows request method and a blank.
        let subStr = line.slice(reqIndex+reqMethod.length).trim();
        let urlEndIndex = subStr.indexOf(' ');
        let urlStr = subStr.slice(0,urlEndIndex);
        return allUrlList.push(urlStr);
    })
    return allUrlList.filter(x=>x);
}

/**
 * calculate top 3 most visited URL
 * @param  lines: lines of logs 
 * @param  option :If you want only 3 output, then choose 'S' (simple) option,
 *                  If you want top 3 output including tied ones, please use 'A' option.
 * @returns top3 visited URL
 */
 function getTop3(itemList,option = 'simple', details){
    
    //make a list of unique items
    let uniqList = Array.from(new Set(itemList));
    let uniqInfo = [];
    uniqList.forEach(cur => uniqInfo.push({item: cur, frequency: itemList.filter(x=> (x===cur)).length}));
    let top3List = [];

    //list item in descending order by frequency (active level)
    uniqInfo.sort((a,b)=> {return b.frequency-a.frequency});  
    //console.log('detailInfo: ',uniqInfo);
    if(uniqInfo.length>3){
        top3List = uniqInfo.slice(0,3).map(info=>info.item);

        //If there are tied ones( some items have the same frequency), number of top 3 itmes is more than 3
        if(option === 'precise'){
            let curPosition = 3;
            while((curPosition < uniqInfo.length) && (uniqInfo[curPosition].frequency == uniqInfo[2].frequency)){
                top3List.push(uniqInfo[curPosition].item);
                curPosition++;
        }}
    }
    else{
        top3List = uniqInfo.map(info=>info.item);
    }
    details.push(uniqInfo);
    return top3List;
}