const router = require("express").Router();
const Sequelize = require("sequelize")
const {
  models: {User, Order, OrderItem, Product },
} = require("../db");
const {isAdmin, requireToken} = require("./gateKeepingMiddleware");
const debug = require('debug')('app:routes:users')
module.exports = router;

const coalesceCart = (products = []) => {
  const currentQuantity = products.reduce((accum, product) => {
    if(accum[product.id]) {
      accum[product.id]++
    } else {
      accum[product.id] = 1
    }
    return accum
  }, {})
  return Object.keys(currentQuantity).map((productId) => ({
    id: productId,
    quantity: currentQuantity[productId]
  }))
}

async function cartToJson(order) {
  const products = await order.getProducts()
  return (products || []).map(p => ({ 
    id: p.id,
    name: p.name,
    price: p.price,
    salePrice: p.order_item.salePrice,
    quantity: p.order_item.quantity,
    description: p.description,
    imageUrl: p.imageUrl,
  }))
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
    const user = await User.findByToken(req.headers.authorization)
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

/**
 * Given a list of products and quantities, sets the products and their quanitites in
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

    res.status(202).json(await cartToJson(cart));
  } catch (err) {
    next(err);
  }
});

// // DELETE /api/users/:userId/orders/:orderId
// router.delete(
//   "/:userId/orders/:orderId",
//   requireToken,
//   async (req, res, send) => {
//     try {
//       if (req.params.userId !== req.user.id) {
//         return res.status(403).send("You Shall not pass!");
//       }
//       const order = await Order.findbyPk(req.params.orderId);
//       await order.destroy();
//       res.send(order);
//     } catch (err) {
//       next(err);
//     }
//   }
// );


