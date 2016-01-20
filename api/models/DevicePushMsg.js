/**
* DevicePushMsg.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: 'devicePushMsg',
  attributes: {
  		device: {type: 'array', defaultsTo: []},
  		message: {type: 'string', required: true},
  		deleted: {type: 'boolean', defaultsTo: false}
  }
};