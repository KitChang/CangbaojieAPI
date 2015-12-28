

module.exports = {
  identity: 'ClientMessage',
  attributes: {
      client: {
          model: 'client',
          required: true
              },
      message: {
          type: 'string',
          required: true
      }
  }
};

