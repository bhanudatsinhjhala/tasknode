const express = require('express');
const app = express();
const mongoose = require('mongoose');
const _ = require("lodash");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://username:<passwod>@cluster0.nlkar.mongodb.net/listDB", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
const itemSchema = new mongoose.Schema({
    itemName: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    itemName: "Welcome to to-do List app!!"
});

const item2 = new Item({
    itemName: "hit the + button to add new Item."
});

const item3 = new Item({
    itemName: "<-- Hit this to delte an item."
});


const listArray = [item1, item2, item3];

const listSchema = {
    name: String,
    listItem: [itemSchema]
};

const List = mongoose.model("List", listSchema);

var kindOfDay = date.getDay();
app.get("/", function(req, res) {
    Item.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(listArray, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully added the default list.");
                }
            });
            setTimeout(function() {
                res.redirect("/");
            }, 1000);
        } else {
            res.render("list", { listTitle: kindOfDay, newItem: foundItems });
        }
    });
});
app.post("/", function(req, res) {
    //console.log("post request accepted");
    let newItem = req.body.item;
    console.log(newItem);
    let listName = req.body.list;
    console.log(listName);
    const item = new Item({
        itemName: newItem
    });
    if (listName === kindOfDay) {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            //console.log(foundList);
            foundList.listItem.push(item);
            foundList.save();
            setTimeout(function() {
                res.redirect("/" + listName);
            }, 200);
        });
    }
    // if (req.body.list == "Work List") {
    //     workItems.push(newItem);
    //     res.redirect("/work");
    // } else {
    //     items.push(newItem);
    //     res.redirect("/");
    // }
});

app.post("/delete", function(req, res) {
    //console.log(req.body.checkbox);
    const itemId = req.body.checkbox;
    const listName = req.body.list;
    //console.log(listName);
    if (listName === kindOfDay) {
        Item.deleteOne({ _id: itemId }, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully deleted one item");
            }
            res.redirect("/");
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { listItem: { _id: itemId } } }, function(err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    }
});
app.get("/:customListName", function(req, res) {
    var urlTitle = req.params.customListName;
    let listTitle = _.capitalize(urlTitle);
    //console.log(listTitle);
    if (listTitle === "/") {
        re.redirect("/");
    } else {
        List.findOne({ name: listTitle }, function(err, foundList) {
            if (!err) {
                if (!foundList) {
                    // create a new list
                    const listName = new List({
                        name: listTitle,
                        listItem: listArray
                    });
                    console.log("New List" + listTitle);
                    listName.save();
                    // console.log("hello");
                    setTimeout(function() {
                        res.redirect("/" + listTitle);
                    }, 500);
                } else {
                    console.log("Old List" + listTitle);
                    //show an existing list
                    res.render("list", { listTitle: listTitle, newItem: foundList.listItem })
                }
            }
        });
    }
});

app.get("/about", function(req, res) {
    res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server has started successfully");
});