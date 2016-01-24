/**
 * LuckyDrawCouponController
 *
 * @description :: Server-side logic for managing Luckydrawcoupons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var auth = require("../lib/auth");
var moment = require("moment");
module.exports = {
	find: function(req, res){
        var sessionId = req.param("session");
        auth.getUserId(sessionId, function(err, appUserId){
            if(!appUserId){
                res.status(401);
                res.json({message: "Not authenticated"});
                res.end();
                return;
            }
            LuckyDrawCoupon.find({appUser: appUserId}).populate('advertisement').populate('appUser').populate('advertisementImage').exec(function(err, results){      if(err){
                    res.status(500);
                    res.end();
                    return;
                }
                var retDrawCoupon = {};
                var retDrawCoupons = [];
                while(results.length){
                    var drawCoupon = results.pop();
                    retDrawCoupon = {};
                    retDrawCoupon.advertisement = drawCoupon.advertisement.id;
                    var imageUrlm = "";
                    if(drawCoupon.advertisementImage){
                        var image = drawCoupon.advertisementImage;
                        var publicId = drawCoupon.advertisementImage.imagePublicId;
                        var imageFormat = drawCoupon.advertisementImage.imageFormat;
                        imageUrl = "http://"+req.host+":3004/upload/"+publicId + "." + imageFormat;
                        }
                    retDrawCoupon.id = drawCoupon.id;
                    retDrawCoupon.imageUrl = imageUrl;
                    retDrawCoupon.advertisementTitle = drawCoupon.advertisement.title;
                    retDrawCoupon.appUser = drawCoupon.appUser.id;
                    retDrawCoupon.drawCouponExpiredAt = drawCoupon.drawCouponExpiredAt;
                    retDrawCoupon.createdAt = drawCoupon.createdAt;
                    retDrawCoupon.throughDevice = drawCoupon.throughDevice;
                    retDrawCoupons.push(retDrawCoupon);
                }
                res.status(200);
                res.json({message: "OK", coupons: retDrawCoupons});
                res.end();
                return;
            });
        });
    },
    destroy: function(req, res){
        LuckyDrawCoupon.destroy().exec(function(err){
            PrizeCoupon.destroy().exec(function(err){
                res.status(200);
                res.end();
                return;
            });
            
        });
        
    }
};

