# c0der.io 
This is a social site for coders.

## Development
Create a server/config.json like this:
```
{
  "AUTH0_DOMAIN": "<your tenant>.auth0.com",
  "AUTH0_CLIENT_ID": "<your client ID>",
  "C0DERIO_AUDIENCE": "https://dev.c0der.io/api/",
  "MANIFEST_FILE": "/work/c0derio/c0der.io/dist/manifest2.json",
  "STATIC_DIR": "/work/c0derio/c0der.io/dist",
  "BASE_API_URL": "http://c0der.local:3002"
}
```

Add this line to your /etc/hosts file:
```
127.0.0.1 c0der.local
```

Startup the service:
```
npm i

npm run serve:dev
```

## To deploy
Initialize a heroku connection in the dist directory and copy the package.json into it

```
npm run deploy
```

## LICENSE
MIT
