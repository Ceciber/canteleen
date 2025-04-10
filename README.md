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

Users can **log in or sign up**. When signing up, users choose their role: **Manager** or **Cashier**.

For testing purposes, two system accounts are pre-configured:

- **Manager**  
  - Username: `Manager`  
  - Password: `managerpassword`

- **Cashier**  
  - Username: `Cashier`  
  - Password: `cashierpassword`

---

## 💼 Role-Based Functionality

### 🧾 Cashier Interface

Accessible after logging in as a **Cashier**.

- Select the **guest type** (student, teacher, visitor, other), which applies a discount.
- Add items to a guest’s order from the available daily menu.
- Manage and adjust the order before checkout.
- Simulate payment using:
  - 💳 Credit card
  - 💰 Cash
  - 🎫 Balance (linked to a mock client card)
- Recharge client balance via card ID.
- Orders are saved with:
  - Client name and ID
  - Items purchased
  - Total amount, tax, and discount
  - Cashier username
  - Payment method
  - Timestamp

### 🧑‍🍳 Manager Interface

Accessible after logging in as a **Manager**.

- **Manage Dishes**:
  - Add, edit, and remove meals in the database.
  - Set nutrients, ingredients, dish type, allergens, and price.
  
- **Create Menu of the Day**:
  - Choose which dishes are visible on the public menu screen.

- **View Orders**:
  - See a list of all previous orders.
  - Filter orders by date.
  - Visualize each order’s details: client, cashier, payment time, and items.

- **Update Dish Display Screens**:
  - Automatically reflects the latest dish information in the public "Info Screens".

---

## 💡 Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js (Express)
- **Database**: SQLite / JSON-based mock storage (depending on deployment)

---

## 🚀 Getting Started

To run locally:

```bash
git clone https://github.com/yourusername/canteleen.git
cd canteleen
npm install
npm start
