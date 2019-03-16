# Bamazon Commandline Store

## Usage

```node bamazonCustomer.js```

## Description

Running the application will generate a prompt. The first will ask you for the product id of the item they would like to purchase. 

They will then be prompted to give the quantity desired for the order. Once the order is placed, the user will be told whether or not the store has the available units to purchase based on the quantity in stock in the database.

If the store can fulfill the order, the database will be updated with the new stock quantity and an invoice is displayed to the customer. 

## Sample Run

### Example 1

Here is a graphic displaying a successful order

### Example 2

Here is a graphic displaying an order that could not be fulfilled due to insuffient stock quantity.

## Manager View

### Usage
```node bamazonManager.js```

### Description
Manager View allows you to do several administrative tasks on the database.

Upon launching you are presented with a menu with the following options:
1. View Products for sale
2. View Low Inventory
3. Add to Inventory
4. Add New Product

#### View Products For Sale
Lists every available item 
*  ID
*  Name
*  Price
*  Quantity

#### View Low Inventory
Lists inventory items with a count lower than 5

#### Add To Inventory
Displays a prompt for the user to add more of any item already in the database. 

#### Add New Product
Prompts the user to create a new product for the store and requires the following information:
*   Name
*   Price
*   Quantity

## Supervisor View

### Usage
```node bamazonSupervisor.js```

### Description
The user will be presented with a menu upon launching and presented with the following options:

1. View Product Sales by Department
2. Create New Department

#### View Product By Department
The app will display a summarized table of the Sales:
| Department ID | Department Name | Overhead Costs | Product Sales | Total Profit |
| --- | :---: | --- | ---| ---: |
| 1 | Electronics | $20.00 | $2000 | $7570000 |
| 2 | Furniture | $444.00 | $63000 | $8850000 |
| 3 | Accessories | $636.00 | $255200 | $255000 |

