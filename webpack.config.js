const path = require('path');

module.exports = {
  // ... other configurations ...
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src/')
    }
  }
};
