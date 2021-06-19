const router = require("express").Router();
const {
  models: {User, Order, Product, OrderItems},
} = require("../db");
const {isAdmin, requireToken} = require("./gateKeepingMiddleware");
const debug = require('debug')('app:routes:users')
const Sequelize = require('sequelize');
module.exports = router;

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
      cart: await user.getCart(),
      ...user.dataValues, 
    });
  } catch (ex) {
    next(ex);
  }
});

// // write this cart route later -- do we load a users card from database or from state and if so, do we still need this route?
// // POST /api/users/:userId/orders
// router.post("/:userId/orders", requireToken, async (req, res, next) => {
//   try {
//     if (req.params.userId !== req.user.id) {
//       return res.status(403).send("You Shall not pass!");
//     }
//     const order = res.status(201).send(await Order.create(req.body));
//   } catch (err) {
//     next(err);
//   }
// });

// // PUT /api/users/:userId/cart
router.put("/:userId/cart", requireToken, async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: {
          model: Order,
          where: {
            status: 'open'
          }
        }
      })
      const orderItems = await OrderItems.findAll({
        where: {
          orderId: user.orders[0].id
        },
        include: Product
      })
      // console.log(req.body)
      // const productQuantities = req.body.reduce((accum, p) => {
      //   accum[p.id] = p.quantity
      //   return accum
      // }, {})
      // console.log("productQuantities ", productQuantities)
      console.log(orderItems)
      user.orders[0].setOrderItems(orderItems
        .map(o => {
        o.order_item.setQuantity(productQuantities[p.id])
        return o
      }))
      res.status(202).json(await user.getCart());
    } catch (err) {
      next(err);
    }
  }
);

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

// // handle item delete, update, post
// // ?? /api/users/:userId/orders/:orderId/items/:itemId ??
