/**
* AppUser.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: 'AppUser',
  attributes: {
      phoneVerified : {
          type: 'boolean',
          defaultsTo: false, 
          required: true
      },
      sex: {
          type: 'string',
          enum: ['1', '2', '0'],
          required: true
      },
      username: {
          type: 'string', 
          required: true
      },
      phone: {
          type: 'string',
          defaultsTo: ''
      },
      authType: {
          type: 'string',
          enum: ['local', 'wechat'],
          required: true
      },
      password: {
          type: 'string',
          defaultsTo: ''
      },
      verificationExpiredAt: {
          type: 'date'
      }
  }
};

