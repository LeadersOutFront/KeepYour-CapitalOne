var UI = require('ui');
var ajax = require('ajax');
var url = "https://api.levelmoney.com/api/v2/hackathon/get-all-transactions";
var args = {
  "args": {
    "uid": 1110568334,
    "token": "2D0E7A841370F103D9034CAC3C91F50C",
    "api-token": "HackathonApiToken"
  }
};

var SM = require('strap');
var strapMetricsParms = {
    app_id: "foHebnuxMJQvjnCT6 ",
    resolution: "144x168",
    useragent: "PEBBLE/2.0"
};

SM.Init(strapMetricsParms);

SM.Log("/loaded");


ajax({
    "url": url,
    "method": "POST",
    "headers": {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    "type": "json",
    "data": args
  }, function(pretty) {
    console.log("result");
    console.log(typeof pretty);
    console.log(pretty);
    //display first result in pebble card
    var recentTrans = pretty.transactions[0];
    var merchant = recentTrans.merchant;
    var amount = recentTrans.amount;

    var card = new UI.Card({
      title: "Recent Transaction " + merchant,
      body: "$" + amount
    });
    card.show();
    card.on('click', 'down', function() {
    SM.Log("/action/sms-try");

    console.log('SMS clicked/Sent!');

      var msg = "$" + amount + " from " + merchant + " not authorized. Please place a hold on my account.";

ajax({
      "url": "https://rest.nexmo.com/sms/json?api_key=b285c997&api_secret=3d3e4b5b&from=12525573078&to=16017388729&text=" + msg,
      "method": "GET",
      "type": "json"
}, function(success){
    SM.Log("/action/sms-sent");

	var SMScard = new UI.Card({
	title: 'SMS Sent',
	body: msg,
	scrollable: true
	});
	SMScard.show();

          //insert approve or disapprove
  }, function(err) {
    console.log("error");
    console.log(err);
  });

});

}, function(error) {
	console.log(error);
});