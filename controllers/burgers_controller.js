var express = require("express");

var router = express.Router();

var db = require("../models");

// get route -> index
router.get("/", function(req, res) {
  // send us to the next get function instead.
  res.redirect("/burgers");
});

// Create all our routes and set up logic within those routes where required.
router.get("/burgers", function(req, res) {
  db.Burger.findAll({
    include: [db.Customer],
    // Here we specify we want to return our burgers in ordered by ascending burger_name
    order: [
      ["burger_name", "ASC"]
    ]
  })
  .then(function(dbBurger) {
    var hbsObject = { 
      burger: dbBurger 
    };
    return res.render("index", hbsObject);
  });
});

router.post("/burgers/create", function(req, res) {
  db.Burger.create({
    burger_name: req.body.burger_name
  })
  .then(function(dbBurger) {
    console.log(dbBurger);
    res.redirect("/");
  });
});

router.put("/burgers/update", function(req, res) {
  if (req.body.customer) { // If we are given a customer, create customer and give this devoured burger
    db.Customer.create({
      customer: req.body.customer,
      BurgerId: req.body.burger_id
    })
    .then(function(dbCustomer) {
      return db.Burger.update({
        devoured: true
      }, {
        where: {
          id: req.body.burger_id
        }
      });
    })
    .then(function(dbBurger) {
      res.redirect("/");
    });
  }
    else {  // If we aren't given a customer, just update the burger to be devoured
    db.Burger.update({
      devoured: true
    },
    {
      where: {
        id: req.body.burger_id
      }
    })
    .then(function(dbBurger) {
      res.redirect("/");
    });
  }
});

module.exports = router;