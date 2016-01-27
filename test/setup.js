import jsdom from 'jsdom';

global.document = jsdom.jsdom(
  '<html><body><div></div></body></html>', {
    features : {
      QuerySelector : true
    }
  });
global.window = document.parentWindow;

global.navigator = {
  userAgent: 'node.js'
};
