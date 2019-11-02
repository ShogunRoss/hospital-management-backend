# Hospital Management Project Build with Nodejs Apollo-GraphQL Mongoose MongoDB

## Steps to run this project:

1. Run `npm i` or `yarn` command

2. Create your own .env to define your own environment variables and it should contains:

```
MONGO_DB=<value>
ACCESS_TOKEN_SECRET=<value>
REFRESH_TOKEN_SECRET=<value>
CONFIRM_TOKEN_SECRET=<value>
PASSWORD_TOKEN_SECRET=<value>
FRONTEND_URL=http://localhost:3000
GMAIL_USER=hydroponicshubproject@gmail.com
GMAIL_PASSWORD=Bio-Mech Lab
```

IMPORTANT: `<value>` should be created by yourself.

3. Run `npm start` or `yarn start` command

## TODO

- ✔️ (untested) Upload and Store Avatar for user.
- ✔️ Create QRCode image while add device and store it somewhere.
- ✔️ IMPORTANT: Return standardized error pattern for client to handle.
- Write unit tests
- Able to read excel files
