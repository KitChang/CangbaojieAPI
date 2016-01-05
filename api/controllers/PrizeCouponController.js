/**
 * PrizeCouponController
 *
 * @description :: Server-side logic for managing Prizecoupons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var auth = require("../lib/auth");
module.exports = {
	coupon: function(req, res){
        var sessionId = req.param('session');
        auth.getUserId(sessionId, function(err, appUserId){
            if(!appUserId){
                res.status(401);
                res.json({message: "Not authenticated"});
                res.end();
                return;
            }
            PrizeCoupon.find({appUser: appUserId}).populate('advertisement').exec(function(err, coupons){
                if(err){
                    res.status(500);
                    res.json({message: "Error"});
                    res.end();
                    return;
                }
                var retCoupons = [];
                var coupon;
                var retCoupon = {};
                var prizeWon;
                console.log(coupons.length);
                while(coupons.length){
                    retCoupon = {};
                    coupon = coupons.pop();
                    if(coupon.prize=="1"){
                        prizeWon = coupon.advertisement.firstPrize;
                    }else if(coupon.prize=="2"){
                        prizeWon = coupon.advertisement.secondPrize;
                    }else if(coupon.prize=="3"){
                        prizeWon = coupon.advertisement.thirdPrize;
                    }else if(coupon.prize=="4"){
                        prizeWon = coupon.advertisement.fourthPrize;
                    }else if(coupon.prize=="5"){
                        prizeWon = coupon.advertisement.fifthPrize;
                    }
                    retCoupon.prizeWon = prizeWon;
                    retCoupon.id = coupon.id;
                    retCoupon.prize = coupon.prize;
                    retCoupon.appUser = coupon.appUser;
                    retCoupon.advertisement = coupon.advertisement.id;
                    retCoupon.prizeCouponExpiredAt = coupon.prizeCouponExpiredAt;
                    retCoupon.redeemLocation = coupon.redeemLocation;
                    retCoupon.pickAt = coupon.pickAt;
                    retCoupon.picked = coupon.picked;
                    retCoupon.createdAt = coupon.createdAt;
                    retCoupon.throughDevice = coupon.throughDevice;
                    retCoupons.push(retCoupon);
                }
                res.status(200);
                res.json({message: "OK", coupons: retCoupons});
            });
        });
    },
    authorization: function(req, res){
        var sessionId = req.param('session');
        var couponId = req.param('coupon');
        var highCode = req.param('highCode');
        var lowCode = req.param('lowCode');
        auth.getUserId(sessionId, function(err, appUserId){
            if(!appUserId){
                res.status(401);
                res.json({message: "Not authenticated"});
                res.end();
                return;
            }
            PrizeCoupon.findOne({id: couponId}).exec(function(err, couponFound){
                if(err){
                    res.status(500);
                    res.end();
                    return;
                }
                if(!couponFound){
                    res.status(400);
                    res.json({message: "Coupon not found"});
                    res.end();
                    return;
                }
                var wonPrize = couponFound.prize;
                var advertisementId = couponFound.advertisement;
                advertisement.findOne({id: advertisementId}).exec(function(err, adFound){
                    if(err){
                        res.status(500);
                        res.end();
                        return;
                    }
                    if(!adFound){
                        res.status(400);
                        res.json({message: "Advertisement not found"});
                        res.end();
                        return;
                    }
                    var ad_highCode = adFound.highCode;
                    var ad_lowCode = adFound.lowCode;
                    var authorized = false;
                    if(wonPrize=="3"||wonPrize=="4"||wonPrize=="5"){
                        if(lowCode==ad_lowCode)
                            authorized = true;
                    }else if(wonPrize=="1"||wonPrize=="2"){
                        if(highCode==ad_highCode&&lowCode==ad_lowCode)
                            authorized = true;
                    }
                    if(authorized){
                        PrizeCoupon.update({id: couponId}, {picked: true, pickAt: new Date()}).exec(function(err){
                            if(err){
                                res.status(500);
                                res.end();
                                return;
                            }
                            if (wonPrize=="1") {
                                console.log(advertisementId + " "+adFound.redeem1PrizeQuantity+1);
                                advertisement.update({id: advertisementId}, {redeem1PrizeQuantity: adFound.redeem1PrizeQuantity+1}).exec(function(){
                                    
                                });
                            }
                            if (wonPrize=="2") {
                                console.log(advertisementId + " "+adFound.redeem2PrizeQuantity+1);
                                advertisement.update({id: advertisementId}, {redeem2PrizeQuantity: adFound.redeem2PrizeQuantity+1}).exec(function(){
                                    
                                });
                            }
                            if (wonPrize=="3") {
                                console.log(advertisementId + " "+adFound.redeem3PrizeQuantity+1);
                                advertisement.update({id: advertisementId}, {redeem3PrizeQuantity: adFound.redeem3PrizeQuantity+1}).exec(function(){
                                    
                                });
                            }
                            if (wonPrize=="4") {
                                console.log(advertisementId + " "+adFound.redeem4PrizeQuantity+1);
                                advertisement.update({id: advertisementId}, {redeem4PrizeQuantity: adFound.redeem4PrizeQuantity+1}).exec(function(){
                                    
                                });
                            }
                            if (wonPrize=="5") {
                                console.log(advertisementId + " "+adFound.redeem5PrizeQuantity+1);
                                advertisement.update({id: advertisementId}, {redeem5PrizeQuantity: adFound.redeem5PrizeQuantity+1}).exec(function(){
                                    
                                });
                            }
                            
                            res.status(201);
                            res.json({message: "Redemption authorized"});
                            res.end();
                            return;
                        });
                        
                    }else{
                        res.status(204);
                        res.end();
                        return;
                    }
                });
            });
           
            
        });
    }
};

