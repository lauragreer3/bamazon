require("dotenv").config();
var table = require('cli-table3');
var keys = require("./keys.js");
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user : keys.bamazon.username,
    password : keys.bamazon.password,
    database: 'bamazon'
});

connection.connect();

console.log('Hi, welcome to bamazon Manager.');

var bamazonApp = {
    products: [],
    product_choices: [],
    questions : [
        {
            type: 'list',
            name: 'manager_menu',
            message: 'Select a menu option:',
            choices: ['View Products for sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        },
        {
            type: 'list',
            name: 'add_to_inventory_product',
            message: 'Select a product to add inventory:',
            choices: this.product_choices,
            when: function(answer) {
                if(answer.manager_menu == "Add to Inventory")
                {
                    return true;
                }
                else return false;
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to add?',
            validate: function(value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number,
            when: function(answer) {
                if (answer.manager_menu == 'Add To Inventory') {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'new_product_name',
            message: 'New Product Name:',
            validate: function(value) {
                if(value=="") {
                    return 'Please enter a name';
                }
                else
                    return true;

            },
            when: function(answer) {
                if (answer.manager_menu == 'Add New Product') {
                    return true;
                }
                else return false;
            }
        }
    ],
    init: function() {
        this.lookup_products(this);

    },
    product_table: new table({
        head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],
        colWidths: [10, 20, 20, 10, 10]
    }),
    low_product_table: new table({
        head: ['ID', 'Name', 'Department', 'Price', 'Quantity'],
        colWidths: [10, 20, 20, 10, 10]
    }),
    lookup_products: function(app) {
        connection.query('SELECT * FROM products', function(error, results, fields) {
            if (error) throw error;
            console.log('Connection to product database established.');
            //app.products = results;
            //console.log(app.products);
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
                if (row.stock_quantity <= 5) {
                    app.low_product_table.push([row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity]);
                }
                
            });
            // app.questions[0].choices = app.product_choices;
            app.ask_questions(bamazonApp);
             
        });
    },
    display_all_products_table: function() {
        console.log('All Products');
        console.log(this.product_table.toString());
    },
    display_low_quantity_products_table: function() {
        console.log('Products with low in-stock quantities');
        console.log(this.low_product_table.toString());
    },
    ask_questions: function(app) {
        var inquirer = require('inquirer');
        inquirer
        .prompt(this.questions)
        .then(answers => {
            //deal with menu
            switch (answers.manager_menu) {
                case 'View Products for sale':
                    app.display_all_products_table();
                    break;

                case 'View Low Inventory':
                    app.display_low_quantity_products_table();
                    break;

                
                default:
                    console.log('Menu Error');
                    break;

                case "Add to Inventory":
                    bamazonApp.add_to_product_quantity(bamazonApp, answers.product_name, answer.quantity);    
            }
            // //Check if there are enough to sell
            // bamazonApp.products.forEach(product => {
            //     if(product.name == answers.product_to_order)
            //     {
            //         //check the quantity
            //         if (product.stock_quantity < answers.quantity)
            //         {
            //             console.log('Sorry, the in-stock quantity is too low. There are only ' + product.stock_quantity + ' in stock and you tried to order ' + answers.quantity);
            //         }
            //         else
            //         {
            //             console.log('Order successful');
            //             var new_quantity = product.stock_quantity - answers.quantity;
            //             bamazonApp.alter_product_quantity(bamazonApp, product.product_id, new_quantity);
            //         }
            //     }
            // });
            bamazonApp.cleanup();
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
    alter_product_quantity: function (app, product_name, new_quantity) {
        var update_query = "UPDATE products SET stock_quantity = '" + new_quantity + "' WHERE name='" + product_name + "'";
        console.log(update_query);
        connection.query(update_query, function(error, results, fields) {
           if (error) throw error;
           console.log('Product database updated with new instock quantity (' + new_quantity + ') for product ' + product_name);
        });
    },
    add_to_product_quantity: function (app, product_name, quantity_to_add) {
        var update_query = "UPDATE products SET stock_quantity = stock_quantity + " + quantity_to_add +  " WHERE name='" + product_name + "'";
        console.log(update_query);
        connection.query(update_query, function(error, results, fields) {
           if (error) throw error;
           console.log('Product database updated added ' + quantity_to_add + ' for product ' + product_name);
        });
    },
    cleanup: function() {
        connection.end();
    }
};
bamazonApp.init();

/*
*/