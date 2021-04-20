const User = require('../models/user')
const admin = require('../firebase');

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.token);
    req.user = firebaseUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error });
  }
};


exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  try {
    const adminUser = await User.findOne({ email });
    
    if (adminUser.role !== "admin") {
      res.status(403).json({
        err: "Admin resource. Access denied.",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};