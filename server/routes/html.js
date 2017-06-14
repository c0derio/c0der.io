import fs from 'fs';
import ejs from 'ejs';
import { urlHelpers } from 'auth0-extension-express-tools';

import config from '../lib/config';

export default () => {
  const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <title><%= config.TITLE %></title>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css" />
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1672/css/index.min.css" />
  <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.min.css" />
  <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>" /><% } %>
  <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="//cdn.auth0.com/extensions/auth0-delegated-admin/assets/auth0-delegated-admin.ui.<%= assets.version %>.css" /><% } %>
  <% if (assets.customCss) { %><link rel="stylesheet" type="text/css" href="<%= assets.customCss %>" /><% } %>
</head>
<body>
  <div id="app"></div>
  <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1672/js/bundle.js"></script>
  <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
  <% if (assets.vendors) { %><script type="text/javascript" src="/app/<%= assets.vendors %>"></script><% } %>
  <% if (assets.bootstrap) { %><script type="text/javascript" src="/app/<%= assets.bootstrap %>"></script><% } %>
  <script type="text/javascript">
    /* call bootstrap here */
    var loadScript = function(src, onload) {
      var script = document.createElement('script');
      script.onload = onload;
      script.src = src;
      document.head.appendChild(script);
    }
    bootstrapAuth({
        domain: window.config.AUTH0_DOMAIN,
        redirectUri: window.location.href.split("#")[0],
        responseType: 'token id_token',
        audience: window.config.C0DERIO_AUDIENCE,
        scope: 'openid profile email read:users read:achievements read:projects',
        clientID: window.config.AUTH0_CLIENT_ID
      }, 
      function(err, authResult) { 
        console.log("Carlos, results: ", err, authResult); 
        console.log("Carlos, location: ", window.location);
        loadScript("/app/<%= assets.app %>");
      });
      console.log("Done processing bootstrapAuth");
  </script>
  <% if (assets.version) { %>
  <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-delegated-admin/assets/auth0-delegated-admin.ui.vendors.<%= assets.version %>.js"></script>
  <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-delegated-admin/assets/auth0-delegated-admin.ui.<%= assets.version %>.js"></script>
  <% } %>
</body>
</html>
  `;

  return (req, res, next) => {
    if (req.url.indexOf('/api') === 0) {
      return next();
    }

    const settings = {
      C0DERIO_AUDIENCE: config('C0DERIO_AUDIENCE'),
      AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
      AUTH0_CLIENT_ID: config('AUTH0_CLIENT_ID'),
      BASE_URL: urlHelpers.getBaseUrl(req),
      BASE_PATH: urlHelpers.getBasePath(req),
      TITLE: config('TITLE'),
      BASE_API_URL: config('BASE_API_URL')
    };

    // Render from CDN.
    const clientVersion = config('CLIENT_VERSION');
    if (clientVersion) {
      return res.send(ejs.render(template, {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          version: clientVersion
        }
      }));
    }

    // Render locally.
    return fs.readFile(config('MANIFEST_FILE'), 'utf8', (err, manifest) => {
      const locals = {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          app: 'app.bundle.js',
          bootstrap: 'bootstrap.bundle.js'
        }
      };

      if (!err && manifest) {
        locals.assets = {
          customCss: config('CUSTOM_CSS'),
          ...JSON.parse(manifest)
        };
      }

      // Render the HTML page.
      res.send(ejs.render(template, locals));
    });
  };
};
