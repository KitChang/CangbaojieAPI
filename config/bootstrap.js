/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  
    LuckyDrawCoupon.native(function (err, LuckyDrawCoupon) {
        // define index properties
        LuckyDrawCoupon.ensureIndex( { "drawCouponExpiredAt": 1 }, { expireAfterSeconds: 0 } );
        cb();

//        PrizeCoupon.native(function (err, PrizeCoupon) {
//        	PrizeCoupon.ensureIndex({"prizeCouponExpiredAt": 1}, {expireAfterSeconds: 0 });
//        	cb();
//        });
    });
    
    
    
    
};
