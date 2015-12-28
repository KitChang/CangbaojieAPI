/**
* OrderDraw.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  identity: 'OrderDraw',
  attributes: {
    advertisement: {model: 'advertisement'},
    drawCountLowerBound: {type: 'integer'},
    drawCountUpperBound: {type: 'integer'},
    firstPrizeRange: {type: 'integer'},
    secondPrizeRange: {type: 'integer'},
    thirdPrizeRange: {type: 'integer'},
    fourthPrizeRange: {type: 'integer'},
    fifthPrizeRange: {type: 'integer'}
        
  }
};

