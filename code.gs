const SPREADSHEET = '1TiPkNlx5E4a4NVJeGTltIfrjyvUoZ2Co6QMb1GAYiPs';
const RECENT_ACTS = 'RecentActivities';

const chainSheet = SpreadsheetApp.openById(SPREADSHEET).getSheetByName('Chains') 
const recentActs = SpreadsheetApp.openById(SPREADSHEET).getSheetByName('RecentActivities');

// custom menu
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('Strava App')
    .addItem('Get data', 'updateStravaActivityData')
    .addToUi();
}

// get the last activity date as epoch time
function getLastEpoch(){
  var lastDate = recentActs.getRange(2,5).getValue();
  var epochMili = Date.parse(lastDate);

  // remove miliseconds
  var epoch = Math.floor(epochMili / 1000)

  return epoch
}


// Get athlete activity data
function updateStravaActivityData() {

  // get the sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('RecentActivities');

  var epoch = getLastEpoch();
  // Logger.log('epoch is:')
  // Logger.log(epoch)

  // call the Strava API to retrieve data
  var unsortedData = callStravaAPIUpdate(epoch);

  var data = unsortedData.sort(function(a, b){
    // return b[4] - a[4];
    return a[4] < b[4] ? 1: -1
  })

  // empty array to hold activity data
  var stravaData = [];

  // loop over activity data and add to stravaData array for Sheet
  data.forEach(function (activity) {
    var arr = [];
    arr.push(
      (activity.id).toFixed(),
      activity.name,
      activity.type,
      (activity.distance * 0.000621371).toFixed(1),
      activity.start_date
      // activity.start_date.substring(0, 10)
    );
    stravaData.push(arr);
  });

  Logger.log(stravaData);

  if(stravaData.length != 0){
    // insert rows for new data
    sheet.insertRows(2,stravaData.length)

    // paste the values into the Sheet
    sheet.getRange(2, 1, stravaData.length, stravaData[0].length).setValues(stravaData);

    // test for milage and new chain
    var isRide = false
    stravaData.forEach(function(activity){
      if(activity[2] == "Ride"){
        isRide = true
      }
    });

    if (isRide == true){
      chainTracker();
    }
    

  }else{
    Logger.log('No activities to update, get moving!')
  }
}





// call the Strava API
function callStravaAPIUpdate(epoch) {

  // set up the service
  var service = getStravaService();

  if (service.hasAccess()) {
    Logger.log('App has access.');

    var endpoint = 'https://www.strava.com/api/v3/athlete/activities';
    var params = '?after=' + epoch + '&per_page=200';
    // var params = '?after=1609687744&per_page=200';

    var headers = {
      Authorization: 'Bearer ' + service.getAccessToken()
    };

    var options = {
      headers: headers,
      method: 'GET',
      muteHttpExceptions: true
    };

    var response = JSON.parse(UrlFetchApp.fetch(endpoint + params, options));

    return response;
  }
  else {
    Logger.log("App has no access yet.");

    // open this url to gain authorization from github
    var authorizationUrl = service.getAuthorizationUrl();

    Logger.log("Open the following URL and re-run the script: %s",
      authorizationUrl);
  }
}

function returnNewData() {

  var oldData = [
    [4.562015501E9, '1st time to the jet', 'Walk', '5067.4, 2021-01-03T15:29:04Z'],
    [4.579188496E9, 'Evening Walk with the Kids', 'Walk', '3560.9, 2021-01-06T21:43:30Z'],
    [4.588120413E9, 'Beautiful walk in the cold sun', 'Walk', '3686.1, 2021-01-08T17:45:42Z'],
    [4.600041764E9, 'To the top baby', 'Walk', '3637.8, 2021-01-10T15:46:48Z'],
  ]

  var newData = [
    [4.562015501E9, '1st time to the jet', 'Walk', '5067.4, 2021-01-03T15:29:04Z'],
    [4.579188496E9, 'Evening Walk with the Kids', 'Walk', '3560.9, 2021-01-06T21:43:30Z'],
    [4.588120413E9, 'Beautiful walk in the cold sun', 'Walk', '3686.1, 2021-01-08T17:45:42Z'],
    [4.600041764E9, 'To the top baby', 'Walk', '3637.8, 2021-01-10T15:46:48Z'],
    [4.608274668E9, 'Morning Skin to the top of the Jet', 'Walk', '2614.1, 2021-01-12T11:38:27Z']
  ]

  // Get a list of the existing activity IDs
  const existingActivityIds = oldData.map((activity) => activity[0])

  Logger.log(existingActivityIds)

  // Filter the new activity list to exclude activities with a known ID
  var dataToAdd = newData.filter((activity) => !existingActivityIds.includes(activity[0]))

  Logger.log(dataToAdd)


};




function returnEpoch() {
  const date1 = '2021-01-03T15:29:04Z';
  const date2 = '2021-01-03';

  // const isoDate = date.toISOString();
  console.log('date1')
  console.log(Date.parse(date1))
  console.log('date2')
  console.log(Date.parse(date2))

}


function rearrange(){
  var mylist = [
    [4.562015501E9, '1st time to the jet', 'Walk', '5067.4', '2021-01-03T15:29:04Z'],
    [4.579188496E9, 'Evening Walk with the Kids', 'Walk', '3560.9', '2021-01-06T21:43:30Z'],
    [4.588120413E9, 'Beautiful walk in the cold sun', 'Walk', '3686.1', '2021-01-08T17:45:42Z'],
    [4.600041764E9, 'To the top baby', 'Walk', '3637.8', '2021-01-10T15:46:48Z'],
    [4.608274668E9, 'Morning Skin to the top of the Jet', 'Walk', '2614.1', '2021-01-12T11:38:27Z']
  ]

  var sortedlist = mylist.sort(function(a, b){
    // return b[4] - a[4];
    return a[4] < b[4] ? 1: -1
  })

  Logger.log(sortedlist)
}



function insertRows(){
  recentActs.insertRows(2,4);
}






