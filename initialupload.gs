// Get athlete activity data
function getInitialStravaActivityData() {

  // get the sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('RecentActivities');

  // call the Strava API to retrieve data
  var data = callStravaAPI();

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
      // activity.start_date
      activity.start_date
    );
    stravaData.push(arr);
  });

  Logger.log(stravaData);

  // paste the values into the Sheet
  sheet.getRange(sheet.getLastRow() + 1, 1, stravaData.length, stravaData[0].length).setValues(stravaData);
}


// call the Strava API
function callStravaAPI() {

  // set up the service
  var service = getStravaService();

  if (service.hasAccess()) {
    Logger.log('App has access.');

    var endpoint = 'https://www.strava.com/api/v3/athlete/activities';
    var params = '?after=1609524907&per_page=200';

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
