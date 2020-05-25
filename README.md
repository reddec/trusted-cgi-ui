# Trusted CGI (trusted-cgi-ui)

A [trusted CGI](https://github.com/reddec/trusted-cgi) web portal. The portal embedded to
the main binary.

If you decided to work with the UI side, please see instructions bellow.

Main principles:

1. Everything should be available local: fonts, themes whatever else should be included in a bundle.
Keep in mind environments with a heavy restricted internet.
2. Every API call can take a while and could return an error: show progress/loader during operation, use `console.error` for errors.
There is a global wrapper that will show `console.error` to user as pop-up.
3. Main flow is: create function/app/lambda -> edit content -> run. Everything else should be on sides and should not stop user.
4. No absolute path at-all: keep in mind, that platform could be launched behind one or several reverse proxies.
Use `import {baseURL} from './api` as source of truth: it uses development environment variable
or window location to determinate API URL.
5. Use Git LFS for any binary files if needed. By-default, `src/static` marked as LFS dir. SVG is not a binary =).
6. The project called Trusted CGI and it means the developers of lambda/apps trusted, so no need for paranoid checks
of user input, however, be ready for common mistakes and help as much as possible.

## Install the dependencies

```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

Be sure, that you have a running trustued-cgi binary in a background with `--dev` mode.

The dev endpoint could be overrided in `quasar.conf.js` in ` API_URL: JSON.stringify('http://127.0.0.1:3434/')`,
but please do not commit it.

### Build the app for production

```bash
quasar build
```

Do not commit production build: it will be automatically built by CI.

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
