const jwt = require("jsonwebtoken");
const middlewareController = {
  //verifytoken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      //Bearer 123
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.sendStatus(403).json("Token is not valid");
        }
        req.user = user;
        return next();
      });
    } else {
      return res.sendStatus(401).json("You're not authenticated");
    }
  },
  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id === req.body.id || req.user.roleId === "R1") {
        next();
      } else {
        res.status(403).json("You're not delete other");
      }
    });
  },
};

module.exports = middlewareController;
