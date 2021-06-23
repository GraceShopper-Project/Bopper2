const {
  models: {User},
} = require("../db");

//here we make a function so we can  make sure a user is logged in before performing functions.
const requireToken = async (req, res, next) => {

  try {
    const token = req.headers.authorization;
    const user = await User.findByToken(token);
    if(!user) throw new Error('No User Found')
    req.user = user;
    next();
  } catch (error) {
    next(error)
  }
};

const isAdmin = async (req, res, next) => {
  try {
    await requireToken(req, res,()=>{})
    if (!(req.user && req.user.isAdmin)) {
      return res.status(403).send("You Shall not pass!");
    }
    next();
  } catch (err) {
    next(err)
  }
};

module.exports = {
  requireToken,
  isAdmin,
};
