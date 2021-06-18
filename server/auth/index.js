const router = require("express").Router();
const {
  models: { User, Order },
} = require("../db");
module.exports = router;
const Sequelize = require("sequelize")

router.post("/login", async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password, name, email } = req.body;
    const user = await User.create({ username, password, name, email });
    res.send({ token: await user.generateToken() });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization)
    await Order.findOrCreate({
      where: {
        [Sequelize.Op.and]: [
          {userId: user.id },
          {status: 'open'}
        ]
      },
      defaults: {
        userId: user.id,
        status: 'open'
      }
    })
    res.json(user);
  } catch (ex) {
    next(ex);
  }
});
