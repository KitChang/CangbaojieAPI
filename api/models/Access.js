/**
* Access.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: 'access',
  attributes: {
    device: {
        model: 'device'
    },
    advertisement: {
        model: 'advertisement'
    },
    client: {
        model: 'client'
    }, 
    appUser: {
        model: 'AppUser'
    },
    locationType: {
        type: 'string',
        enum: ['公交站','公交车','电梯', '路名牌'],
        defaultsTo: ""
    }
  }
};

