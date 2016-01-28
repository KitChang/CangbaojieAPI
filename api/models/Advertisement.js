/**
* Advertisement.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: 'advertisement',
  attributes: {
      title: {
          type: 'string',
          required: true
      },
      description: {
          type: 'string',
          required: true
      },
      category: {
          type: 'string',
          required: true
      },
      expiredDate: {
          type: 'date',
          required: true
      },
      effectiveDate: {
          type: 'date',
          required: true
      },
      drawPerformInterval: {
          type: 'integer',
          required: true
      },
      drawPerformInterval_day: {
          type: 'integer',
          required: true
      },
      drawPerformInterval_hour: {
          type: 'integer',
          required: true
      },
      drawPerformInterval_minute: {
          type: 'integer',
          required: true
      },
      drawPerformInterval_second: {
          type: 'integer',
          required: true
      },
      drawCouponExpiredTime_day: {
          type: 'integer',
          required: true
      },
      drawCouponExpiredTime_hour: {
          type: 'integer',
          required: true
      },
      drawCouponExpiredTime_minute: {
          type: 'integer',
          required: true
      },
      drawCouponExpiredTime_second: {
          type: 'integer',
          required: true
      },
      drawCouponExpiredTime: {
          type: 'integer',
          required: true
      },
      pricePerClick: {
          type: 'float',
          defaultsTo: 0.00,
          required: true,
      },
      device: {
        type: 'array',
        defaultsTo: []
      },
      client: {
          model: 'client',
          required: true
      },
      expiredDate: {
          type: 'date',
          required: true
      },
      effectiveDate: {
          type: 'date',
          required: true
      }, 
      advertisementImage: {
          model: 'AdvertisementImage'
      }, 
      probabilityDraw: {
          model: 'ProbabilityDraw'
      },
      highCode: {
          type: 'string',
          defaultsTo: ''
      },
      lowCode: {
          type: 'string',
          defaultsTo: ''
      },
      drawCount: {type: 'integer', defaultsTo: 0, required: true},
      drawType: {
          type: 'string',
          enum: ['order', 'probability'],
          required: true
      },
      firstPrize: {
          type: 'string',
          defaultsTo: ""
      },
      secondPrize: {
          type: 'string',
          defaultsTo: ""
      },
      thirdPrize: {
          type: 'string',
          defaultsTo: ""
      },
      fourthPrize: {
          type: 'string',
          defaultsTo: ""
      },
      fifthPrize: {
          type: 'string',
          defaultsTo: ""
      },
      firstPrizeQuantity: {
          type: 'integer',
          defaultsTo: 0
      },
      secondPrizeQuantity: {
          type: 'integer',
          defaultsTo: 0
      },
      thirdPrizeQuantity: {
          type: 'integer',
          defaultsTo: 0,
          required: true
      },
      fourthPrizeQuantity: {
          type: 'integer',
          defaultsTo: 0,
          required: true
      },
      fifthPrizeQuantity: {
          type: 'integer',
          defaultsTo: 0,
          required: true
      },
      numberOfPrize: {
          type: 'integer',
          required: true
      },
      redeem1PrizeQuantity: {
          type: 'integer', defaultsTo: 0, required: true
      },
      redeem2PrizeQuantity: {
          type: 'integer', defaultsTo: 0, required: true
      },
      redeem3PrizeQuantity: {
          type: 'integer', defaultsTo: 0, required: true
      },
      redeem4PrizeQuantity: {
          type: 'integer', defaultsTo: 0, required: true
      },
      redeem5PrizeQuantity: {
          type: 'integer', defaultsTo: 0, required: true
      },
      firstPrizeQuantityRemain: {
          type: 'integer',
          defaultsTo: 0,
          required: true
      },
      secondPrizeQuantityRemain: {
          type: 'integer',
          defaultsTo: 0,
          required: true
      },
      thirdPrizeQuantityRemain: {
          type: 'integer',
          defaultsTo: 0,
          required: true
      },
      fourthPrizeQuantityRemain: {
          type: 'integer',
          defaultsTo: 0,
          required: true
      },
      fifthPrizeQuantityRemain: {
          type: 'integer',
          defaultsTo: 0,
          required: true
      },
      prizeCouponExpiredDuration: {
          type: 'integer',
          defaultsTo: 0,
          required: true
      },
      prizeCouponExpiredDate: {
          type: 'date',
          defaultsTo: new Date(),
          required: true
      },
      prizeCouponExpiredType: {
          type: 'string',
          enum: ['duration', 'date', ''],
          defaultsTo: ''
      },
      companyIntroduction: {
          type: 'string',
          defaultsTo: "",
      },
      redeemLocation: {
          type: 'string',
          defaultsTo: "",
      },
      accessCount: {
          type: 'integer',
          defaultsTo: 0,
          required: true
      },
      status: {
          type: 'string',
          enum: ['draft', 'publish', 'disabled'],
          defaultsTo: 'draft'
      },
      shareImage: {
          model: 'ShareImage'
      }
      
  }
    
};

