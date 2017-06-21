# c0der.io 
This is a social site for coders.

## Development
Create a server/config.json like this:
```
{
  "AUTH0_DOMAIN": "<your tenant>.auth0.com",
  "AUTH0_CLIENT_ID": "<your client ID>",
  "C0DERIO_AUDIENCE": "https://dev.c0der.io/api/",
  "BASE_API_URL": "http://c0der.local:3002"
}
```

Add this line to your /etc/hosts file:
```
127.0.0.1 c0der.local
```

Startup the API:
See [c0der.io API](https://github.com/c0derio/c0der.io-api)

Startup the service:
```
npm i

npm run serve:dev
```

Startup the service to emulate prod:
```
npm i
npm run build
npm run serve:prod
```

## To deploy
Initialize a heroku connection in the dist directory and copy the package.json into it (THIS README PIECE NEEDS WORK!!!)

```
npm run deploy
```

## LICENSE
MIT
