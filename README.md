# simpleLogParser
parse http request log, and return brief report

## Usage/API

parseLog(fileName, option) is to parse a given log file containing HTTP requests and to report on its contents.

Input:

  -fileName: a given log file to be parsed.
  
  -option: There are two choices, default is 'simple'.
  
    'simple': just 3 itmes for top 3, discarding tied ones.    
    'precise': including tied ones, if some itmes are of the same level, number of selected items may be greater than 3;

Return:

  -output: 
  
    NumOfUniqIP: The number of unique IP addresses,
    Top3ActIPs: The top 3 most visited URLs,
    Top3VisitURL: The top 3 most active IP addresses
    
  -details: detailed information for user's reference if needed.

## Assumptions

Assume node installed


## Example

const report = parseLog(path.resolve(__dirname,'data.log')).output;  
const details = parseLog(path.resolve(__dirname,'data.log')).details;  
const ret = parseLog(path.resolve(__dirname,'data.log'));    
const ret = parseLog(path.resolve(__dirname,'data.log'),'simple);  
const ret = parseLog(path.resolve(__dirname,'data.log'),'precise');


## TEST
node test


