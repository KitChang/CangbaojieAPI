/**
* SystemMsg.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
//Kit
module.exports = {
  identity: 'SystemMsg',
  attributes: {
      title: {type: 'string', required: true},
      content: {type: 'string', required: true},
      createAt: {type: 'date', defaultsTo: new Date()},
      expireAt: {type: 'date'}
  }
};
//Kit end