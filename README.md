# EbayBusiness
Purpose : Internal software application developed to help manage my ebay business including keeping track of current inventory, top sellering items, business expenses, and warranty information. 
My application is meant to help me manage all relevent information for my business and as such I will continue to add additional functionality as I use it. 

# Inventory Manager
Current Inventory Table 
Purpose : Displays all my current inventory from my MySQL DB
Implemented Functionality
```bash 
Move an item to top seller database (purpose : move items that are out of stock that are good sellers to my top seller database for reference for future purchases)
Delete an item/s (purpose: remove an item from the database once it is out of stock if it isn't considered a top seller)
```
Coming Functionality 
```bash
Search for a particular item/s in the database and display it
Update a displayed item/s information i.e. Qty, price, etc. 
```

Incoming Inventory Table Options
Purpose : Displays all my incoming inventory from my MySQL DB
Implemented Functionality
```bash
Add an item
Delete an item/s
Move to Current Inventory (in the future I want to automate this to when the tracking number shows as delivered)
```
Coming Functionality
```bash
Search for a particular item/s in the database and display it. Possible search fields i.e. name/purchase date 
```
# Top Seller Manager
Purpose : Display past inventory that sold well.

# Business Expenses Manager
Purpose : Display all my business related expenses.

# Warranty Manager **Implement**
Purpose : Keep track of the serial numbers for each item with the warranty lengh. Automatically delete an item from the MySQL database once the warranty has expired. 
Coming
```bash
Search for a particular item/s with the name / serial number and display the warranty information in a table
```
# Vendor ** Implement **
Purpose : Table with total purchases to date from each vendor 


