var Device = module.exports = {};
var request = require("request");
var host = "http://ibeacon-api.herokuapp.com/";
host = "http://"+sails.config.ibeaconMacaoApiHost;
port = sails.config.ibeaconMacaoApiPort;
//host = "http://localhost:1337/";
Device.find = function(option, cb){
    request({
        url: host+":"+port+"/device",
        qs: option
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var resultArr = JSON.parse(body);
            cb(null, resultArr);
        }else{
            cb(error);
        }           
    })         
}

Device.search = function(option, cb){
    request(
    {url: host+":"+port+"/device/search",
     qs: option
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            resultArr = JSON.parse(body);
            cb(null, resultArr);
        }else{
            cb(error);
        }
    })       
},
Device.findOne = function(id, cb){
    request(host+":"+port+"/device/"+id, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("body"+body);
            var result = JSON.parse(body);
            cb(null, result);
        }else{
            cb(error);
        }

    })         
},
Device.getId = function(option, cb){
    request({url: host+":"+port+"/device/id",
     qs: option
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = body;
            cb(null, result);
        }else{
            cb(error);
        }
    })  
},
Device.updateCbjTag = function(id, cbjTag, cb){
    request.post({url:host+":"+port+"/device/cbjTag", form: {id: id, cbjTag: cbjTag}}, function(err,httpResponse,body){
        console.log(httpResponse.statusCode);
        if (httpResponse.statusCode==200) {
            var result = JSON.parse(body);
            cb(null, result);
        }else{
            cb(err);
        }
        })
}
