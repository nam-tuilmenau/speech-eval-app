module.exports = function (api) {
  api.cache(true);
  const presets = [ 
    [
      '@babel/preset-env',
      {
        'modules': false
      }
    ]
   ]
  const plugins = [ 
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-transform-runtime',
      {
        'corejs': 3
      }
    ]
   ]

  return {
    presets,
    plugins
  };
}