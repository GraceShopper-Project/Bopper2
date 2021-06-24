'use strict'
const {db, models: {User, Order, Product, OrderItem} } = require('../server/db')
const sequelize = require('sequelize')
const Op = sequelize.Op
const debug = require('debug')
const logger = debug('app:test:seed')

// Seed Data
const Users = [{
  username: 'adrienne',
  name: 'Adrienne',
  password: 'adrienne100',
  email: 'adriennescutellaro@gmail.com',
  isAdmin: true,
  cartId: 1,
}, {
  username: 'gracejones',
  name: 'Grace Jones',
  password: 'style',
  email: 'grace@bossbitch.net',
  isAdmin: false,
  cartId: 2,
}, {
  username: 'davidbowie',
  name: 'David Bowie',
  password: 'stardust',
  email: 'david@bowie.net',
  isAdmin: false,
  cartId: 15,
}, {
  username: 'annielennox',
  name: 'Annie Lennox',
  password: 'littlebird',
  email: 'annie@eurythmics.com',
  isAdmin: false,
  cartId: 6,
}, {
  username: 'prince',
  name: 'Prince',
  password: 'paisley',
  email: 'prince@therevolution.com',
  isAdmin: false,
  cartId: 16,
}, {
  username: 'ladygaga',
  name: 'Lady Gaga',
  password: 'joanne',
  email: 'stephanie@gaga.com',
  isAdmin: false,
  cartId: 9,
}, {
  username: 'tinaturner',
  name: 'Tina Turner',
  password: 'simplythebest',
  email: 'tina@turner.com',
  isAdmin: false,
  cartId: 10,
}, {
  username: 'stevienicks',
  name: 'Stevie Nicks',
  password: 'sorceress',
  email: 'snicks@fleetwood.mac',
  isAdmin: false,
  cartId: 11,
}, {
  username: 'georgemichael',
  name: 'George Michael',
  password: 'fatherfigure',
  email: 'george@wham.com',
  isAdmin: false,
  cartId: 12,
}, {
  username: 'samsmith',
  name: 'Sam Smith',
  password: 'theonlyone',
  email: 'sam@samsmith.com',
  isAdmin: false,
  cartId: 13,
}, {
  username: 'beyonce',
  name: 'Beyonce',
  password: 'queen',
  email: 'bey@beyhive.com',
  isAdmin: false,
  cartId: 14,
}]

const Products = [{
  name: 'Studio Monitors',
  description: 'Clean and precise for mixing.',
  price: 29999,
  imageUrl: 'https://www.soundguys.com/wp-content/uploads/2020/06/PreSonus-Eris-3.5-studio-monitor-pair-lifestyle-image.jpg'
}, {
  name: 'Subwoofer',
  description: 'So necessary.',
  price: 39999,
  imageUrl: 'https://www.hifihut.ie/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/k/l/klipsch_r-100sw_subwoofer_-_black_a.jpg'
}, {
  name: 'Center Channel Speaker',
  description: 'Hear that dialogue nice and clear.',
  price: 19999,
  imageUrl: 'https://www.mtx.com/c/thumbs/0004384_dcm-tfe60c-65-inch-2-way-100w-rms-8-ohm-center-channel-speaker-cherry-finish.jpeg'
}, {
  name: 'Surround Speakers',
  description: 'These are how you know spaceships are flying left to right.',
  price: 24999,
  imageUrl: 'https://www.techgadgetguides.com/wp-content/uploads/2019/07/1-9.jpg'
}, {
  name: 'Dolby Atmos Ceiling Speakers',
  description: 'These fire up when the movie monsters are looming overhead.',
  price: 34999,
  imageUrl: 'https://audioxpress.com/assets/upload/images/TriadSpeakersBronzeInWallSubsWeb.jpg'
}, {
  name: 'Fancy Headphones',
  description: 'More money than you should probably spend, but you will feel really fancy.',
  price: 99999,
  imageUrl: 'https://www.dailyhawker.com/wp-content/uploads/2020/08/Audeze-LCD-3-most-Expensive-Headphones-in-the-World-1024x1024.jpg'
}, {
  name: 'Cute Bluetooth Speaker for Kids',
  description: 'It looks cute, sounds okay, and is going to drive you crazy.',
  price: 4999,
  imageUrl: 'https://wws-weblinc.netdna-ssl.com/product_images/jbl-jr-pop-portable-bluetooth-speaker-for-kids/Pink/5c3357f8e9b6cc4f5806bef9/zoom.jpg'
}, {
  name: 'Bluetooth Beach Speaker',
  description: 'It sands nice!',
  price: 9999,
  imageUrl: 'https://www.bassheadspeakers.com/wp-content/uploads/2020/03/Best-Portable-Bluetooth-Speakers-1.jpg'
}]

