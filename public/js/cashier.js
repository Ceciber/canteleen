let order = [];
let guestType = null;
let discountRate = 0;

const sidebar = document.getElementById("order-sidebar");
const toggleBtn = document.getElementById("toggle-sidebar");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    toggleBtn.innerHTML = sidebar.classList.contains("closed") ? "◀" : "➤";
});


function filterGuestOptions() {
    const query = document.getElementById('guest-search').value.toLowerCase();
    const boxes = document.querySelectorAll('.guest-option');

    boxes.forEach(box => {
      const text = box.textContent.toLowerCase();
      if (text.includes(query)) {
        box.style.display = 'flex';
      } else {
        box.style.display = 'none';
      }
    });
}


async function loadMeals() {
    try {
      const response = await fetch('/meals');
      const meals = await response.json();
      const grid = document.querySelector('.menu-grid');
      grid.innerHTML = '';

      meals.forEach(meal => {
        const tile = document.createElement('div');
        tile.className = 'meal-tile';
        tile.setAttribute('data-meal-type', meal.meal_type.toLowerCase());
        tile.setAttribute('data-meal-id', meal.id);

        const image = document.createElement('img');
        image.className = 'meal-image';
        switch (meal.meal_type.toLowerCase()) {
          case 'starter' : image.src = '/images/menu-starters.jpg'; break;
          case 'meat': image.src = '/images/menu-meat.jpg'; break;
          case 'vegeterian': image.src = '/images/menu-vegeterian.jpg'; break;
          case 'vegetarian': image.src = '/images/menu-vegeterian.jpg'; break;
          case 'fish': image.src = '/images/menu-fish.jpg'; break;
          case 'dessert': image.src = '/images/menu-dessert.jpg'; break;
          default: image.src = '/images/defaultmeal.png';
        }
        meal.image = image.src;
        tile.appendChild(image);

        const nameDiv = document.createElement('div');
        nameDiv.className = 'meal-name';
        nameDiv.textContent = meal.meal_name;
        tile.appendChild(nameDiv);

        const priceDiv = document.createElement('div');
        priceDiv.className = 'meal-price';
        priceDiv.textContent = `€${meal.meal_price.toFixed(2)}`;
        tile.appendChild(priceDiv);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'meal-actions';

        const decBtn = document.createElement('button');
        decBtn.textContent = '−';
        const incBtn = document.createElement('button');
        incBtn.textContent = '+';
        const qtyLabel = document.createElement('span');
        qtyLabel.className = 'meal-qty-label';
        qtyLabel.textContent = 'Add';

        decBtn.onclick = () => {
          updateOrder(meal, -1, qtyLabel);
        };
        incBtn.onclick = () => {
          updateOrder(meal, 1, qtyLabel);
        };

        actionsDiv.append(decBtn, qtyLabel, incBtn);
        tile.appendChild(actionsDiv);
        grid.appendChild(tile);
      });
    } catch (error) {
      console.error(error);
    }
}

  

// only place where we add to order (an item of order has the same attributs of a meal but has quantity and label_meal_tile add it to it)
function updateOrder(meal, quantity_added, label = undefined) {   
    if (quantity_added == 0) {
      return;
    }

    var index = order.findIndex(o => o.id === meal.id);
    
    if (index === -1 && quantity_added === 1) {
      order.push({ ...meal, "quantity" : 1, "label_meal_tile": label });
      index = order.length - 1;
    }
    else if (index !== -1 ) {
      if (quantity_added === 1) {
        order[index].quantity += quantity_added;
      }
      else if (quantity_added === -1) {
        if (order[index].quantity === 1) {
          order[index].label_meal_tile.textContent = 'Add';
          order.splice(index, 1);
          index = -1
        } else {
          order[index].quantity += quantity_added;  // quantity_added = -1
        }
      }
    }
    
    if (index !== -1) {
      order[index].label_meal_tile.textContent = order[index].quantity > 0 ? `${order[index].quantity} in Add` : 'Add';
    }

    renderOrder();
}



function filterMeals(category) {
    const tiles = document.querySelectorAll('.meal-tile');
    tiles.forEach(tile => {
      const type = tile.getAttribute('data-meal-type');
      if (category.toLowerCase() === 'all' || type === category.toLowerCase()) {
        tile.style.display = 'block';
      } else {
        tile.style.display = 'none';
      }
    });
}

function setupSearchBar() {
    const searchInput = document.querySelector('.menu-search-input');
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      document.querySelectorAll('.meal-tile').forEach(tile => {
        const name = tile.querySelector('.meal-name').textContent.toLowerCase();
        tile.style.display = name.includes(query) ? 'block' : 'none';
      });
    });
}
  

document.addEventListener("DOMContentLoaded", () => {
    loadMeals();
    setupSearchBar(); 
});


