/**
 * AppUserController
 *
 * @description :: Server-side logic for managing Appusers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var auth = require('../lib/auth');
var request = require('request');
var parseString = require('xml2js').parseString;
var moment = require('moment');

module.exports = {
	create: function(req, res){
        var username = req.param('username');
        var password = req.param('password');
        var gender = req.param("gender");
        var phone = req.param("phone");
        AppUser.create({username: username, password: password, gender: gender, phone: phone}).exec(function(err, result){
            if (err) {
                res.status(500);
                res.end();
            }
            res.status(200);
            res.end();
            });
    },
    register: function(req, res){
        var phone = req.param('phone');
        var password = req.param('password');
        var username = req.param('username');
        var sex = req.param("sex");
        
        
        var errObj = {}, phoneErr = null, passwordErr = null, usernameErr = null, sexErr = null;
        if(phone==null||password==null||username==null||sex==null){
            res.status(400);
            res.json({message: "参数不足"});
            return;
        }
        var phoneReg = /^\d{11}$/; 
        if(phone.length != 11 || !phone.match(phoneReg)){
            phoneErr = "电话号码需为11位数字";
        }
        
        if(password.length < 8){
            passwordErr = "密码长度至少8位";
        }
        if(username.length < 2){
            usernameErr = "用户名长度至少2位";
        }
        if(sex!="1"&&sex!="2"){
            sexErr = "性别格式错误";
        }
        if(phoneErr){
            errObj.phone = phoneErr;
        }
        if(passwordErr){
            errObj.password = passwordErr;
        }
        if(usernameErr){
            errObj.username = usernameErr;
        }
        if(sexErr){
            errObj.sex = sexErr;
        }
        
        if(phoneErr || passwordErr || usernameErr || sexErr){
            res.status(400);
            res.json({message: "Validation error", errMessage: errObj});
            return;
        }
        AppUser.findOne({phone: phone}).exec(function(err, appUserFound){
            if(err){
                res.status(500);
                res.json({message: "Not registered"});
                return;
            }
            if(appUserFound!=null){
                res.status(400);
                res.json({message: "User already found"});
                return;
            }
            AppUser.create({phone: phone, password: password, username: username, phoneVerified: false, auth_type: "local", sex: sex}).exec(function(err, createdUser){
            res.status(200);
            res.json({message: "Registered"});
        });
        });
        
    },
    logout: function(req, res){
        var sessionId = req.param('session');
        sessions.destroy({id: sessionId}).exec(function(err){
            req.session.destroy();
            res.status(200);
            res.json({message: "Logout"});
        });;
        
    }
    //Kit
    ,
    phoneRegister: function (req,res) {
        var sessionId = req.param('session');
        if(sessionId==null){
            sessionId = "-1";
        }
        auth.getUserId(sessionId, function(err, appUserId){
            AppUser.findOne({id: appUserId}).exec(function (err, appuser) {
                if(err)
                {
                    res.status(401);
                    res.end();
                    return;
                }
                if(appuser==null)
                {
                    console.log("appuser not found");
                    res.status(400);
                    res.end();
                    return;
                }
                if (appuser.phoneVerified == true) {
                    console.log("appuser is phoneVerified");
                    res.status(204);
                    res.json({message: 'user is verified'});
                    return;
                }
                var number = Math.floor(Math.random()*(999999-100000+1)+100000);
                appuser.verifyCode = number.toString();
                //var today = new Date('UTC');
                var expire = moment().utcOffset("+08:00").add(1,'d');
                //expire.setTime(expire.getTime() + 60 *1000); //1 * 24 * 60 * 60 * 1000
                appuser.verifyExpire = expire.format("YYYY-MM-DD HH:mm:ssZZ")
                appuser.save(function (err, appuser) {
                    if (err) {
                        res.status(500);
                        res.end();
                    return;
                    };
                    request.post('http://106.ihuyi.cn/webservice/sms.php?method=Submit'
                        , {form:{'account':'cf_377736392',
                                'password':'tuQIANQIAN123',
                                //'mobile':appuser.phone,
                                'content': '您的验证码是：'+appuser.verifyCode+'。请不要把验证码泄露给其他人。'}}
                        , function (err, response, result) {
                        if (err) {
                            res.status(500);
                            res.json({message: 'Cant send SMS'});
                            return;
                        };
                        parseString(result, function (err, object) {
                            if (err) {
                                res.status(500);
                                res.json({message: 'Cant receive SMS'});
                            return;
                            };
                            if (object.SubmitResult.code[0] != "2") {
                                res.status(500);
                                res.json({message: object.SubmitResult.msg});
                                return;
                            };
                            res.status(200);
                            res.json({message: 'regist success'});
                        });
                        
                    });
                    
                });
                
            });
        });
    }
    ,phoneVerify: function (req, res) {
        var sessionId = req.param('session');
        var code = req.param('code');
        
        if(sessionId==null||code==null){
            res.status(400);
            res.json({message: "参数不足"});
            return;
        }
        if(sessionId==null){
            sessionId = "-1";
        }
        auth.getUserId(sessionId, function(err, appUserId){
            AppUser.findOne({id: appUserId}).exec(function (err, appuser) {
                if(err)
                {
                    res.status(401);
                    res.end();
                    return;
                }
                if(appuser==null)
                {
                    console.log("appuser not found");
                    res.status(400);
                    res.end();
                    return;
                }
                if (appuser.phoneVerified == true) {
                    console.log("appuser is phoneVerified");
                    res.status(204);
                    res.json({message: 'user is verified'});
                    return;
                }
                var today = moment();
                var expire = moment(appuser.verifyExpire, "YYYY-MM-DD HH:mm:ssZZ");
                console.log(today);
                console.log(expire);
                if (!expire.isValid() || today.isAfter(expire)) {
                    console.log(today.isAfter(expire));
                    res.status(400);
                    res.json({message: 'please regist first'});
                    return;
                }
                if (appuser.verifyCode == code) {
                    appuser.phoneVerified = true;
                    appuser.verifyCode = null;
                    appuser.verifyExpire = null;
                    appuser.save(function (err, appuser) {
                        if (err) {
                            console.log('service down');
                            res.status(500);
                            res.json({message: 'service down'});
                            return;
                        };
                        console.log('verify success');
                        res.status(200);
                        res.json({message: 'verify success'});

                    });
                }
                else {
                    console.log("wrong verifyCode");
                    res.status(400);
                    res.json({message: 'wrong code'});
                    return;
                }
                


            });
        });
    }
    ,changePassword: function (req, res) {
        var sessionId = req.param('session');
        var password = req.param('password');
        var newPassword = req.param('newpassword');

        if(sessionId==null||password==null||newPassword==null){
            res.status(400);
            res.json({message: "参数不足"});
            return;
        }
        auth.getUserId(sessionId, function(err, appUserId){
            AppUser.findOne({id: appUserId}).exec(function (err, appuser) {
                if(err)
                {
                    res.status(401);
                    res.end();
                    return;
                }
                if(appuser==null)
                {
                    console.log("appuser not found");
                    res.status(400);
                    res.end();
                    return;
                }
                if (appuser.password == password) {
                    if(newPassword.length < 8){
                        res.status(400);
                        res.json({message: "密码长度至少8位"});
                        return;
                    }
                    appuser.password = newPassword;
                    appuser.save(function (err, appuser) {
                        if (err) {
                            res.status(500);
                            res.json({message: 'service down'});
                            return;
                        }
                        res.status(200);
                        res.json({message: 'change password success'});
                    });
                }
                else {
                    res.status(400);
                    res.json({message: 'invalid password'});
                }
            });
        });

    }
    ,resetPassword: function (req, res) {
        var phone = req.param('phone');

        if(phone==null){
            res.status(400);
            res.json({message: "参数不足"});
            return;
        }
        AppUser.findOne({phone: phone}).exec(function (err, appuser) {
            if(appuser==null)
            {
                console.log("appuser not found");
                res.status(400);
                res.json({message: 'user not found'});
                return;
            }
            var number = Math.floor(Math.random()*(999999-100000+1)+100000);
                appuser.resetVerifyCode = number.toString();
                //var today = new Date('UTC');
                var expire = moment().utcOffset("+08:00").add(1,'d');
                //expire.setTime(expire.getTime() + 60 *1000); //1 * 24 * 60 * 60 * 1000
                appuser.resetVerifyExpire = expire.format("YYYY-MM-DD HH:mm:ssZZ")
                appuser.save(function (err, appuser) {
                    if (err) {
                        res.status(500);
                        res.end();
                    return;
                    };
                    request.post('http://106.ihuyi.cn/webservice/sms.php?method=Submit'
                        , {form:{'account':'cf_377736392',
                                'password':'tuQIANQIAN123',
                                //'mobile':appuser.phone,
                                'content': '您的验证码是：'+appuser.verifyCode+'。请不要把验证码泄露给其他人。'}}
                        , function (err, response, result) {
                        if (err) {
                            res.status(500);
                            res.json({message: 'Cant send SMS'});
                            return;
                        };
                        parseString(result, function (err, object) {
                            if (err) {
                                res.status(500);
                                res.json({message: 'Cant receive SMS'});
                            return;
                            };
                            if (object.SubmitResult.code[0] != "2") {
                                res.status(500);
                                res.json({message: object.SubmitResult.msg});
                                return;
                            };
                            res.status(200);
                            res.json({message: 'regist success'});
                        });
                        
                    });
                    
                });

        });
    }
    ,resetVerify: function (req, res) {
        var phone = req.param('phone');
        var newPassword = req.param('newpassword');
        var code = req.param('code');
        
        if(phone==null||code==null||newPassword==null){
            res.status(400);
            res.json({message: "参数不足"});
            return;
        }
            AppUser.findOne({phone: phone}).exec(function (err, appuser) {
                if(err)
                {
                    res.status(500);
                    res.end();
                    return;
                }
                if(appuser==null)
                {
                    console.log("appuser not found");
                    res.status(400);
                    res.end();
                    return;
                }

                var today = moment();
                var expire = moment(appuser.resetVerifyExpire, "YYYY-MM-DD HH:mm:ssZZ");
                console.log(today);
                console.log(expire);
                if (!expire.isValid() || today.isAfter(expire)) {
                    console.log(today.isAfter(expire));
                    res.status(400);
                    res.json({message: 'please regist first'});
                    return;
                }
                if (appuser.resetVerifyCode == code) {
                    appuser.password = newPassword;
                    appuser.resetVerifyCode = null;
                    appuser.resetVerifyExpire = null;
                    appuser.save(function (err, appuser) {
                        if (err) {
                            console.log('service down');
                            res.status(500);
                            res.json({message: 'service down'});
                            return;
                        };
                        console.log('verify success');
                        res.status(200);
                        res.json({message: 'verify success'});

                    });
                }
                else {
                    console.log("wrong verifyCode");
                    res.status(400);
                    res.json({message: 'wrong code'});
                    return;
                }
            });
        
    }
    //Kit end
    
};
