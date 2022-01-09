const express = require('express');
const router = express.Router();
const oktaClient = require('../lib/oktaClient');

router.post('/', (req, res, next) => {
  if (!req.body) return res.sendStatus(400);
  const newUser = req.body;
  oktaClient.getUser( req.body.user.id)
    .then(user => {
    user.profile = newUser.user.profile;
      user.update()
      .then(() => {
        res.status(200);
        res.send(user);
      })
      .catch(err=> console.log("error occur while updating"));
    }).catch(err => {
    console.log("inside get user api error : ",err);
    res.status(400);
    res.send(err);
})
  
});


module.exports = router;