/**
 * SystemMsgController
 *
 * @description :: Server-side logic for managing Appusers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var auth = require('../lib/auth');
 module.exports = {
 	getMsg: function (req, res) {
 		var session = req.param('session');
 		if(session==null){
            session = "-1";
        }
        auth.getUserId(session, function(err, appUserId){
            AppUser.findOne({id: appUserId}).exec(function (err, appuser) {
                if(err)
                {
                    res.status(401);
                    res.end();
                    return;
                }
                if(appuser==null)
                {
                    console.log("App user not found");
                    res.status(400);
                    res.end();
                    return;
                }
                console.log(appuser.seenMsg);
                SystemMsg.find({}).sort({createAt: -1}).exec(function (err, systemMsgs) {
                	if (err) {
                		res.status(500);
                		res.end();
                		return;
                	};
                	if (systemMsgs.length == 0) {
                		res.status(204);
                		res.end();
                		return;
                	};
                	res.status(200);
                	res.json({message: systemMsgs});

                })
            });
        });
 	}
 	,createMsg: function (req, res) {
 		var title = req.param('title');
 		var content = req.param('content');
 		var createAt = req.param('createAt');
 		var expireAt = req.param('expireAt');

 		if(title==null||content==null){
            res.status(400);
            res.json({message: "参数不足"});
            return;
        }
        if (createAt==null || createAt=="") {
        	createAt = new Date();
        }
        else {
            createAt = new Date(createAt);
        }
        if (expireAt!=null && expireAt!="") {
            expireAt = new Date(expireAt);
        };
        SystemMsg.create({title: title, content: content
        	, createAt: createAt, expireAt: expireAt}).exec(
        	function (err, systemMsg) {
        		if(err){
                    res.status(500);
                    return;
                }
                res.status(201);
                res.json(systemMsg);
        	});
 	}

};