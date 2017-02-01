var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});
function menuOptions() {
	inquirer.prompt([
		{
			type: "list",
			message: "What would you like to do?",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
			name: "operation"
		}
	]).then(function(input) {
		if (input.operation === "View Products for Sale") {
			viewProducts();
		}
		if (input.operation === "View Low Inventory") {
			viewLowInventory();
		}
		if (input.operation === "Add to Inventory") {
			addInventory();
		}
		if (input.operation === "Add New Product") {
			addProduct();
		}
	});
}

function addInventory() {
	inquirer.prompt([
		{
			type: "name",
			message: "What is the Item ID # of the product you would like to add more of?",
			name: "itemNumber"
		},
		{
			type: "name",
			message: "How many would you like to add?",
			name: "quantity"
		}
	]).then(function(input) {
		connection.query("SELECT * FROM products WHERE item_id = ?", [input.itemNumber], function(err, res) {
			if (err) throw err;
			connection.query("UPDATE products SET stock_quantity = ? WHERE item_id =?", [(res[0].stock_quantity)-(-input.quantity), input.itemNumber], function(err,response) {
				viewProducts();
			});
		});
	});
}

function addProduct() {
	inquirer.prompt([
		{
			type: "name",
			message: "What is the name of the product you would like to add?",
			name: "itemName"
		},
		{
			type: "name",
			message: "What department does this product belong in?",
			name: "departmentName"
		},
		{
			type: "name",
			message: "What is the price for this product?",
			name: "price"
		},
		{
			type: "name",
			message: "How many of this product would you like to add to stock?",
			name: "stockQuantity"
		}
	]).then(function(newProduct) {
		connection.query("INSERT INTO products(product_name,department_name,price,stock_quantity) VALUES (?,?,?,?)", [newProduct.itemName,newProduct.departmentName,newProduct.price,newProduct.stockQuantity], function(err, res) {
			viewProducts();
			menuOptions();
		});
	});
}

function viewLowInventory() {
	connection.query("SELECT * FROM products", function(err,res) {
		if (err) throw err;
		var table = new Table({
			head: ["Item ID#", "Product Name", "Price", "Quantity In Stock"],
			colWidths: [10, 30, 10, 20]
		});
		for(var i=0; i<res.length; i++) {
			if (res[i].stock_quantity < 5) {
				table.push(
					[res[i].item_id, res[i].product_name, "$" + res[i].price, res[i].stock_quantity]
				)
			}
		}
		console.log(table.toString());
		menuOptions();
	});
}

function viewProducts() {
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
		menuOptions();
	});
}

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId + "\r\n");
	menuOptions();
});