function chainTracker() {

  // clear old data so new data will be used
  SpreadsheetApp.flush();

  // get new copy of spreadsheet with updated data
  var allData = SpreadsheetApp.openById(SPREADSHEET).getSheetByName('RecentActivities').getDataRange().getValues();
  // Logger.log(allData)

  var totalMiles = 0;

  // // count all miles until NewChain found
  // allData.some(function (activity, i) {
  //   if (activity[2] == 'Ride') {
  //     totalMiles = totalMiles + activity[3];
  //   }
  //   var search = activity[6].search('NewChain');
  //   return search == 0
  //   // return activity[6] == 'NewChain'
  // });

  // count all miles until NewChain found
  allData.some(function (activity, i) {
    if (activity[2] == 'Ride' && activity[6].search('NewChain') !== 0) {
      totalMiles = totalMiles + activity[3];
    }
    var search = activity[6].search('NewChain');
    return search == 0
    // return activity[6] == 'NewChain'
  });
  recentActs.getRange(2, 6).setValue(totalMiles.toFixed(1));

  var chainMessage = ''
  if (totalMiles > 300) {
    chainMessage = 'Get Chain Ready'
  } else if (totalMiles > 200) {
    chainMessage = 'Get Chain Ready'
  }

  recentActs.getRange(2, 7).setValue(chainMessage)
  
   if (totalMiles > 200) {
    newChainEmail(totalMiles.toFixed(1));
  }
  

  Logger.log(totalMiles);
}


function newChainEmail(totalMiles) {

  var templ = HtmlService.createTemplateFromFile('chain_email');

  // check out my loop

  var currentChains = getChainData();
  // for (var i = 0; i < currentChains.lenth; i++) {
  //   console.log(currentChains[i][0])
  // }

  // currentChains.forEach(chain => console.log(chain[0]))



  templ.totalMiles = totalMiles;
  templ.currentChains = getChainData();

  var message = templ.evaluate().getContent();
  // Logger.log(message)

  GmailApp.sendEmail(
    'mrgregory1@gmail.com',
    'chain email',
    "",
    { htmlBody: message }
  )
};


function getChainData() {
  var chainData = SpreadsheetApp.openById(SPREADSHEET).getSheetByName('Chains').getDataRange().getValues();
  chainData.shift()
  // console.log(chainData)

  // var currentChains = chainData.filter(chain => chain[2] !== 'X')

  // return only non-retired and not-current chains
  var currentChains = chainData.filter(function(chain) { 
    if (chain[2] == 'X'){
      return false;
    }else if (chain[3] == 'X'){
      return false;
    }else
    return true;
  });
  Logger.log(currentChains)

  return currentChains

}














