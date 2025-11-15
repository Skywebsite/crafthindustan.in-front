const path = require('path');

const backendPath = path.resolve(__dirname, 'src', 'backend');

module.exports = {
  webpack: {
    alias: {
      '@backend': backendPath,
    },
    configure: (webpackConfig) => {
      // Remove ModuleScopePlugin to allow imports from outside src/
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );
      
      if (scopePluginIndex !== -1) {
        webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      }
      
      // Ensure resolve object exists
      if (!webpackConfig.resolve) {
        webpackConfig.resolve = {};
      }
      
      // Set alias - webpack will automatically resolve @backend/auth to backendPath/auth
      if (!webpackConfig.resolve.alias) {
        webpackConfig.resolve.alias = {};
      }
      
      // Set the alias to point to the backend directory
      // When importing @backend/auth, webpack will resolve it to backendPath/auth.js
      webpackConfig.resolve.alias['@backend'] = backendPath;
      
      // Ensure .js extension is in the extensions array
      if (!webpackConfig.resolve.extensions) {
        webpackConfig.resolve.extensions = ['.js', '.jsx', '.json'];
      } else {
        // Make sure .js is first
        if (!webpackConfig.resolve.extensions.includes('.js')) {
          webpackConfig.resolve.extensions.unshift('.js');
        }
      }
      
      // Ensure modules array includes node_modules
      if (!webpackConfig.resolve.modules) {
        webpackConfig.resolve.modules = ['node_modules'];
      }
      
      console.log('CRACO: @backend alias set to:', backendPath);
      console.log('CRACO: Backend path exists:', require('fs').existsSync(backendPath));
      console.log('CRACO: Resolve extensions:', webpackConfig.resolve.extensions);
      
      return webpackConfig;
    },
  },
};

