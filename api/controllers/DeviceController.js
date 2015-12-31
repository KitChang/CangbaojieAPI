/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Device = require('../lib/device');
module.exports = {
	id:function(req, res){
        var uuid = req.param('uuid');
        var major = req.param('major');
        var minor = req.param('minor');
        Device.getId({uuid: uuid, major: major, minor: minor}, function(err, deviceId){
            if(err){
                res.status(500);
                res.end();
                return;
            }
            if(!deviceId){
                res.status(404); 
                res.json({message: "Device not found"});
                res.end();
                return;
            }
            res.json({message: "Id found", id: deviceId});
            return;
        } )
    }
};

