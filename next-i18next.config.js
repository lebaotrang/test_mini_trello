const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en'],
  },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: true, // process.env.NODE_ENV === 'development',
};
