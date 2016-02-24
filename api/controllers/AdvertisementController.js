/**
 * AdvertisementController
 *
 * @description :: Server-side logic for managing advertisements
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var auth = require('../lib/auth');
var logger = sails.config.log4js.getLogger('cangbaojie');
var moment = require('moment');
var Device = require('../lib/device');
var baseUrl = "http://api.ibeacon-macau.com:3004/upload/";
module.exports = {
    find4: function(req, res){
        var deviceId = req.param('device');
        var sessionId = req.param('session');
        if(!sessionId){
            sessionId = "-1";
        }
        if(!deviceId){
            res.status(400); //not found
            res.end();
            return;
        }
        auth.getUserId(sessionId, function(err, appUserId){
            if(deviceId.indexOf(",")!=-1){
                deviceId = deviceId.split(",");
            }
            if (Object.prototype.toString.call(deviceId) !== '[object Array]') deviceId = [deviceId]; 
            var pushMsg = "藏宝街为您发现神祕宝藏，点击免费抽奖，海量奖品等你拿！";
            if(deviceId.length==1) {
                devicePushMsg.findOne({device: deviceId[0]}).exec(function (err, pushmsg) {
                    // body...
                    console.log(pushmsg);
                    if (pushmsg) {
                        pushMsg = pushmsg.message;
                    };
                });
            }
            advertisement.find({device: deviceId, deleted: false, status: "publish"}).populate('advertisementImage').sort({'pricePerClick': 'DESC'}).exec(function(err, results){
                if (err) {
                    res.status(500);
                    res.end();
                    return;
                }
                if(!results){
                    res.status(400);
                    res.json({message: "Advertisements not found"});
                    res.end();
                    return;
                }
                var advertisementIdArr = [];
                for (var i = 0; i<results.length; i++) {
                    advertisementIdArr.push(results[i].id);
                }
                if(appUserId){
                    LuckyDrawCoupon.find({advertisement:advertisementIdArr, appUser: appUserId}).populate('advertisement').exec(function(err, lDCoupons){
                    if(err){
                        res.status(500);
                        res.end();
                        return;
                    }   
                    var lDCouponAdArr = []; var ldCouponIdsArr = [];
                    for(var i = 0; i < lDCoupons.length; i++){
                        lDCouponAdArr.push(lDCoupons[i].advertisement.id);
                    }
                    var luckyDrawCouponArr = [];
                    var luckyDrawCouponObj = {};
                    var lDCouponToRemove = [];
                    for (var i = 0; i<results.length; i++) {
                        for(var j=0; j<lDCoupons.length; j++){
                            if(results[i].id == lDCoupons[j].advertisement.id)
                                lDCouponToRemove.push(lDCoupons[j].id);
                        }
                    }
                    for (var i = 0; i<results.length; i++) {
                        luckyDrawCouponObj = {};
                        for (var j=0; j<deviceId.length; j++) {
                            if (results[i].device.indexOf(deviceId[j]) != -1) {
                                luckyDrawCouponObj.throughDevice = deviceId[j];
                            }
                        }
                        luckyDrawCouponObj.advertisement = results[i].id;
                        luckyDrawCouponObj.appUser = appUserId;
                        if(results[i].advertisementImage)
                            luckyDrawCouponObj.advertisementImage = results[i].advertisementImage.id;
                        else{
                            res.status(500);
                            res.end();
                            logger.info('Advertisement ' + results[i].id + " has no image");
                            return;
                        }
                        var drawCouponExpiredTime = results[i].drawCouponExpiredTime;
                        var date = moment().add(drawCouponExpiredTime, "seconds").toDate();
                        luckyDrawCouponObj.drawCouponExpiredAt = date;
                        luckyDrawCouponArr.push(luckyDrawCouponObj);
                    }
                        console.log(lDCouponToRemove+lDCouponToRemove.length);
                    if(lDCouponToRemove.length==0)
                        lDCouponToRemove = ["-1"];
                    LuckyDrawCoupon.destroy({id:lDCouponToRemove }).exec(function(err){
                        if(err){
                            res.status(500);
                            res.end();
                            return;
                        }
                        LuckyDrawCoupon.create(luckyDrawCouponArr).exec(function(err){
                        if(err){
                            res.status(500);
                            res.end();
                            return;
                        }
                        var returnAds = [];
                        for (var i = 0; i<results.length; i++) {
                            var row = {};
                            row.title = results[i].title;
                            row.id = results[i].id; 
                            for (var j=0; j<deviceId.length; j++) {
                                if (results[i].device.indexOf(deviceId[j]) != -1) {
                                    row.throughDevice = deviceId[j];
                                }
                            }
                            var imageUrl = "";
                            if(results[i].advertisementImage){
                                var publicId = results[i].advertisementImage.imagePublicId;
                                var imageFormat = results[i].advertisementImage.imageFormat;
                                imageUrl = baseUrl+publicId + "." + imageFormat;
                                logger.info('User ' + appUserId + " received advertisements through device" + deviceId );
                            }
                            row.imageUrl = imageUrl;
                            returnAds.push(row);
                        }
                        res.json({ message: pushMsg, advertisements: returnAds}); 
                        return;
                        });
                    });
                }); 
                }else{
                    var returnAds = [];
                    for (var i = 0; i<results.length; i++) {
                        var row = {};
                        row.title = results[i].title;
                        row.id = results[i].id; 
                        for (var j=0; j<deviceId.length; j++) {
                            if (results[i].device.indexOf(deviceId[j]) > -1) {
                                row.throughDevice = deviceId[j];
                            }
                        }
                        var imageUrl = "";
                        if(results[i].advertisementImage){
                            var publicId = results[i].advertisementImage.imagePublicId;
                            var imageFormat = results[i].advertisementImage.imageFormat;
                            imageUrl = baseUrl+publicId + "." + imageFormat;
                            logger.info('User ' + appUserId + " received advertisements of device" + deviceId );
                        }
                        row.imageUrl = imageUrl;
                        returnAds.push(row);
                    }
                    res.json({ message: pushMsg, advertisements: returnAds}); 
                    return;
                }
            })
        });
    },
    find: function(req, res){
        var deviceId = req.param('device');
        var sessionId = req.param('session');
        if(!sessionId){
            sessionId = "-1";
        }
        if(!deviceId){
            res.status(400); //not found
            res.end();
            return;
        }
        auth.getUserId(sessionId, function(err, appUserId){
            if(deviceId.indexOf(",")!=-1){
                deviceId = deviceId.split(",");
            }
            if (Object.prototype.toString.call(deviceId) !== '[object Array]') deviceId = [deviceId]; 
            var adDevice = {};
            device.find({id: deviceId}).exec(function(err, devicesWithAd){
                if(err){
                    res.status(400); //not found
                    res.end();
                    return;
                }
                var adIdArr, deviceWithAd;
                while(devicesWithAd.length){
                    deviceWithAd = devicesWithAd.pop();
                    adIdArr = deviceWithAd.advertisement;
                    while(adIdArr.length){
                        adDevice[adIdArr.pop()] = deviceWithAd.id;
                    }
                }
                adIdToFind = Object.keys(adDevice);
                advertisement.find({id: adIdToFind, deleted: false, status: "publish"}).populate('advertisementImage').populate('client').exec(function(err, results){
                if (err) {
                    res.status(500);
                    res.end();
                    return;
                }
                if(!results){
                    res.status(400);
                    res.json({message: "Advertisements not found"});
                    res.end();
                    return;
                }
                var adIdTofind2 = [];
                for(var i=0; i<results.length; i++){
                    if(results[i].client.account > -50)
                        adIdToFind2.push(results[i].id);
                }
                adIdToFind = adIdToFind2;
                if(appUserId){
                    LuckyDrawCoupon.find({advertisement:addIdToFind, appUser: appUserId}).populate('advertisement').exec(function(err, lDCoupons){
                    if(err){
                        res.status(500);
                        res.end();
                        return;
                    }   
                    var lDCouponAdArr = []; var ldCouponIdsArr = [];
                    for(var i = 0; i < lDCoupons.length; i++){
                        lDCouponAdArr.push(lDCoupons[i].advertisement.id);
                    }
                    var luckyDrawCouponArr = [];
                    var luckyDrawCouponObj = {};
                    var lDCouponToRemove = [];
                    for (var i = 0; i<addIdToFind.length; i++) {
                        for(var j=0; j<lDCoupons.length; j++){
                            if(addIdToFind[i] == lDCoupons[j].advertisement.id)
                                lDCouponToRemove.push(lDCoupons[j].id);
                        }
                    }
                    for (var i = 0; i<results.length; i++) {
                        luckyDrawCouponObj = {};
                        for (var j=0; j<deviceId.length; j++) {
                            if (results[i].device.indexOf(deviceId[j]) != -1) {
                                luckyDrawCouponObj.throughDevice = deviceId[j];
                            }
                        }
                        luckyDrawCouponObj.advertisement = results[i].id;
                        luckyDrawCouponObj.appUser = appUserId;
                        if(results[i].advertisementImage)
                            luckyDrawCouponObj.advertisementImage = results[i].advertisementImage.id;
                        else{
                            res.status(500);
                            res.end();
                            logger.info('Advertisement ' + results[i].id + " has no image");
                            return;
                        }
                        var drawCouponExpiredTime = results[i].drawCouponExpiredTime;
                        var date = moment().add(drawCouponExpiredTime, "seconds").toDate();
                        luckyDrawCouponObj.drawCouponExpiredAt = date;
                        luckyDrawCouponArr.push(luckyDrawCouponObj);
                    }
                        
                    if(lDCouponToRemove.length==0)
                        lDCouponToRemove = ["-1"];
                    LuckyDrawCoupon.destroy({id:lDCouponToRemove }).exec(function(err){
                        if(err){
                            res.status(500);
                            res.end();
                            return;
                        }
                        LuckyDrawCoupon.create(luckyDrawCouponArr).exec(function(err){
                        if(err){
                            res.status(500);
                            res.end();
                            return;
                        }
                        var returnAds = [];
                        for (var i = 0; i<results.length; i++) {
                            if(results[i].client.account < -50)
                                continue;
                            var row = {};
                            row.title = results[i].title;
                            row.id = results[i].id;
                            row.throughDevice = adDevice[row.id];
                            var imageUrl = "";
                            if(results[i].advertisementImage){
                                var publicId = results[i].advertisementImage.imagePublicId;
                                var imageFormat = results[i].advertisementImage.imageFormat;
                                imageUrl = baseUrl+publicId + "." + imageFormat;
                                logger.info('User ' + appUserId + " received advertisements through device" + deviceId );
                            }
                            row.imageUrl = imageUrl;
                            returnAds.push(row);
                        }
                        res.json({ message: "Advertisements returned", advertisements: returnAds}); 
                        return;
                        });
                    });
                }); 
                }else{
                    var returnAds = [];
                    for (var i = 0; i<results.length; i++) {
                        var row = {};
                        row.title = results[i].title;
                        row.id = results[i].id;
                        row.throughDevice = adDevice[row.id];
                        if(results[i].client.account < -50)
                            continue;

                        var imageUrl = "";
                        if(results[i].advertisementImage){
                            var publicId = results[i].advertisementImage.imagePublicId;
                            var imageFormat = results[i].advertisementImage.imageFormat;
                            imageUrl = baseUrl+publicId + "." + imageFormat;
                            logger.info('User ' + appUserId + " received advertisements of device" + deviceId );
                        }
                        row.imageUrl = imageUrl;
                        returnAds.push(row);
                    }
                    res.json({ message: "Advertisements returned", advertisements: returnAds}); 
                    return;
                }
                
                })
            });
        });
    },
    findOne: function(req, res){

        var adId = req.param("advertisement");
        var deviceId = req.param("device");
        var sessionId = req.param("session");
        if(!adId||!deviceId){
            res.status(400);
            res.end();
            return;
        }   
        if(!sessionId){
            sessionId = "-1";
        }
        auth.getUserId(sessionId, function(err, appUserId){
            Device.findOne(deviceId, function(err, dev){
                if(err){
                    res.status(500);
                    res.end();
                    return;
                }
                if(dev==null){
                    res.status(400);
                    res.end();
                    return;
                }
                advertisement.findOne({id: adId, device: deviceId, status: "publish"}).populate('advertisementImage').populate('client').populate('shareImage').exec(function(err, ad){
                        if(err){
                            res.status(500);
                            res.end();
                            return;
                        }
                        if(!ad){
                            res.status(400);
                            res.end();
                            return;
                        }
                        var imageUrl = "";
                        if(ad.advertisementImage){
                            var publicId = ad.advertisementImage.imagePublicId;
                            var imageFormat = ad.advertisementImage.imageFormat;
                            imageUrl = baseUrl+publicId + "." + imageFormat;
                        }
                        var shareImageUrl = "";
                        if(ad.shareImage){
                            var publicId = ad.shareImage.imagePublicId;
                            var imageFormat = ad.shareImage.imageFormat;
                            shareImageUrl = baseUrl+publicId + "." + imageFormat;
                        }

                        var retAd = {};
                        retAd.imageUrl = imageUrl;
                        retAd.shareImageUrl = shareImageUrl;
                        retAd.title = ad.title;
                        retAd.description = ad.description;
                        retAd.category = ad.category;
                        retAd.effectiveDate = ad.effectiveDate;
                        retAd.expiredDate = ad.expiredDate;
                        retAd.drawType = ad.drawType;
                        retAd.numberOfPrize = ad.numberOfPrize;
                        retAd.firstPrize = ad.firstPrize;
                        retAd.secondPrize = ad.secondPrize;
                        retAd.thirdPrize = ad.thirdPrize;
                        retAd.fourthPrize = ad.fourthPrize;
                        retAd.fifthPrize = ad.fifthPrize;
                        retAd.quiz = ad.quiz;
                        retAd.drawPerformInterval = ad.drawPerformInterval;
                        retAd.indexUrl = ad.indexUrl;
                        retAd.mobilePhone = ad.client.mobilePhone;
                        retAd.shareTitle = ad.shareTitle;
                        retAd.shareContent = ad.shareContent;
                        retAd.shareLink = ad.shareLink;
                        res.json(retAd); 
                        res.end();
                        now = moment().toDate();
                        DeviceMonitor.findOne({device: deviceId}).exec(function(err, deviceMon){
                            var identifier = "";
                                if(dev.identifier!=undefined&&dev.identifier!="")
                                    identifier = dev.identifier;
                            if(!deviceMon){
                                DeviceMonitor.create({device: deviceId, accessDate: now, verifiedDate: now, identifier: identifier}).exec(function(){});
                            }else{
                                DeviceMonitor.update({device: deviceId}, {accessDate: now, identifier: identifier}).exec(function(){});
                            }
                        });
                        var clientid = ad.client.id;
                        var accessCount = ad.client.accessCount;
                        accessCount++;
                        var pricePerClick = ad.pricePerClick;
                        var account = ad.client.account;
                        account = account - pricePerClick;
                        var accountMinimum = sails.config.app.accountLowerBound;
                        accountMinimum = parseFloat(accountMinimum);
                        if(account < accountMinimum ){
                            ad.status = "disabled";
                            ClientMessage.create({message: "用户金额低于－50，广告失效，请充值", client: clientid}.exec(function(){}));
                        }
                        client.update({id: ad.client.id}, {accessCount: accessCount, account: account}).exec(function(err){});
                        ad.accessCount = ad.accessCount + 1;
                        
                        ad.save(function(err){});
                        var state, city, region, area, category;
                        state = (!dev.state) ? "" : dev.state;
                        city = (!dev.city) ? "" : dev.city;
                        region = (!dev.region) ? "" : dev.region;
                        street = (!dev.street) ? "" : dev.street;
                        category = (!ad.category) ? "" : ad.category;
                        
                        if(appUserId){
                            logger.info("User "+appUserId+" received advertisement "+adId);
                            access.create({appUser: appUserId, device: deviceId, advertisement: adId, category: category, state: state, city: city, region: region, street: street, client: ad.client, locationType: dev.locationType }).exec(function(err, result){
                        });
                        } else {
                            access.create({appUser: '569cfb0a598d660b083bb5d2', device: deviceId, advertisement: adId, category: category, state: state, city: city, region: region, street: street, client: ad.client, locationType: dev.locationType }).exec(function(err, result){
                        });
                        }
                        return;
                });

            });
        });
    }
    
    
                
           
    
    
    
}

