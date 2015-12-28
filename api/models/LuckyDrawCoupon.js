/**
* LuckyDrawCoupon.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: 'LuckyDrawCoupon',
  attributes: {
      perform_timeout: { type: 'date'},
      advertisement: {model: 'advertisement'},
      advertisementImage: {model: 'AdvertisementImage'},
      appUser: {model: "AppUser"},
      expires: {type: 'date'}
  }
};
