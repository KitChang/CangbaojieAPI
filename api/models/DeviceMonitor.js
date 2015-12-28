/**
* DeviceMonitor.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: "DeviceMonitor",
  attributes: {
    device: {type: 'string', required: true, unique: true, primaryKey: true},
    accessDate: {type: 'date', required: true},
    verified: {type: 'boolean', defaultsTo: false, required: true}
      
  }
};

