var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

var amountSpent = 0;

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});

function purchaseInquiry(){
	inquirer.prompt([
		{
			type: "name",
			message: "What is the Item ID # of the product you would like to purchase?",
			name: "itemNumber"
		},
		{
			type: "name",
			message: "How many would you like to purchase?",
			name: "quantity"
		}
	]).then(function(input) {
		connection.query("SELECT * FROM products WHERE item_id = ?", [input.itemNumber], function(err, res) {
			if (err) throw err;
			if (res[0].stock_quantity >= input.quantity) {
				connection.query("UPDATE products SET stock_quantity = ? WHERE item_id =?", [(res[0].stock_quantity)-(input.quantity), input.itemNumber], function(err,response) {
					showInventory();
					amountSpent =  input.quantity*res[0].price;
				});
			} else {
				console.log("Insufficient quantity in stock!");
				purchaseInquiry();
			}
		});
	});
}

function showInventory() {
	connection.query("SELECT * FROM products", function(err,res) {
		if (err) throw err;
		var table = new Table({
			head: ["Item ID#", "Product Name", "Price", "Quantity In Stock"],
			colWidths: [10, 30, 10, 20]
		});
		for(var i=0; i<res.length; i++) {
			table.push(
				[res[i].item_id, res[i].product_name, "$" + res[i].price, res[i].stock_quantity]
			);
		}
		console.log(table.toString());
		purchaseInquiry();
	});
}

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\r\n");
	showInventory();
});