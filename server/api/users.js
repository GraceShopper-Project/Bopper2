const router = require("express").Router();
const {
  models: {User, Order, Product},
} = require("../db");
const {isAdmin, requireToken} = require("./gateKeepingMiddleware");
const debug = require('debug')('app:routes:users')
const Sequelize = require('sequelize')
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
    const orders = await Order.findOrCreate({
      where: {
        [Sequelize.Op.and]: [
          {userId: user.id},
          {status: 'open'}
        ]
      },
      include: [
        {
          model: Product
        }
      ],
      defaults: {
        userId: user.id,
        status: 'open'
      }
    })
    res.json({
      cart: orders[0].dataValues.products.map(p => ({ 
        name: p.name,
        price: p.price,
        salePrice: p.order_item.salePrice,
        quantity: p.order_item.quantity,
        description: p.description,
        imageUrl: p.imageUrl,
      })),
      ...user.dataValues, 
    });
  } catch (ex) {
    next(ex);
  }
});

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
