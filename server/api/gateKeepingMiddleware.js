const {
  models: {User},
} = require("../db");

//here we make a function so we can  make sure a user is logged in before performing functions.
const requireToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = await User.findByToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  await requireToken(req, res,()=>{})
  if (!req.user.isAdmin) {
    return res.status(403).send("You Shall not pass!");
  }
  //would also export this and require and include it on user route
  next()
};

module.exports = {
  requireToken,
  isAdmin,
};
