/**
* Client.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: 'client',
  attributes: {
      name: {type: 'string'},
      payDeadline: {type: 'date'},
      paidDate: {type: 'date'},
      account: {type: 'float', defaultsTo: 0.0, required: true},
      accessCount: {type: 'integer', defaultsTo: 0, required: true}
      
  }
};

