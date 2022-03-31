const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// var items = ["Welcome!", "Add a task below."];
app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const _ = require("lodash");
const mongoose = require ("mongoose");
mongoose.connect("mongodb+srv://admin-evaldas:<< YOUR PASSWORD >>@cluster0.0k5n1.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true});

// items chema

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome!"
});

const item2 = new Item({
  name: "<-- check to delete"
});

const item3 = new Item({
  name: "Add a task below + "
});

const defaultItems = [item1, item2, item3];



//home page with date

app.get("/", function(req, res){
var today = new Date();
var options = {
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric"
};

  var day = today.toLocaleDateString("en-GB", options);

  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("todo", {kindOfDay: day, newListItems: foundItems});
    }
  });
});





//adding new item

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");

});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err) {
      console.log("Sucefully deleted item.");
      res.redirect("/");
    }
  });
});



//render about page

var live = "I live in London and I love to code.";

app.get("/about", function(req, res){
  res.render("about", {somethingAbout: live});
});

//server function

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
  console.log("server started Successfully.");
});
