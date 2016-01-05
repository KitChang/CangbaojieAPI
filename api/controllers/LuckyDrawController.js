/**
 * LuckyDrawController
 *
 * @description :: Server-side logic for managing luckydraws
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var random = require("random-js"); 
var auth = require("../lib/auth");
var logger = sails.config.log4js.getLogger('cangbaojie');
var Device = require("../lib/device");
var moment = require('moment');
function win(probability) {
    var scaleFactor = 100;
    var range = probability*scaleFactor;
    range = parseInt(range);
    max = 100*scaleFactor;
    var engine = random.engines.mt19937().autoSeed();
    var distribution = random.integer(1, max);
    if(distribution(engine)>range)
        return false;
    return true;
}

function getRandom(min, max) {
    var engine = random.engines.mt19937().autoSeed();
    var distribution = random.integer(min, max);
    return distribution(engine);
}
        
module.exports = {
	
    probabilityDraw: function(req, res){
        var advertisementId = req.param('advertisement');
        var sessionId = req.param('session');
        var deviceId = req.param('device');
        var luckyDrawCoupon = req.param('coupon');
        var appUserId = req.param('appUser');
        
        auth.getUserId(sessionId, function(err, appUserId){
            if(!appUserId){
                res.status(401);
                res.json({message: "Not authenticated"});
                res.end();
                return;
            }
            Device.findOne(deviceId, function(err, dev){
                if(!dev){
                    res.status(400);
                    res.json({message: "Device not found"});
                    res.end();
                    return;
                }
                advertisement.findOne({id: advertisementId}).populate('probabilityDraw').exec(function(err, ad){
                    if(!ad){
                        res.status(400);
                        res.end();
                        return;
                    }
                    if(ad.drawType!="probability"){
                        res.status(400);
                        res.end();
                        return;
                    }
                    if(!ad.probabilityDraw){
                        res.status(500);
                        res.end();
                        return;
                    }
                    var today = moment().toDate();
                    AppUserDrawInterval.find({appUser: appUserId, advertisement: advertisementId,redrawAt: {'>': today} }).exec(function(err, appUserDrawInterval){
                        if(appUserDrawInterval.length){
                            res.status(400);
                            res.json({message: "Draw within interval"});
                            res.end();
                            return;
                        }else{
                            var drawPerformInterval = ad.drawPerformInterval;
                            console.log("dsfsdfds"+drawPerformInterval);
                            drawPerformInterval = moment().add(drawPerformInterval, "seconds").toDate();
                            AppUserDrawInterval.create({appUser: appUserId, advertisement: advertisementId, redrawAt: drawPerformInterval}).exec(function(err){
                                
                                var firstPrizeProbability = ad.probabilityDraw.firstPrizeProbability;
                                var secondPrizeProbability = ad.probabilityDraw.secondPrizeProbability;
                                var thirdPrizeProbability = ad.probabilityDraw.thirdPrizeProbability;
                                var fourthPrizeProbability = ad.probabilityDraw.fourthPrizeProbability;
                                var fifthPrizeProbability = ad.probabilityDraw.fifthPrizeProbability;
                                var firstPrizeQuantity = ad.firstPrizeQuantityRemain;
                                var secondPrizeQuantity = ad.secondPrizeQuantityRemain;
                                var thirdPrizeQuantity = ad.thirdPrizeQuantityRemain;
                                var fourthPrizeQuantity = ad.fourthPrizeQuantityRemain;
                                var fifthPrizeQuantity = ad.fifthPrizeQuantityRemain;
                                var winPrize = "none";
                                if(firstPrizeQuantity > 0 && win(firstPrizeProbability)){
                                    winPrize = "1";
                                }else if(secondPrizeQuantity > 0 && win(secondPrizeProbability)){
                                    winPrize = "2";
                                }else if(thirdPrizeQuantity > 0 && win(thirdPrizeProbability)){
                                    winPrize = "3";
                                }else if(fourthPrizeQuantity > 0 && win(fourthPrizeProbability)){
                                    winPrize = "4";
                                }else if(fifthPrizeQuantity > 0 && win(fifthPrizeProbability)){
                                    winPrize = "5";
                                }
                                if(winPrize == "none"){
                                    res.status(204);
                                    res.end();
                                    if(luckyDrawCoupon){
                                        LuckyDrawCoupon.destroy({id: luckyDrawCoupon, appUser: appUserId}).exec(function(err){
                                        });
                                    }
                                    return;
                                }
                                option = {};
                                if(winPrize=="1"){
                                    option.firstPrizeQuantityRemain = firstPrizeQuantity -1;
                                }else if(winPrize=="2"){
                                    option.secondPrizeQuantityRemain = secondPrizeQuantity -1;
                                }else if(winPrize=="3"){
                                    option.thirdPrizeQuantityRemain = thirdPrizeQuantity -1;
                                }else if(winPrize=="4"){
                                    option.fourthPrizeQuantityRemain = fourthPrizeQuantity - 1;
                                }else if(winPrize=="5"){
                                    option.fifthPrizeQuantityRemain = fifthPrizeQuantity - 1;
                                }
                                option.drawCount = ad.drawCount + 1;
                                advertisement.update({id: advertisementId}, option).exec(function(err){
                                    if(err){
                                        res.status(500);
                                        res.end();
                                        return;
                                    }
                                    var prizeCouponExpiredType = ad.prizeCouponExpiredType;
                                    var redeemLocation = ad.redeemLocation;
                                    var prizeCouponExpiredAt;
                                    if(prizeCouponExpiredType=="duration"){
                                        var days = ad.prizeCouponExpiredDuration;
                                        prizeCouponExpiredAt = moment().startOf('day').add(days, 'days').endOf('day').toDate();
                                    }else if(prizeCouponExpiredType=="date"){
                                        var date = ad.prizeCouponExpiredDate;
                                        prizeCouponExpiredAt = date;
                                    }
                                    PrizeCoupon.create({appUser: appUserId, advertisement: advertisementId, prize: winPrize, prizeCouponExpiredAt: prizeCouponExpiredAt, redeemLocation: redeemLocation, pickAt: "", throughDevice: deviceId ,state: dev.state, city: dev.city, region: dev.region, street: dev.street}).exec(function(err){
                                    if(err){
                                        res.status(500);
                                        res.end();
                                        return;
                                    }
                                    res.status(201);
                                    res.json({message: "Won", prize: winPrize});
                                    res.end();
                                    });
                                    logger.info('User ' + appUserId + " win " + winPrize + " prize of advertisement " + advertisementId );
                                    if(luckyDrawCoupon){
                                        LuckyDrawCoupon.destroy({id: luckyDrawCoupon, appUser: appUserId}).exec(function(err){
                                        });
                                    }
                                    return;
                                });
                                
                                
                            });
                        }
                    });
                    
                    
                    


                });

            });
        
        });
        
        
    }
    

    ,
    orderDraw: function(req, res){
        var advertisementId = req.param('advertisement');
        var sessionId = req.param('session');
        var deviceId = req.param('device');
        var luckyDrawCoupon = req.param('coupon');
        auth.getUserId(sessionId, function(err, appUserId){
            if(!appUserId){
                res.status(401);
                res.json({message: "Not authenticated"});
                res.end();
                return;
            }
            Device.findOne(deviceId, function(err, dev){
                if(!dev){
                    res.status(400);
                    res.json({message: "Not authenticated"});
                    res.end();
                    return;
                }
                advertisement.findOne({id: advertisementId}).exec(function(err, ad){
                    if(!ad){
                        res.status(400);
                        res.json({message: "Not authenticated"});
                        res.end();
                        return;
                    }
                    var today = moment().toDate();
                    AppUserDrawInterval.findOne({appUser: appUserId, advertisement: advertisementId, redrawAt: {'>': today}}).exec(function(err, appUserDrawInterval){
                        if(appUserDrawInterval){
                            res.status(400);
                            res.json({message: "Draw within interval"});
                            res.end();
                            return;
                        }else{
                            var drawPerformInterval = ad.drawPerformInterval;
                            drawPerformInterval = moment().add(drawPerformInterval, "seconds").toDate();
                            console.log("dsdsfdsfdsf:"+ad.drawPerformInterval);
                            AppUserDrawInterval.create({appUser: appUserId, advertisement: advertisementId, redrawAt: drawPerformInterval}).exec(function(){
                    
                            if(ad.drawType!="order"){
                                res.status(400);
                                res.end();
                                return;
                            }
                            var drawCount = ad.drawCount;
                            drawCount++;
                            var firstPrizeQuantity = ad.firstPrizeQuantityRemain;
                            var secondPrizeQuantity = ad.secondPrizeQuantityRemain;
                            var thirdPrizeQuantity = ad.thirdPrizeQuantityRemain;
                            var fourthPrizeQuantity = ad.fourthPrizeQuantityRemain;
                            var fifthPrizeQuantity = ad.fifthPrizeQuantityRemain;
                            OrderDraw.find({advertisement: advertisementId}).exec(function(err, orderDraws){
                                if(!orderDraws){
                                    res.status(500);
                                    res.end();
                                    return;
                                }
                                if(err){
                                    res.status(500);
                                    res.end();
                                    return;
                                }
                                var rule;
                                var orderDrawOne;
                                while(orderDraws.length){
                                    orderDrawOne = orderDraws.pop();
                                    if((orderDrawOne.drawCountLowerBound <= drawCount) && (orderDrawOne.drawCountUpperBound >= drawCount))
                                        rule = orderDrawOne;
                                }
                                if(!rule){
                                    res.json({message: "No matched rule"});
                                    res.status(500);
                                    res.end();
                                    return;
                                }
                                var firstPrizeRange = orderDrawOne.firstPrizeRange;
                                var secondPrizeRange = orderDrawOne.secondPrizeRange;
                                var thirdPrizeRange = orderDrawOne.thirdPrizeRange;
                                var fourthPrizeRange = orderDrawOne.fourthPrizeRange;
                                var fifthPrizeRange = orderDrawOne.fifthPrizeRange;
                                var max = rule.drawCountUpperBound - drawCount + 1;
                                var draw = getRandom(1, max);

                                sails.config.prize.attempt = sails.config.prize.attempt +1;
                                var prizeRangeSum = firstPrizeRange + secondPrizeRange + thirdPrizeRange + fourthPrizeRange + fifthPrizeRange;

                                if(draw <= prizeRangeSum){
                                    var secondDraw = getRandom(1, prizeRangeSum);
                                    var winPrize = "none";
                                    if(secondDraw >= 1 && secondDraw <= (firstPrizeRange) && firstPrizeQuantity > 0){
                                        winPrize = "1";
                                    }else if(secondDraw >= (firstPrizeRange + 1) && secondDraw <= (firstPrizeRange + secondPrizeRange ) && secondPrizeQuantity > 0){
                                        winPrize = "2";
                                    }else if(secondDraw >= (firstPrizeRange + secondPrizeRange + 1) && secondDraw <= (firstPrizeRange + secondPrizeRange + thirdPrizeRange ) && thirdPrizeQuantity > 0){
                                        winPrize = "3";
                                    }else if(secondDraw >= (firstPrizeRange + secondPrizeRange + thirdPrizeRange + 1) && secondDraw <= (firstPrizeRange + secondPrizeRange + thirdPrizeRange + fourthPrizeRange ) && fourthPrizeQuantity > 0){
                                        winPrize = "4";
                                    }else if(secondDraw >= (firstPrizeRange + secondPrizeRange + thirdPrizeRange + fourthPrizeRange + 1) && secondDraw <= (firstPrizeRange + secondPrizeRange + thirdPrizeRange  + fourthPrizeRange + fifthPrizeRange ) && fifthPrizeQuantity > 0){
                                        winPrize = "5";
                                    }
                                    sails.config.prize.count = drawCount;
                                    var option = {};
                                    var orderDrawOption = {};

                                    if(winPrize=="1"){
                                        orderDrawOption.firstPrizeRange = firstPrizeRange -1;
                                        option.firstPrizeQuantityRemain = firstPrizeQuantity -1;
                                    }else if(winPrize =="2"){
                                        orderDrawOption.secondPrizeRange = secondPrizeRange -1;
                                        option.secondPrizeQuantityRemain = secondPrizeQuantity -1;
                                    }else if(winPrize=="3"){
                                        orderDrawOption.thirdPrizeRange = thirdPrizeRange -1;
                                        option.thirdPrizeQuantityRemain = thirdPrizeQuantity -1;
                                    }else if(winPrize=="4"){
                                        orderDrawOption.fourthPrizeRange = fourthPrizeRange -1;
                                        option.fourthPrizeQuantityRemain = fourthPrizeQuantity -1;
                                    }else if(winPrize=="5"){
                                        orderDrawOption.fifthPrizeRange = fifthPrizeRange -1;
                                        option.fifthPrizeQuantityRemain = fifthPrizeQuantity -1;
                                    }else{
                                        res.status(204);
                                        res.end();
                                        if(luckyDrawCoupon){
                                            LuckyDrawCoupon.destroy({id: luckyDrawCoupon, appUser: appUserId}).exec(function(err){
                                            });
                                        }
                                        advertisement.update({id: advertisementId}, {drawCount: drawCount}).exec                               (function(err) {})
                                        return;
                                    }
                                    if(winPrize=="1")
                                            sails.config.prize.f = sails.config.prize.f + 1;
                                    if(winPrize=="2")
                                        sails.config.prize.s = sails.config.prize.s + 1;
                                    if(winPrize=="3")
                                        sails.config.prize.t = sails.config.prize.t + 1;
                                    if(winPrize=="4")
                                        sails.config.prize.fo = sails.config.prize.fo + 1;
                                    if(winPrize=="5")
                                        sails.config.prize.fi = sails.config.prize.fi + 1;
                                    option.drawCount = drawCount;
                                    advertisement.update({id: advertisementId}, option).exec(function(err) {
                                        if(err){
                                            res.status(500);
                                            res.end();
                                            return;
                                        }
                                        var prizeCouponExpiredType = ad.prizeCouponExpiredType;
                                        var redeemLocation = ad.redeemLocation;
                                        var prizeCouponExpiredAt;
                                        if(prizeCouponExpiredType=="duration"){
                                            var days = ad.prizeCouponExpiredDuration;
                                            prizeCouponExpiredAt = moment().startOf('day').add(days, 'days').endOf('day').toDate();
                                        }else if(prizeCouponExpiredType=="date"){
                                            prizeCouponExpiredAt = ad.prizeCouponExpiredDate;
                                        }
                                        PrizeCoupon.create({appUser: appUserId, advertisement: advertisementId, prize: winPrize, prizeCouponExpiredAt: prizeCouponExpiredAt, redeemLocation: redeemLocation, pickAt: "", throughDevice: deviceId ,city: dev.city, state: dev.state, region: dev.region, street: dev.street}).exec(function(err){
                                            if(err){
                                                res.status(500);
                                                res.end();
                                                return;
                                            }
                                            OrderDraw.update({id: rule.id}, orderDrawOption).exec(function(err, doc){
                                                    if(err){
                                                        res.status(500);
                                                        res.end();
                                                        return;
                                                    }
                                                    console.log("1: "+sails.config.prize.f+" 2: "+sails.config.prize.s+" 3: "+sails.config.prize.t+ " 4: "+sails.config.prize.fo+" 5: "+sails.config.prize.fi+" attempt: "+sails.config.prize.attempt);
                                                    res.status(201);
                                                    res.json({message: "Won", prize: winPrize}); 
                                                    res.end();
                                                    if(luckyDrawCoupon){
                                                        LuckyDrawCoupon.destroy({id: luckyDrawCoupon, appUser: appUserId}).exec(function(err){

                                                        });
                                                    }

                                                    logger.info('User ' + appUserId + " win " + winPrize + " prize of advertisement " + advertisementId );
                                                return;
                                                });
                                        });



                                        });

                                }else{
                                    advertisement.update({id: advertisementId}, {drawCount: drawCount}).exec                       (function(err) {
                                    if(err){
                                        res.status(500);
                                        res.end();
                                        return;
                                    }
                                    res.status(204);
                                    res.end();
                                    if(luckyDrawCoupon){
                                        LuckyDrawCoupon.destroy({id: luckyDrawCoupon, appUser: appUserId}).exec(function(err){

                                        });
                                    }
                                    return;
                                    });

                                }   

                            });                                

                            });
                        }
                    });
                    
                    

                });
            });
            
            
            
            
            
        })
    }
    
    
    

};

