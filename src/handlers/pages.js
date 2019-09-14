// var querystring = require('querystring');

var baseHtml = '<html>' +
  '<head>' +
    '<meta content="IE=edge" http-equiv="X-UA-Compatible">' +
    '<meta charset="utf-8">' +
    '<title>%title%</title>'  +
    '<link type="text/css" rel="stylesheet" href="//appsforoffice.microsoft.com/fabric/1.0/fabric.min.css">' +
    '<link type="text/css" rel="stylesheet" href="//appsforoffice.microsoft.com/fabric/1.0/fabric.components.min.css">' +
    '<link type="text/css" href="assets/css/app.css">' +
  '</head>' +
  '<body style="background:black;">' +
    '<div id="main-content" class="ms-Grid">' +
      '<div class="ms-Grid-row">' +
        '<div id="title-banner" class="ms-font-su" style="position: fixed; top: 50%; left: 50%; margin-top: -50px; margin-left: -100px; color:white;">Project Tau</div>' +
      '</div>' +
      '<div id="body-content" class="ms-Grid-row" style="position: fixed; top: 60%; left: 53%; margin-top: -50px; margin-left: -100px; text-decoration:none">' +
        '%body%' +
      '</div>' +
    '</div>' +
  '</body>' +
'</html>';

var buttonRow = '<div class="ms-Grid-row">' +
    '<div id="user-email" class="ms-font-l">Signed in as: %email%</div>' +
  '</div>' +
  '<div class="ms-Grid-row">' +
    '<div class="ms-Grid-col ms-u-sm4">' +
      '<a class="ms-Button ms-Button--primary" href="/logout"><span class="ms-Button-label">Logout</span></a>' +
    '</div>' +
  '</div>';

function extractId(change) {
  return change.id.match(/'([^']+)'/)[1];
}

module.exports = {
  loginPage: function(signinUrl) {
    var html = '<a id="signin-button" class="ms-Button ms-Button--primary" href="' + signinUrl + '"><span class="ms-Button-label" style="text-decoration:none;">Sign In</span></a>';

    return baseHtml.replace('%title%', 'Login').replace('%body%', html);
  },

  loginCompletePage: function(userEmail) {
    var html = '<div class="ms-Grid">';
    html += buttonRow.replace('%email%', userEmail);
    html += '</div>';

    return baseHtml.replace('%title%', 'Main').replace('%body%', html).replace('%email',userEmail);
  }
};
