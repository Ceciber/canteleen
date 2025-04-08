async function loadMeals() {
    const response = await fetch('/meals');
    const meals = await response.json();

    // Filtrer les repas qui sont dans le menu et de type "Meat"
    const menuMeals = meals.filter(m => m.inMenu && m.meal_type === 'Meat');

    const mealsContainer = document.getElementById('meals-container');

    // Parcourir les repas filtrés
    menuMeals.forEach((meal, index) => {
        console.log(meal.nutrients);

        const mealRow = document.createElement("div");
        mealRow.className = "meal-row";

        // Conteneur des informations du repas
        const infoContainer = document.createElement("div");
        infoContainer.className = "meal-info";

        // Nom + Allergènes + Prix
        const namePriceRow = document.createElement("div");
        namePriceRow.className = "name-price-row";

        const nameAllergensRow = document.createElement("div");
        nameAllergensRow.className = "name-allergens-row";

        const name = document.createElement("div");
        name.className = "meal-name";
        name.textContent = meal.meal_name;

        // Allergènes
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

        // Prix
        const price = document.createElement("div");
        price.className = "meal-price";
        price.textContent = `${meal.meal_price.toFixed(2)} €`;

        nameAllergensRow.append(name, allergens);
        namePriceRow.append(nameAllergensRow, price);

        // Ingrédients
        const ingredients = document.createElement("div");
        ingredients.className = "meal-ingredients";

        const allIngredients = meal.ingredients
            .filter(Boolean) // Retirer null/undefined
            .map(ing => ing.trim()) // Retirer les espaces inutiles
            .join(', ');

        ingredients.textContent = `Ingredients: ${allIngredients}`;

        infoContainer.append(namePriceRow, ingredients);

        // Valeurs nutritionnelles
        const nutrients_block = document.createElement("div");
        nutrients_block.className = "meal-nutrients-block";

        // const nutrientIcons = Object.entries(meal.nutrients || {}).map(([key, value]) => {
        //     const roundedValue = Math.round(value * 10);
        //     return `
        //     <div class="nutrient-icon">
        //         <img src="/charts/${key}_${roundedValue}.png" alt="${key}">
        //         <div>${key}</div>
        //     </div>
        //     `;
        // }).join('');

        // nutrients.innerHTML = `<strong>Nutritional values:</strong><div class="nutrient-icons">${nutrientIcons}</div>`;
        

        const nutrientsRow = document.createElement("div");
        nutrientsRow.className = "nutrients-row";  // Utilisation de la classe CSS

        const nutricient = document.createElement("div");
        nutricient.innerText = "Nutricional Value :";

        // Table des valeurs nutritionnelles sans en-tête
        const nutrientsTable = document.createElement("table");
        nutrientsTable.className = "nutrients-table";  // Utilisation de la classe CSS

        // Corps de la table des nutriments
        const tbody = document.createElement('tbody');

        // Première ligne : pourcentages
        const percentageRow = document.createElement('tr');
        Object.entries(meal.nutrients || {}).forEach(([key, value]) => {
            const tdValue = document.createElement('td');
            tdValue.textContent = `${Math.round(value * 10)} %`;  // Arrondi à 10x la valeur
            percentageRow.appendChild(tdValue);
        });
        tbody.appendChild(percentageRow);

        // Dernière ligne : noms des nutriments
        const nameRow = document.createElement('tr');
        Object.keys(meal.nutrients || {}).forEach((nutrient) => {
            const tdNutrient = document.createElement('td');
            tdNutrient.textContent = nutrient;
            nameRow.appendChild(tdNutrient);
        });
        tbody.appendChild(nameRow);

        nutrientsTable.appendChild(tbody);

        // Ajout du texte et du tableau au conteneur
        nutrientsRow.append(nutricient, nutrientsTable);
        mealRow.append(infoContainer, nutrientsRow);
        mealsContainer.appendChild(mealRow);
    });
  }

  loadMeals();