# EbayBusiness
Purpose : Internal software application developed to help manage my ebay business including keeping track of current inventory, top selling items, business expenses, and warranty information. 

My application is meant to help me manage all relevent information for my business and as such I will continue to add additional functionality as I use it. 

# Inventory Manager 
URL : https://localhost:44388/Inventory

Current Inventory Table 

Purpose : Displays all my current inventory from my MySQL DB

Implemented Functionality
```bash 
Update an item/s (purpose: update allowed fields in the table if information changes i.e. qty, discount, name)
Delete an item/s (purpose: remove an item from the database once it is out of stock)
```
Coming Functionality 
```bash
Search for a particular item/s in the database and display it 
```

Incoming Inventory Table Options

Purpose : Displays all my incoming inventory from my MySQL DB

Implemented Functionality
```bash
Add an item
Delete an item/s
Move to Current Inventory (in the future I want to automate this to when the tracking number shows as delivered)
Update item/s info in the table i.e. tracking number, estimated delivery date
```
Coming Functionality
```bash
Search for a particular item/s in the database and display it. Possible search fields i.e. name/purchase date 
```
# Selling Statistics

URL: https://localhost:44388/SellingStats

Purpose : Display past inventory that sold well / poorly to guide future purchases.

Top Sellers Table

Need to implement this table

Bad Sellers Table

Implemented Functionality 
```bash
Add bad seller
Delete bad seller
```

# Business Expenses Manager

URL: https://localhost:44388/BusinessExpenses

Purpose : Display all my business related expenses.

Implemented Functionality 
``` bash
Add an Expense
```
Coming Functionality
```bash
Display the expenses graphically i.e. pie chart broken into the different categories - gas, shipping supplies, etc.
```

# Warranty Manager ** Implement **

URL : https://localhost:44388/Warranty

Purpose : Keep track of the serial numbers for each item within the warranty limit. Automatically delete an item from the MySQL database once the warranty has expired. 

I have implemented the UI but not the backend functionality

```bash
Search for a particular item/s with the name / serial number and display the warranty information in a table
```
# Vendor ** Implement **
Purpose : Table with total purchases to date from each vendor 

# Resolution Center

URL : https://localhost:44388/ResolutionCenter

Purpose: Keep track of all problematic orders i.e. open returns to vendors, insurance claims, and packages to buyers delayed in transit

Open Returns table
Implemented Functionality
```bash
Add
Delete 
Update - certain fields in the table
```

Open Insurance Claims
Implemented Functionality
```bash
Add
Delete 
Update - certain fields in the table
```

Packages delayed in Transit
Implemented Functionality
```bash
Add
Delete 
Update - certain fields in the table
```

# Profit Dashboard ** Implement **

URL: https://localhost:44388/Profit

Purpose: Keep track of my profit after all expenses i.e. shipping supplies, Ebay fees, etc.

# Adorama Listings

URL: https://localhost:44388/AdoramaListings

Purpose: Keep track of supplier special pricing offers
