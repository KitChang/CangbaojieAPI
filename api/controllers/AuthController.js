/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
	local: function(req, res){
        var phone = req.param('phone');
        var password = req.param('password');
        
        var errMsg = null;
        if(phone.length != 11){
            errMsg = "Invalid phone or password";
        }
        var phoneNumber = parseInt(phone);
        if(phoneNumber=='NaN'){
            errMsg = "Invalid phone or password";
        }
        if(password.length < 8){
            errMsg = "Invalid phone or password";
        }
        if(errMsg){
            res.status(400);
            res.json({message: errMsg});
            return;
        }
        
        AppUser.findOne({phone: phone, password: password}).exec(function(err, userFound){
            if (err) {
                res.status(500);
                res.json({message: "Not Authenticated"});
                return;
            }
            if(!userFound){
                res.status(400);
                res.json({message: "Not Authenticated"});
                return;
            }
            
            req.session.user= userFound.id;
            req.session.authenType = "local";
            sessionId = req.session.id;
            res.json({message: "Authenticated", session: sessionId, user: {id: userFound.id, name: userFound.username, phone: userFound.phone, phoneVerified: userFound.phoneVerified}});
            
        });
    },
    wechat: function(req, res){
        
    var code = req.param("code");
    var OAuth = require('wechat-oauth');
    var client = new OAuth('wxd28c85eb2e4b9769', 'd4624c36b6795d1d99dcf0547af5443d');
        
    client.getAccessToken(code, function (err, result) {
        if(err){
            console.log(err);
            res.status(400);
            res.json({message: "Not authenticated"});
            return;
        }
        var openid, accessToken;
        accessToken = result.data.access_token;
        openid = result.data.openid;
        client.getUser(openid, function (err, result) {
            if(err){
                console.log("68");
                res.status(500);
                res.json({message: "Not authenticated"});
                return;
            }
            var userInfo = result;
            AppUser.findOne({openid: openid}).exec(function(err, user){
                if(err){
                    console.log("err");
                    res.status(500);
                    res.json({message: "Not authenticated"});
                    return;
                }
                if(!user){
                    AppUser.create({openid: openid, nickname: userInfo.nickname, sex: userInfo.sex, phone: "", phoneVerified: false, authenType: "wechat"}).exec(function(err, createdUser){
                        if(err){
                            res.status(500);
                            console.log("85");
                            res.json({message: "Not authenticated"});
                            return;
                        }
                        req.session.user = createdUser.id;
                        req.session.authenType = "wechat";
                        sessionId = req.session.id;
                        res.status(200);
                        res.json({message: "Authenticated", user: {id: createdUser.id, name: createdUser.nickname, phone: createdUser.phone, verified: createdUser.verified }, session_id: sessionId});
                        return;
                    })
                } else {
                    req.session.user = openid;
                    req.session.authenType = "wechat";
                    sessionId = req.session.id;
                    res.status(200);
                    res.json({message: "Authenticated", user: {id: user.id, name: user.nickname, phone: user.phone, verified: user.verified}, session_id: sessionId});
                    return;
                }
            });
            
        });
        
    });
    },
    authenticated: function(req, res){
        
        var sessionId = req.param('session');
          
        sessions.findOne({id: sessionId}).exec(function(err, sessionFound){
            if (err) {
                res.status(500);
                res.json({message: "Not authenticated"});
                return;
            }
            if(!sessionFound){
                res.status(500);
                res.json({message: "Not authenticated"});
                return;
            }
            var session2 = JSON.parse(sessionFound.session);
            var authenType = session2.authenType;
            var userId = session2.user;
            if(authenType=="wechat"){
                AppUser.findOne({openid: userId}).exec(function(err, userFound){
                    if(err){
                        res.status(500);
                        res.json({message: "Not authenticated"});
                        return;
                    }
                    if(!userFound){
                        res.status(400);
                        res.json({message: "Not authenticated"});
                        return;
                    }
                    res.status(200);
                    res.json({message: "Authenticated", user: { id: userFound.id, name: userFound.nickname, phone: userFound.phone, phoneVerified: userFound.phoneVerified}});
                    return;
                })
            }else if(authenType=="local"){
                AppUser.findOne({id: userId}).exec(function(err, userFound){
                    if(err){
                        res.status(500);
                        res.json({message: "Not authenticated"});
                        return;
                    }
                    if(!userFound){
                        res.status(400);
                        res.json({message: "Not authenticated"});
                        return;
                    }
                    res.status(200);
                    res.json({message: "Authenticated", user: { id: userFound.id, name: userFound.username, phone: userFound.phone, phoneVerified: userFound.phoneVerified}});
                    return;
                });
            }else{
                res.status(400);
                res.json({message: "Not authenticated"});
                return;
            }
        });
                
    }
    
};

