var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});

function showInventory() {
	connection.query("SELECT * FROM products", function(err,res) {
			if (err) throw err;
			console.log("Item ID#  Product Name               Price   Quantity In Stock");
			for(var i=0; i<res.length; i++) {
				console.log(res[i].item_id + "         " + res[i].product_name + "       $" + res[i].price + "    " + res[i].stock_quantity);
			}
		});
}

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\r\n");
	showInventory();
});