/**
* DeviceMonitor.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: "DeviceMonitor",
  attributes: {
    device: {type: 'string', required: true, unique: true},
    accessDate: {type: 'date', required: true},
    verifiedDate: {type: 'date', required: true},
    identifier: {type: 'string', required: true},
      
  }
};

