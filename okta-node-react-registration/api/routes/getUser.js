const express = require('express');
const router = express.Router();
const oktaClient = require('../lib/oktaClient');

/* Get a details of User */
router.get('/', (req, res) => {
  console.log("req ",req);
  if (!req) return res.sendStatus(400);
  oktaClient.getUser( req.headers.username)
.then(user => {
  res.status(200);
  res.send(user);
}).catch(err => {
  res.status(400);
  res.send(err);
})

});

module.exports = router;