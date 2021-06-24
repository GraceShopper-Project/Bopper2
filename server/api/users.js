const router = require("express").Router();
const Sequelize = require("sequelize")
const {
  models: {User, Order, OrderItem },
} = require("../db");
const {isAdmin, requireToken} = require("./gateKeepingMiddleware");
const debug = require('debug')('app:routes:users')
module.exports = router;

async function cartToJson(order) {
  const deets = await order.getDetails()
  return deets.products
}

router.get("/", isAdmin, async (req, res, next) => {
  debug('GET /')
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "name", "email"],
    });
    debug(`returning ${users.length} users`)
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:userId", requireToken, async (req, res, next) => {
  try {
    const user = req.user
    if(!(req.params.userId == user.id || user.isAdmin)){
      return res.status(403).send('Not Authorized')
    }
    res.json({
      cart: await cartToJson(await user.getCart()),
      ...user.dataValues, 
    });
  } catch (ex) {
    next(ex);
  }
});

router.get("/:userId/cart", requireToken, async (req, res, next) => {
  const user = req.user
  const cart = await user.getCart()
  try {
    res.json(await cart.getDetails())
  } catch (err) {
    next(err)
  }
})

/**
 * Given a product and quantity, sets the product and quantity in
 * the user's cart.
 * Returns the state of the user's cart.
 */
router.put("/:userId/cart", requireToken, async (req, res, next) => {

  try{
    const cart = await Order.findByPk(req.user.cartId)

    const currentProd = await OrderItem.findOne({
      where: {
        [Sequelize.Op.and]: [
          {orderId: cart.id},
          {productId: req.body.productId}
        ]
      },
    })

    await currentProd.update({productId: req.body.productId, quantity: req.body.quantity})

    res.status(202).json(await cartToJson(cart));
  } catch (err) {
    next(err);
  }
  }
);

router.post("/:userId/cart", requireToken, async (req, res, next) => {
  if (!req.body) return res.status(304).send()

  try {
    const cart = await Order.findByPk(req.user.cartId)
    await OrderItem.create({productId: req.body.productId, orderId: cart.id, quantity: req.body.quantity})

    res.status(201).json(await cartToJson(cart));
  } catch (err) {
    next(err);
  }
});

/**
 * Runs checkout for user and returns finalized order
 */
router.get("/:userId/cart/checkout", requireToken, async (req, res, next) => {
  const user = req.user

  try {
    const order = await user.getCart()
    await user.checkout()
    return res.status(200).send()
  } catch (err) {
    console.error(`Failed to run checkout for user ${user.id}`)
    next(err)
  }
})

router.delete("/:userId/cart/product/:productId", requireToken, async (req, res, next) => {
  try{
    const cart = await Order.findByPk(req.user.cartId)
    await OrderItem.destroy({
      where: { 
        orderId: req.user.cartId, 
        productId: req.params.productId
      }
    })
    res.status(200).json(await cartToJson(cart));
  }catch (err){
    next(err)
  }
})

/**
 * returns the list of orders for the logged-in user. Does not include cart
 */
router.get("/:userId/orders", requireToken, async (req, res, next) => {
  const user = req.user
  try {
    const orders = await user.getOrders()
    const notOpenOrders = orders.filter(o => o.id !== user.cartId)
    res.json(await Promise.all(notOpenOrders.map(o => o.getDetails())))
  } catch (err) {
    next(err)
  }
})