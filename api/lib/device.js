var Device = module.exports = {};
var request = require("request");
url = "http://"+sails.config.ibeaconMacauApiHost;
port = sails.config.ibeaconMacauApiPort;
url = url+":"+port;
Device.find = function(option, cb){
    request({
        url: url + "/device",
        qs: option
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var resultArr = JSON.parse(body);
            cb(null, resultArr);
        }else{
            cb(error, null);
        }           
    })         
}

Device.search = function(option, cb){
    request(
    {url: url + "/device/search",
     qs: option
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            resultArr = JSON.parse(body);
            cb(null, resultArr);
        }else{
            cb(error, null);
        }
    })       
},
Device.findOne = function(id, cb){
    request(url+"/device/"+id, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            cb(null, result);
        }else{
            cb(error, null);
        }
    })         
},
Device.getId = function(option, cb){
    request({url: url+"/device/id",
     qs: option
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = body;
            cb(null, result);
        }else{
            cb(error, null);
        }
    })  
},
Device.updateCbjTag = function(id, cbjTag, cb){
    request.post({url:url+"/device/cbjTag", form: {id: id, cbjTag: cbjTag}}, function(err,httpResponse,body){
        console.log(httpResponse.statusCode);
        if (httpResponse.statusCode==200) {
            var result = JSON.parse(body);
            cb(null, result);
        }else{
            cb(err, null);
        }
        })
}
