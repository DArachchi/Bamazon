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
			choices: ["View Product Sales by Department", "Create New Department"],
			name: "operation"
		}
	]).then(function(input) {
		if (input.operation === "View Product Sales by Department") {
			viewProducts();
		}
		if (input.operation === "Create New Department") {
			createDepartment();
		}
	});
}


function createDepartment() {
	inquirer.prompt([
		{
			type: "name",
			message: "What is the name of the department?",
			name: "departmentName"
		},
		{
			type: "name",
			message: "What is the overhead costs for this department?",
			name: "overheadCosts"
		}
	]).then(function(newDepartment) {
		connection.query("INSERT INTO departments(department_name,over_head_costs,total_sales) VALUES (?,?,0)", [newDepartment.departmentName,newDepartment.overheadCosts], function(err, res) {
			menuOptions();
		});
	});
}

function viewProducts() {
	connection.query("SELECT * FROM departments", function(err,res) {
		if (err) throw err;
		var table = new Table({
			head: ["Department ID #", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"],
			colWidths: [18, 20, 20, 15, 15]
		});
		for(var i=0; i<res.length; i++) {
			table.push(
				[res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].total_sales, 2]
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