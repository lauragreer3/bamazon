require("dotenv").config();
var table = require('cli-table3');
var keys = require("./keys.js");
var mysql = require ('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: keys.bamazon.username,
    password : keys.bamazon.password,
    database: 'bamazon'
});

connection.connect();

console.log('Hi, welcome to bamazon.');

var bamazonApp = {
    products: [],
    product_choices: [],
    questions : [
        {
            type: 'list', 
            name: 'product_to_order',
            message : 'Select a product to order:',
            choices: this.product_choices
        },
        {
            type: 'input',
            name: 'quantity', 
            message: 'How many do you want to order?', 
            validate: function(value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number
        }
    ],
    init: function() {
        this.lookup_products(this);
    },
    product_table: new table({
        head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],
        colWidths: [10, 20, 20, 10, 10]
    }),
    lookup_products: function(app) {
        connection.query('SELECT * FROM products', function(error, results, fields) {
            if(error) throw error;
            console.log('Connection to product database established.');
            // app.products = results;
            // console.log(app.products);
            results.forEach(row => {
                app.products.push({
                    product_id: row.item_id,
                    name: row.product_name, 
                    department_name: row.department_name,
                    price: row.price, 
                    stock_quantity: row.stock_quantity
                });
                app.product_choices.push(row.product_name);
                app.product_table.push([row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity]);                
            });
            app.questions[0].choices = app.product_choices;
            app.ask_questions(bamazonApp);
        });
    },
    ask_questions: function(app) {
        var inquirer = require ('inquirer');
        inquirer
        .prompt(this.questions) 
        .then(answers => {
            //check if there are enough to sell
            // console.log(answers);
            // console.log(bamazonApp.products);
            bamazonApp.products.forEach(product => {
                if(product.name == answers.product_to_order)
                {
                    //check the quantity
                    if(product.stock_quantity < answers.quantity)
                    {
                        console.log('Sorry, the in-stock quantity is too low. There are only ' + product.stock_quantity + ' in stock you tried to order ' + answers.quantity);
                    }
                    else
                    {
                        console.log('Order successful');
                        var new_quantity = product.stock_quantity - answers.quantity;
                        bamazonApp.alter_product_quantity(bamazonApp, product.product_id, new_quantity);
                    }
                }
            });           
            //cleanup
            connection.end();
        });
    },
    create_order: function(app, product_id, quantity) {
        //check if quantity is more than we have in stock
        app.products.forEach(element => {
            if (element.product_id == product_id)
            {
                if(quantity > element.stock_quantity)
                {
                    console.log('Insufficient Stock quantity to create that order');
                }
                else {
                    //ok, there's enough. create the order
                    var final_quantity = element.stock_quantity - quantity;
                    app.alter_product_quantity(app, product_id, final_quantity);
                }
            }
        });
    },
    alter_product_quantity: function (app, product_id, new_quantity) {
        var update_query = "UPDATE products SET stock_quantity = '" + new_quantity + "'WHERE item_id='" + product_id + "'";
        connection.query(update_query, function(error, results, fields) {
            if (error) throw error;
            console.log('Product database updated with new instock quantity (' + new_quantity + ') for product id ' + product_id);
        });
    }

};
bamazonApp.init();

