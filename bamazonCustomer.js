var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "nar8384",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    queryAllProducts();
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        
        console.log("\n Bamazon Products");
        console.log("-----------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        productSearch();
    });
}

function productSearch() {
    inquirer
        .prompt([
        {
            name: "item_id",
            type: "input",
            message: "Enter the ID of the product you'd like to buy: "
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "How many units of the product would you like to buy? "
        }])
        .then(function (answer) {
            var selectedItem = "SELECT * FROM products WHERE ?";
            connection.query(selectedItem, {item_id: answer.item_id}, function (err, res) {
                if (err) throw err;
                
                if (res[0].stock_quantity > answer.stock_quantity) {
                    console.log("-----------------------------------");
                    console.log("The total charge for " + answer.stock_quantity + " units is: " + "$" +(res[0].price * answer.stock_quantity));
                    console.log("Thank you for your purchase!")
                    console.log("-----------------------------------");
                    var query = "UPDATE products SET ? WHERE ?";
                    connection.query(query, [{ stock_quantity: res[0].stock_quantity - answer.stock_quantity }, { item_id: answer.item_id }], function (err, res) {
                        if (err) throw err;
                        next();
                    }
                    );
                } else {
                    console.log("-----------------------------------");
                    console.log("Insufficient Quantity!");
                    console.log("-----------------------------------");
                    next();
                    
                };
                
            });
            
    });
};

function next(){
    inquirer
    .prompt({
        type: "list",   
        message: "Would you like to make another purchase?",
        choices: ["Yes", "No"],
        name: "continue_shopping"
    }).then(function(answer) {
        if(answer.continue_shopping === "Yes"){
            queryAllProducts();
        }
        else {
            connection.end();
        }

    });
    
} 


