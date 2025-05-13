function doGet(e) {
  var ssid = e.parameters.ssid;
  var sheetName = e.parameters.name;
  var ss = SpreadsheetApp.openById(ssid);
  var sheet = ss.getSheetByName(sheetName);
  var chainName = e.parameters.chainName;
  var totalMiles = e.parameters.totalMiles;



  Logger.log('total miles ' + totalMiles)
  Logger.log('beginning updateChainMilage');

  updateChainMilage(totalMiles, chainName);

  Logger.log('adding new chain name')
  sheet.getRange(2, 7).setValue('NewChain - ' + chainName);

  // return HtmlService.createHtmlOutput('<h1>Sheet updated with new chain.</h1>');

  var params = JSON.stringify(e);
  return HtmlService.createHtmlOutput(params);
  // return HtmlService.createHtmlOutputFromFile('ExampleFile1');


};

function updateChainMilage(totalMiles, chainName) {
  Logger.log(totalMiles)
  SpreadsheetApp.flush();

  // find current chain
  var chainData = SpreadsheetApp.openById(SPREADSHEET).getSheetByName('Chains').getDataRange().getValues();

  Logger.log(chainData);

  chainData.forEach((chain, i) => chain.push(i + 1))

  Logger.log(chainData)

  var currentChainInfo = chainData.filter(chain => chain[3] == 'X')

  Logger.log('current chain')
  Logger.log(currentChainInfo);

  var currentChain = {
    name: currentChainInfo[0][0],
    milage: currentChainInfo[0][1],
    line: currentChainInfo[0][4],
  }

  Logger.log(currentChain)

  // add milage to current chain
  Logger.log('currentChain.milage')
  Logger.log(typeof(currentChain.milage))
  Logger.log('totalMiles')
  Logger.log(typeof(totalMiles))

  var milageCell = chainSheet.getRange(currentChain.line, 2).setValue(Number(currentChain.milage) + Number(totalMiles));

  // remove current chain marker
  var currentChainCell = chainSheet.getRange(currentChain.line, 4).clear();

  // add new current chain marker
  chainData.forEach(function(chain,i){ 
    if(chain[0] == chainName){
      chainSheet.getRange(i+1, 4).setValue("X");
    }

  })

}


function getCurrentChain() {

  var chainData = SpreadsheetApp.openById(SPREADSHEET).getSheetByName('Chains').getDataRange().getValues();

  Logger.log(chainData);

  chainData.forEach(function (chain, i) {

    if (chain[3] == 'X') {

      const currentChainInfo = {
        name: chain[0],
        line: i + 1,
        milage: chain[1]
      };
      Logger.log('currentChainInfo assigned!')
      Logger.log(currentChainInfo.name)
    }

  })
  Logger.log(currentChainInfo.name)
  return currentChainInfo;
}

// function updateChainMilageOld(totalMiles){
//   Logger.log(totalMiles)
//   SpreadsheetApp.flush();
//   // find current chain

//   var allData = recentActs.getDataRange().getValues();

//   var currentChainCell = '';

//   // find current chain name
//   allData.some(function(activity){
//     currentChainCell = activity[6];
//     var search = currentChainCell.search('NewChain');
//     return search == 0 
//     // return activity[6] == 'NewChain'
//   });

//   Logger.log(currentChainCell)

//   var splitChainCell = currentChainCell.split('-');
//   var currentChain = splitChainCell[1].trim();

//   Logger.log(currentChain)

//   var chainData = chainSheet.getDataRange().getValues();
//   var newMilage, oldMilage, milageCell;

//   chainData.some(function(chain, i){
//     if (chain[0] == currentChain){
//       milageCell = chainSheet.getRange(i+1,2)
//       oldMilage = milageCell.getValue();
//       newMilage = totalMiles + oldMilage;
//       milageCell.setValue(newMilage);
//     }
//     return chain[0] == currentChain;
//   });

// }











