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
        var err = false
        if(!password||!phone){
            err = true;
        }
        if(phone.length != 11){
            err = true;
        }
        if(!/\d{11}/.test(phone)){
            err = true;
        }
        if(password.length < 8){
            err = true;
        }
        if(err){
            res.status(400);
            res.json({message: "Invalid phone and password"});
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
            req.session.authType = "local";
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
            res.status(500);
            res.json({message: "Not authenticated"});
            return;
        }
        var openid, accessToken;
        accessToken = result.data.access_token;
        openid = result.data.openid;
        client.getUser(openid, function (err, result) {
            if(err){
                res.status(500);
                res.json({message: "Not authenticated"});
                return;
            }
            var userInfo = result;
            AppUser.findOne({openid: openid}).exec(function(err, user){
                if(err){
                    res.status(500);
                    res.json({message: "Not authenticated"});
                    return;
                }
                if(!user){
                    AppUser.create({openid: openid, username: userInfo.nickname, sex: userInfo.sex, phone: "", phoneVerified: false, authType: "wechat"}).exec(function(err, createdUser){
                        if(err){
                            res.status(500);
                            res.json({message: "Not authenticated"});
                            return;
                        }
                        req.session.user = createdUser.id;
                        req.session.authType = "wechat";
                        sessionId = req.session.id;
                        res.status(200);
                        res.json({message: "Authenticated", user: {id: createdUser.id, name: createdUser.username, phone: createdUser.phone, phoneVerified: createdUser.phoneVerified }, session: sessionId});
                        return;
                    })
                } else {
                    req.session.user = user.id;
                    req.session.authType = "wechat";
                    sessionId = req.session.id;
                    res.status(200);
                    res.json({message: "Authenticated", user: {id: user.id, name: user.username, phone: user.phone, phoneVerified: user.phoneVerified}, session: sessionId});
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
            var authType = session2.authType;
            var userId = session2.user;
            
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
            })

            
        });
                
    }
    
};

