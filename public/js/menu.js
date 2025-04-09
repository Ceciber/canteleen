document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/meals');
    const meals = await response.json();
  
    const menuMeals = meals.filter(m => m.inMenu);
    const grouped = {};
  
    menuMeals.forEach(meal => {
      if (!grouped[meal.meal_type]) {
        grouped[meal.meal_type] = [];
      }
      grouped[meal.meal_type].push(meal);
    });
  
    const menuContainer = document.getElementById('menuContainer');
  
    for (const [type, meals] of Object.entries(grouped)) {
        // Create section for each meal type
        const section = document.createElement("div");
        section.className = "meal-section";
      
        const title = document.createElement("h2");
        title.className = "meal-type";
        title.textContent = type.toUpperCase();
        section.appendChild(title);
      
        // Loop through meals of this type
        meals.forEach((meal) => {
            const mealRow = document.createElement("div");
            mealRow.className = "meal-row";
          
            // Meal info container
            const infoContainer = document.createElement("div");
            infoContainer.className = "meal-info";
          
            // Name + Allergens + Price
            const namePriceRow = document.createElement("div");
            namePriceRow.className = "name-price-row";

            const nameAllergensRow = document.createElement("div");
            nameAllergensRow.className = "name-allergens-row";
          
            const name = document.createElement("div");
            name.className = "meal-name";
            name.textContent = meal.meal_name;

            // Allergens 
            const allergens = document.createElement("div");
            allergens.className = "meal-allergens";
          
            const allergenIcons = {
              Gluten: "🌾",
              Dairy: "🥛",
              Eggs: "🥚",
              Peanuts: "🥜",
              Soy: "🌱"
            };
          
            const presentAllergens = Object.entries(meal.allergens || {})
              .filter(([_, value]) => value === false)
              .map(([key]) => allergenIcons[key] || key);
          
            allergens.textContent = presentAllergens.join(" ");

            // Price
            const price = document.createElement("div");
            price.className = "meal-price";
            price.textContent = `${meal.meal_price.toFixed(2)} €`;

            
            nameAllergensRow.append(name, allergens);
            namePriceRow.append(nameAllergensRow, price);
          
            // Ingredients
            const ingredients = document.createElement("div");
            ingredients.className = "meal-ingredients";

            const allIngredients = meal.ingredients
                .filter(Boolean) // retire les null/undefined
                .map(ing => ing.trim()) // retire les espaces inutiles
                .join(', ');

            ingredients.textContent = allIngredients;
            
          
            infoContainer.append(namePriceRow, ingredients);
          
            // Meal image
            const img = document.createElement("img");
            img.className = "meal-img";
          
            switch (meal.meal_type.toLowerCase()) {
              case "starter":
                img.src = "/images/menu-starters.jpg";
                break;
              case "meat":
                img.src = "/images/menu-meat.jpg";
                break;
              case "vegetarian":
                img.src = "/images/menu-vegeterian.jpg";
                break;
                case "vegeterian":
                img.src = "/images/menu-vegeterian.jpg";
                break;
              case "fish":
                img.src = "/images/menu-fish.jpg";
                break;
              case "dessert":
                img.src = "/images/menu-dessert.jpg";
                break;
              default:
                img.src = "/images/meaticon.png";
            }
          
            mealRow.append(infoContainer, img);
            section.appendChild(mealRow);
          });
      
        menuContainer.appendChild(section);
      }
  });