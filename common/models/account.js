var yummly = require('../yummly-keys');
var api_endpoint = 'http://api.yummly.com/v1/api/';
var auth_params = '_app_id='+yummly.app_id+'&_app_key='+yummly.app_key;
var search_url = api_endpoint+'recipes?'+auth_params+'&maxResult=5';
const http = require('http');
const util = require('util');

module.exports = function(Account) {

	Account.prototype.getRecommendation = function (ctx,cb) {
    var account = this;
    console.log(this);
    // var vo2 = 1;
    // var kcal = vo2*4.9;
    // var weight_intention = 'keep';
    // switch (weight_intention){
    //   case 'keep':
    //   break;
    //   case 'loose':
    //   break;
    //   case 'gain':
    //   break;
    // }
    var kcal_param = '&nutrition.ENERC_KCAL.min=200&nutrition.ENERC_KCAL.max=800';

    http.get(search_url+kcal_param,function (res) {
    	var body = '';
		  res.on('data', function(chunk) {
		    body += chunk;
		  });
		  res.on('end', function() {
		  	var data = JSON.parse(body);
		    console.log(util.inspect(data));
		    // console.log(JSON.stringify(util.inspect(body), null, 4));
		    cb(null,data["matches"]);
		  });
    })
    .on('error', function(err) {
		  // console.log("Got error: " + err.message);
    	cb(err);
		});
  };

  Account.remoteMethod(
    'getRecommendation',
    {
      description: 'Ger recomendation for a given user',
      accepts: [
      	{ arg: 'ctx', type: 'object', http: { source:'context' } }
      ],
      returns: {
        arg: 'data', type: ['object'], root: true
      },
      isStatic:false,
      http: {path:'/getRecommendation', verb: 'post'}
    }
  );
};
