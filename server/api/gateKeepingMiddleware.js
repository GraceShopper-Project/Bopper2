const {
  models: {User},
} = require("../db");

//here we make a function so we can  make sure a user is logged in before performing functions.
const requireToken = async (req, res, next) => {

  try {
    const token = req.headers.authorization;
    const user = await User.findByToken(token);
    if(!user) throw new Error('No User Found')
    req.user = user.dataValues;
    next();
  } catch (error) {
    throw error
  }
};

const isAdmin = async (req, res, next) => {
  await requireToken(req, res,()=>{})
  if (!req.user.isAdmin) {
    return res.status(403).send("You Shall not pass!");
  }
  next()
};

module.exports = {
  requireToken,
  isAdmin,
};
