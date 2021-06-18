const router = require("express").Router();
const {
  models: {User, Order, OrderItem},
} = require("../db");
const {isAdmin} = require("./gateKeepingMiddleware");
const debug = require('debug')('app:routes:users')
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

// router.get("/users/:userId", requireToken, async (req, res, next) => {
//   try {
//     if (!req.user.isAdmin) {
//       return res.status(403).send("You Shall not pass!");
//     }
//     const user = await User.findOne({
//       where: { id: req.params.userId },
//       include: [{ model: Order }],
//       attributes: ["id", "email", "name"],
//     });
//     res.json(user);
//   } catch (err) {
//     next(err);
//   }
// });

// // write this cart route later -- do we load a users card from database or from state and if so, do we still need this route?
// // POST /api/users/:userId/orders
// router.post("/users/:userId/orders", requireToken, async (req, res, next) => {
//   try {
//     if (req.params.userId !== req.user.id) {
//       return res.status(403).send("You Shall not pass!");
//     }
//     const order = res.status(201).send(await Order.create(req.body));
//   } catch (err) {
//     next(err);
//   }
// });

// // PUT /api/users/:userId/orders/:orderId
// router.put(
//   "/users/:userId/orders/:orderId",
//   requireToken,
//   async (req, res, send) => {
//     try {
//       if (req.params.userId !== req.user.id) {
//         return res.status(403).send("You Shall not pass!");
//       }
//       const order = await Order.findbyPk(
//         req.params.orderId,
//         include[{ model: Item }]
//       );
//       res.status(202).send(await Order.update(order));
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// // DELETE /api/users/:userId/orders/:orderId
// router.delete(
//   "/users/:userId/orders/:orderId",
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
