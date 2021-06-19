const router = require("express").Router();
const {isAdmin} = require("./gateKeepingMiddleware");
const {
  models: { Product },
} = require("../db");

module.exports = router;

//GET /api/products
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.findAll({});
    res.json(products);
  } catch (err) {
    next(err);
  }
});

//GET /api/products/:prodId
router.get("/:prodId", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.prodId);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

//POST /api/products/
router.post("/", isAdmin, async (req, res, next) => {
  try {
    res.status(201).send(await Product.create(req.body));
  } catch (err) {
    next(err);
  }
});

//PUT /api/products/:prodId
router.put("/:prodId", isAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.prodId);
    res.status(202).send(await product.update(req.body));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:prodId
router.delete("/:prodId", isAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.prodId);
    await product.destroy();
    res.send(product);
  } catch (err) {
    next(err);
  }
});