function renderOrder() {
    const container = document.getElementById('order-items');
    container.innerHTML = '';

    let total = 0;
    let count = 0;

    order.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';

        const img = document.createElement('img');
        img.src = item.image || '/images/defaultmeal.png';
        itemDiv.appendChild(img);

        const details = document.createElement('div');
        details.className = 'order-details';

        const row1 = document.createElement('div');
        row1.className = 'order-name-row';
        row1.innerHTML = `<span>${item.meal_name}</span><span>€${item.meal_price.toFixed(2)}</span>`;

        const row2 = document.createElement('div');
        row2.className = 'order-controls';
        const decBtn = document.createElement('button');

        decBtn.textContent = '−';
        decBtn.onclick = () => {
            if (item.quantity - 1 === 0) {
                return;
            }
            updateOrder(item, -1);
        };

        const qty = document.createElement('span');
        qty.textContent = item.quantity;
        const incBtn = document.createElement('button');
        incBtn.textContent = '+';
        incBtn.onclick = () => {
            updateOrder(item, 1)
        };

        row2.append(decBtn, qty, incBtn);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.className = 'remove-item-btn';
        removeBtn.onclick = () => {
            order = order.filter(o => o.id !== item.id);
            item.label_meal_tile.textContent = 'Add';
            renderOrder();
        };

        details.appendChild(row1);
        details.appendChild(row2);
        itemDiv.append(details, removeBtn);
        container.appendChild(itemDiv);

        total += item.quantity * item.meal_price;
        count += item.quantity;
    });

    document.getElementById('order-count').textContent = count;
    document.getElementById('total-amount').textContent = total.toFixed(2);
    const tax = total * 0.1;
    const discount = total * discountRate;
    const final = total + tax - discount;

    document.getElementById('tax-amount').textContent = tax.toFixed(2);
    document.getElementById('discount-amount').textContent = discount.toFixed(2);
    document.getElementById('final-amount').textContent = final.toFixed(2);
}

function goToPayment() {
    showSection('payment');
    simulateBadgeScan();
}



// Show the selected section and hide others
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });

    if (sectionId === 'profile') {
        loadProfile(); // Load from DB when switching to profile
    }

    if (sectionId === 'payment') {
        simulateBadgeScan(); 
    }
}


// Guest Selection Logic (updated)
document.querySelectorAll('.guest-option').forEach(option => {
    option.addEventListener('click', function () {
        const discount = this.getAttribute('data-discount');
        sessionStorage.setItem('discount', discount);
        guestType = this.textContent.trim().toLowerCase();
        sessionStorage.setItem('selectedGuest', guestType);
        discountRate = parseFloat(discount);
        document.getElementById('guest-type-label').textContent = this.textContent;
        showSection('home');
    });
});


// Ensure the cashier starts in the guest selection view
document.addEventListener("DOMContentLoaded", () => {
    showSection('guest-selection');
});

