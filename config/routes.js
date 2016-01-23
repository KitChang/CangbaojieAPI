/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },
  '/draw/probability': {
    controller: "LuckyDrawController",
    action: 'probabilityDraw'
  },
  '/draw/order': {
    controller: "LuckyDrawController",
    action: 'orderDraw'
  },
  '/advertisement': {
      controller: "AdvertisementController",
      action: 'findOne'
  },
  '/advertisements': {
      controller: 'AdvertisementController',
      action: 'find'
  },
  /*
  '/draw/test': {
      controller: 'LuckyDrawController',
      action: 'test'
  },*/
 '/prize/coupon': {
     controller: 'PrizeCouponController',
     action: 'coupon'
 },
 '/prize/authorization': {
     controller: 'PrizeCouponController',
     action: 'authorization'
 },
 '/luckydrawcoupons': {
     controller: 'LuckyDrawCouponController',
     action: 'find'
 }
 //Kit
 ,'GET /version/:device': {
     controller: 'VersionController',
     action: 'getVersion'
 }
 ,'POST /phone-register': {
    controller: 'AppUserController',
    action: 'phoneRegister'
 }
 ,'POST /phone-verify': {
    controller: 'AppUserController',
    action: 'phoneVerify'
 }
 ,'POST /change-password': {
    controller: 'AppUserController',
    action: 'changePassword'
 }
 ,'POST /reset-password': {
    controller: 'AppUserController',
    action: 'resetPassword'
 }
 ,'POST /reset-verify': {
    controller: 'AppUserController',
    action: 'resetVerify'
 }
 ,'GET /system-msg': {
    controller: 'SystemMsgController',
    action: 'getMsg'
 }
 ,'POST /system-msg': {
    controller: 'SystemMsgController',
    action: 'createMsg'
 }
//Kit end

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