const Orders = [{
  status: 'open',
  userId: 1
}, {
  status: 'open',
  userId: 2
}, {
  status: 'complete',
  userId: 3
}, {
  status: 'complete',
  userId: 3
}, {
  status: 'complete',
  userId: 1
}, {
  status: 'open',
  userId: 4
}, {
  status: 'complete',
  userId: 1
}, {
  status: 'complete',
  userId: 5
}, {
  status: 'open',
  userId: 6
}, {
  status: 'open',
  userId: 7
}, {
  status: 'open',
  userId: 8
}, {
  status: 'open',
  userId: 9
}, {
  status: 'open',
  userId: 10
}, {
  status: 'open',
  userId: 11
}, {
  status: 'open',
  userId: 3
}, {
  status: 'open',
  userId: 5
}]

const OrderItems = [{
  orderId: 9,
  productId: 2,
  quantity: 1,
  salePrice: 199
}, {
  orderId: 9,
  productId: 1,
  quantity: 2,
  salePrice: 199
}, {
  orderId: 9,
  productId: 3,
  quantity: 1,
  salePrice: 199
}, {
  orderId: 1,
  productId: 6,
  quantity: 1,
  salePrice: 199
}, {
  orderId: 2,
  productId: 7,
  quantity: 3,
  salePrice: 199
}, {
  orderId: 3,
  productId: 1,
  quantity: 2,
  salePrice: 199
}, {
  orderId: 3,
  productId: 2,
  quantity: 1,
  salePrice: 399
}, {
  orderId: 4,
  productId: 3,
  quantity: 1,
  salePrice: 299
}, {
  orderId: 4,
  productId: 4,
  quantity: 2,
  salePrice: 199
}, {
  orderId: 4,
  productId: 5,
  quantity: 2,
  salePrice: 149
}, {
  orderId: 5,
  productId: 6,
  quantity: 1,
  salePrice: 199
}, {
  orderId: 5,
  productId: 1,
  quantity: 2,
  salePrice: 159
}, {
  orderId: 6,
  productId: 7,
  quantity: 1,
  salePrice: 199
}, {
  orderId: 6,
  productId: 6,
  quantity: 1,
  salePrice: 199
}, {
  orderId: 7,
  productId: 6,
  quantity: 5,
  salePrice: 100
}, {
  orderId: 8,
  productId: 1,
  quantity: 4,
  salePrice: 700
}, {
  orderId: 8,
  productId: 2,
  quantity: 6,
  salePrice: 400
}, {
  orderId: 8,
  productId: 3,
  quantity: 5,
  salePrice: 299
}]

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  try {
    await db.sync({ force: true }) // clears db and matches models to tables
    logger('db synced!')
  } catch (err) {
    logger('failed to sync DB')
    throw(err)
  }

  try {
    await User.bulkCreate(Users, { hooks: false })
    await Product.bulkCreate(Products)
    await Order.bulkCreate(Orders)
    await OrderItem.bulkCreate(OrderItems)

    logger(`seeded successfully`)
    return {};
  } catch (error) {
    logger('seeding failed')
    throw error
  }
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  logger('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    logger('closing db connection')
    await db.close()
    logger('db connection closed')
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  if (!debug.enabled) debug.enable('app:test:seed')
  runSeed()
}


// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
