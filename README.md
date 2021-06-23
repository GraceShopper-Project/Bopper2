# Grace Bopper
[![CircleCI](https://circleci.com/gh/GraceShopper-Project/Bopper2/tree/main.svg?style=svg)](https://circleci.com/gh/GraceShopper-Project/Bopper2/tree/main)

WE SELL AUDIO GEAR.

## Setup

### Prerequisites:
* Node >= 14
* NPM
* PostgreSQL server

Here's what's necessary to run the app locally:

* `npm install`
* Create two postgres databases:

_These commands will create both your **development** and **test** databases_

```shell
createdb bopper-shopper
createdb bopper-shopper-test
```

* By default, running `npm test` will use your test database, while
  regular development uses development database

## Start

Sync and seed your database by running `npm run seed`. Running `npm run start:dev` will make great things happen!

- start:dev will both start your server and build your client side files using webpack
- start:dev:logger is the same as start:dev, but you will see your SQL queries (can be helpful for debugging)
- start:dev:seed will start your server and also seed your database (this is useful when you are making schema changes and you don't want to run your seed script separately)

