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
  //we need to send this in req.body from singleUser.js
    // {productId : 2, 
    //   salePrice: 999, 
    //   orderId: 1, 
    //   quantity: 2}
    // if prod already exist in cart, put route
    // if not, post route

router.put("/:userId/cart", requireToken, async (req, res, next) => {
  //test data to represent req.body/req.params etc
  const item = {productId : 2, 
    salePrice: 999, 
    orderId: 1, 
    quantity: 2}

    try{
    const currentProd = await OrderItem.findOne({
      where: {
        [Sequelize.Op.and]: [
          {orderId: item.orderId},
          {productId: item.productId}
        ]
      },
    })
    console.log("currenProd", currentProd)

    await currentProd.update(item)

    const user = await User.findByPk(req.user.id, {
      include: 'cart'
    })
    const { cart } = user
    res.status(202).json(await cartToJson(cart));
  } catch (err) {
    next(err);
  }


  }
);

//deleted old version of code
// clear out DB's copy of cart
      // OrderItem.destroy({
      //   where: { orderId: cart.id }
      // })

      // // add products into cart, setting quantity as we go
      // await OrderItem.bulkCreate(productList.map(p => ({
      //   productId: p.id,
      //   orderId: cart.id,
      //   quantity: p.quantity
      // })))


//not using this right now
router.post("/:userId/cart", async (req, res, next) => {
  if (!req.body) return res.status(304).send()
    
  try {

   //req.body needs to include OrderId, preodID, salePRice, default quanity1
   //this is test data
    const item = {productId : 2, 
      salePrice: 999, 
      orderId: 1, 
      quantity: 1}  

    await OrderItem.create(item)

    const user = await User.findByPk(req.user.id, {
      include: 'cart'
    })
    const { cart } = user
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


