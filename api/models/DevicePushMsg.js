/**
* DevicePushMsg.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: 'devicePushMsg',
  attributes: {
  		device: {type: 'string', defaultsTo: '藏宝街为您发现神祕宝藏，点击免费抽奖，海量奖品等你拿！'},
  		message: {type: 'string', required: true},
  		deleted: {type: 'boolean', defaultsTo: false}
  }
};