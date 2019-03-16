//Create the database connection

//greet user

//display menu

//query database for product information

//see if there are enough available for purchase

//alter database product quantity for order

//display invoice

var mysql = require ('mysql');
var connection = mysql.createConnection({
    host: localhost,
    user: 'root',
    'password' : 'Dumphuckr!2142'
    database: 'bamazon'
});

connection.connect();



var inquirer = require ('inquirer');
inquirer
.prompt({
    /* Pass your question in here */
})
.then(answers => {
    //Use user feedback for... whatever!!
});



//cleanup
connect.end();