// Toggle between edit and save mode for profile editing
async function toggleProfileEdit() {
    const inputs = document.querySelectorAll('.profile-field input');
    const editBtn = document.querySelector('.profile-edit-btn button');

    if (editBtn.textContent === "Edit") {
        inputs.forEach(input => input.disabled = false);
        editBtn.textContent = "Save";
    } else {
        // Collect updated profile info
        const updatedProfile = {
            full_name: document.getElementById('edit-fullname').value,
            gender: document.getElementById('edit-gender').value,
            country: document.getElementById('edit-country').value,
            language: document.getElementById('edit-language').value,
            email: document.getElementById('edit-email').value
        };

        try {
            const res = await fetch('/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProfile)
            });
            if (res.ok) {
                document.getElementById('profile-fullname').textContent = updatedProfile.full_name;
                document.getElementById('profile-email').textContent = updatedProfile.email;
                editBtn.textContent = "Edit";
                inputs.forEach(input => input.disabled = true);
            } else {
                alert("Error updating profile");
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
    }
}


async function loadProfile() {
    try {
        const res = await fetch('/profile');
        const user = await res.json();

        document.getElementById('profile-username').textContent = user.username || '';
        document.getElementById('profile-fullname').textContent = user.full_name || '';
        document.getElementById('profile-email').textContent = user.email || '';
        document.getElementById('profile-role').textContent = user.role || '';

        document.getElementById('edit-fullname').value = user.full_name || '';
        document.getElementById('edit-username').value = user.username || '';
        document.getElementById('edit-gender').value = user.gender || '';
        document.getElementById('edit-country').value = user.country || '';
        document.getElementById('edit-language').value = user.language || 'English';
        document.getElementById('edit-email').value = user.email || '';
    } catch (err) {
        console.error("Failed to load profile:", err);
    }
}

async function eraseAccount() {
    if (confirm("Are you sure you want to erase your account? This cannot be undone.")) {
        try {
            const res = await fetch('/profile/delete', { method: 'POST' });
            if (res.ok) {
                window.location.href = '/';
            } else {
                alert("Error deleting account.");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting account.");
        }
    }
}

function logout() {
    window.location.href = '/logout';
}


async function updateUserData(cardId, amount) {
    try {
        const res = await fetch('/clients/recharge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ card_id: cardId, amount })
        });
  
        if (res.ok) {
            const data = await res.json();
            document.getElementById('client-balance').textContent = data.newBalance.toFixed(2);
            document.getElementById('recharge-box').classList.add('hidden');
            document.getElementById('recharge-amount').value = '';
        } else {
            alert("Recharge failed");
        }
    } catch (err) {
        console.error("Recharge error", err);
    }
}

function selectMethod(method) {
    document.querySelectorAll('.method-box').forEach(box => box.classList.remove('selected'));

    if (method === 'balance') {
        let value = document.getElementById('final-amount').innerText;
        const amount = - parseFloat(value);
        const cardId = sessionStorage.getItem('card_id');
        const balanceBox = document.getElementById('balance-box');

        if (!balanceBox.classList.contains('disabled')) {
            balanceBox.classList.add('selected');
        }
        updateUserData(cardId, amount);
      
    } else {
      const box = Array.from(document.querySelectorAll('.method-box')).find(el => el.onclick.toString().includes(method));
      if (box) box.classList.add('selected');
    }

    submitOrder(method);
    endCustomer();
}


function endCustomer() {
    order.forEach(o => {
        o.label_meal_tile.textContent = 'Add';
    });
    order = [];
    renderOrder();
}
  

async function simulateBadgeScan() {
    const guest = sessionStorage.getItem('selectedGuest') || 'Student'; // ✅ Don't lowercase

    try {
      const res = await fetch(`/clients/by-role?role=${guest}`);
      
      if (!res.ok) {
        throw new Error("Request failed");
      }

      const users = await res.json();

      if (!users.length) {
        console.error("No users found for role:", guest);
        return;
      }

      const random = users[Math.floor(Math.random() * users.length)];

      console.log("Simulated user:", random);

      // ✅ Check all fields before using
      document.getElementById('client-name').textContent = random.full_name || '-';
      document.getElementById('client-card').textContent = random.card_id || '-';
      document.getElementById('client-balance').textContent = random.balance?.toFixed(2) ?? '0.00';

      // ✅ Store for use in recharge/payment
      sessionStorage.setItem('card_id', random.card_id);
      sessionStorage.setItem('balance', random.balance);
      
    } catch (err) {
      console.error("Failed to simulate badge scan", err);
    }
}


function toggleRecharge() {
    const box = document.getElementById('recharge-box');
    box.classList.toggle('hidden');

    const balanceBox = document.getElementById('balance-box');
    if (!box.classList.contains('hidden')) {
      balanceBox.classList.add('disabled');
    } else {
      balanceBox.classList.remove('disabled');
    }
}


function disablePayment() {
    document.querySelectorAll('.method-box').forEach(elm => {
        elm.classList.add('disabled');
    });
    document.querySelector('.recharge-btn').classList.add('disabled');
    
}

function unablePayment() {
    document.querySelectorAll('.method-box').forEach(elm => {
        elm.classList.remove('disabled');
    });
    document.querySelector('.recharge-btn').classList.remove('disabled');
}


function paymentSuccesful() {
    const container = document.createElement('div');
    container.id = 'confirmation';

    // Ajouter le texte
    const message = document.createElement('h2');
    message.className = 'next-order-message';
    message.textContent = 'Payment successful';
    container.appendChild(message);

    // Créer le bouton
    const button = document.createElement('button');
    button.id = 'next-order-btn';
    button.textContent = 'Process next order';
    button.onclick = () => {
        showSection('guest-selection');
        container.remove();
        unablePayment();
    };

    container.appendChild(button);

    // Ajouter le div à la page
    let elm = document.getElementById("payment").firstElementChild;
    elm.appendChild(container);

    disablePayment();
}


async function saveRecharge() {
    console.log("saveRecharge");
    const amount = parseFloat(document.getElementById('recharge-amount').value);
    const cardId = sessionStorage.getItem('card_id');

    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      const res = await fetch('/clients/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: cardId, amount })
      });

      if (res.ok) {
        const data = await res.json();
        document.getElementById('client-balance').textContent = data.newBalance.toFixed(2);
        document.getElementById('recharge-box').classList.add('hidden');
        document.getElementById('recharge-amount').value = '';
        document.getElementById('balance-box').classList.remove('disabled');
      } else {
        alert("Recharge failed");
      }
    } catch (err) {
      console.error("Recharge error", err);
    }
}

async function submitOrder(paymentMethod) {
    const card_id = sessionStorage.getItem('card_id') || 1111;
    const client_name = document.getElementById('client-name').textContent;
    const cashier_username = document.getElementById('profile-username').textContent || 'cashier';
    const date = new Date().toISOString();

    const orderData = {
      card_id: sessionStorage.getItem('card_id'),
      client_name: document.getElementById('client-name').textContent,
      cashier_username: 'cashier', // Replace if dynamic
      date: new Date().toISOString(),
      payment_method: paymentMethod,
      items: JSON.stringify(order) // ✅ Properly serialize
    };

    try {
      const res = await fetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const data = await res.json();
        // alert("Order saved successfully with payment method " + paymentMethod + ". Order ID: " + data.order_id);
        paymentSuccesful();

        order = [];
        renderOrder();
        showSection('payment');
      } else {
        alert("Error saving order.");
      }
    } catch (e) {
      console.error("Error submitting order:", e);
    }
}