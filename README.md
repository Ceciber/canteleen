# 🍽️ Canteleen — IGR203 Project (2024/2025)

Welcome to **Canteleen**, an interactive canteen management and ordering web application developed as part of the **IGR203 course** at **Télécom Paris**, academic year **2024/2025**.

## 👥 Group Members

- **Cecilia Berti**
- **Matteo Caroli**
- **Vincent Frippiat**

---

## 📝 Project Summary

Canteleen is a full-stack web application designed to simulate and manage the daily operations of a university canteen. It allows different types of users to interact with the system based on their roles:

- **Guests** view menus and dish information through dynamically updated display screens.
- **Cashiers** manage guest orders and payments.
- **Managers** control the menu, dish availability, and can review past orders.

The system includes a visually dynamic **homepage display** for public-facing screens, a **login/sign-up flow** for authenticated users, and **role-specific dashboards**.

---

## 👤 User Roles

### 1. Guest (No login required)
Guests are the clients of the canteen who interact only with the **public homepage** displayed on a screen at the canteen.

They can visualize:

- 📋 **Menu of the Day**  
  Automatically populated by the manager’s selections. Displayed in a clean and structured format.
  
- 🗺️ **Canteen Map**  
  A fixed graphic map showing where different dish categories (e.g., Starters, Meat, Fish...) are located.

- 🍲 **Info Screens per Course**  
  Each screen shows detailed information about the dishes at each stand:  
  - Name  
  - Dish type  
  - Ingredients  
  - Nutritional values  
  - Allergen icons  

These screens **automatically update** based on what the manager has configured.

---

## 🔐 Authentication

Users can **log in or sign up** by clicking on the buttons corresponding to these actions on the homescreen. When signing up, users choose their role: **Manager** or **Cashier**.

For testing purposes, two system accounts are pre-configured:

- **Manager**  
  - Username: `Manager`  
  - Password: `managerpassword`

- **Cashier**  
  - Username: `Cashier`  
  - Password: `cashierpassword`

Upon successful login, the user is redirected to their respective dashboard. Sessions are tracked using server-side sessions to ensure data consistency.

---
The corresponding interface after signing in depends on the role of the user. Howewer, regardless of the role, each user will always have the option to modify their profile when clicking on the icon "Profile".

The profile section includes:
- Editable personal fields: full name, username, email, gender, country, and language (default English)
- Role information and profile image
- A button to erase the account
- The possibility to save updated information back to the database

---

## 💼 Role-Based Functionality

### 🧾 Cashier Interface

Accessible after logging in as a **Cashier**.

- 🧍 **Guest Selection**  
  Choose the type of guest (student, teacher, staff, or other). This choice is used to determine the applicable discount for the order.

- 🧮 **Order Management**  
  - Search and filter dishes by category (Meat, Fish, Vegetarian, Dessert, etc.).
  - Add items from the active daily menu to an ongoing order.
  - Visual right-hand sidebar showing:
    - Selected guest type
    - Items in current order (quantity control, remove button)
    - Breakdown of total, taxes, discount, and final amount
    - Proceed to payment button

- 💳 **Payment Simulation**  
  - Simulates card swipe by randomly selecting a mock user from a client database.
  - Displays user name, card number, and balance
  - Offers 3 payment options:
    - Cash
    - Credit Card
    - Balance (disabled during recharge flow)
  - Recharge flow with a conditional input field (when recharge is clicked)
  - After payment:
    - Saves order in the database (with items, payment method, and card ID)
    - Clears the current order and resets the interface

Orders include:
- Card ID
- List of meals (with all properties: price, type, nutrients, allergens, etc.)
- Quantity per meal
- Payment method
- Timestamp (recorded at the time of payment)

---

### 🧑‍🍳 Manager Interface

Accessible after logging in as a **Manager**.

#### 🧾 Menu Management
- Add new meals with:
  - Name, price, ingredients
  - Nutrients: calories, sugar, fat
  - Allergens (gluten, dairy, eggs, peanuts, soy)
  - Meal type (Meat, Fish, Vegetarian, Dessert)
- Modify or delete existing meals
- Copy meals to duplicate their data quickly
- Filter the meal list by type or view **"Menu of the Day"**
- Toggle **Add to Menu** and **Remove from Menu** (only one dish per type can be selected for the menu)
- Menu updates immediately reflect on the Guest public display

#### 📊 Order Monitoring

- **Summary Section** (top panel):
  - Total Income
  - Total Orders
  - Meals ordered per type (Meat, Fish, Vegetarian, Dessert)

- **Order Table and Detail View** (bottom panel):
  - Table with: Order ID, number of items, total amount, Card ID
  - Filter by date
  - Click on any order to view detailed info in the sidebar:
    - Tabs for **Order** (list of meals by course type) and **Payment** (method used)

---

## 🗃️ Data Model

### Database contains 3 main tables:

- **Users**
  - Full name, username, gender, country, language, email, password, role

- **Meals**
  - Name, price, ingredients (list), nutrients (dict), allergens (dict), type, inMenu (boolean)

- **Orders**
  - Order ID, Card ID, Items (list of meal objects + quantity), Payment method, Timestamp

An additional **Clients** table holds mock clients (students, staff, teachers, visitors) with:
- Name
- Card Number
- Balance

---

## 💡 Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js (Express)
- **Database**: SQLite / JSON-based mock storage (depending on deployment)
- **Session Management**: express-session

---

## 🚀 Getting Started

To run locally:

```bash
git clone https://github.com/Ceciber/canteleen.git
cd canteleen
npm install
npm start
