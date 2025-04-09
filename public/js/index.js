const menuContainer = document.getElementsByClassName('simulated-menu-screen')[0];
const screenContainer = document.getElementById('Screens');


function addToMenu(meal) {
  const meal_type = "menu_" + meal.meal_type;
  var MenuRow = document.getElementById(meal_type);

  if (!MenuRow) {
    console.log("init");

    const NewMenuRow = document.createElement("div");
    NewMenuRow.className = "menu-row";
    NewMenuRow.id = meal_type;

    const menuInfo = document.createElement("div");
    menuInfo.className = "menu-info";

    const mealType = document.createElement("spam");
    mealType.className = "meal-type";
    mealType.textContent = meal.meal_type.toUpperCase();

    menuInfo.append(mealType);

    const image = document.createElement("img");
    image.className = "meal-image";
    switch (meal.meal_type.toLowerCase()) {
      case "starter":
        image.src = "/images/menu-starters.jpg";
        break;
      case "meat":
        image.src = "/images/menu-meat.jpg";
        break;
      case "vegetarian":
        image.src = "/images/menu-vegeterian.jpg";
        break;
        case "vegeterian":
        image.src = "/images/menu-vegeterian.jpg";
        break;
      case "fish":
        image.src = "/images/menu-fish.jpg";
        break;
      case "dessert":
        image.src = "/images/menu-dessert.jpg";
        break;
      default:
        image.src = "/images/meaticon.png";
    }
    
    NewMenuRow.append(menuInfo, image);
    menuContainer.append(NewMenuRow);

    MenuRow = document.getElementById(meal_type);

    console.log(MenuRow);
  }

  const menuInfo = MenuRow.firstElementChild;

  const mealInfo = document.createElement("div");
  mealInfo.className = "meal-info";

  const mealName = document.createElement("spam");
  mealName.className = "meal-name";

  const allergenIcons = {
    Gluten: "🌾",
    Dairy: "🥛",
    Eggs: "🥚",
    Peanuts: "🥜",
    Soy: "🌱"
  };

  const presentAllergens = Object.entries(meal.allergens || {})
    .filter(([_, value]) => value === true)
    .map(([key]) => allergenIcons[key] || key)
    .join(" ");

  mealName.textContent = "-  " + meal.meal_name + "  " + presentAllergens;

  const mealPrice = document.createElement("spam");
  mealPrice.className = "meal-price";
  mealPrice.textContent = "€" + meal.meal_price;

  mealInfo.prepend(mealName, mealPrice);
  menuInfo.append(mealInfo);
}




function addToScreen(meal){
  const meal_type = meal.meal_type
  var MealScreen = document.getElementById(meal_type);

  if (!MealScreen) {
    const NewMealScreen = document.createElement("div");
    NewMealScreen.className = "slider-item";
    NewMealScreen.id = meal_type;

    const wrapper = document.createElement("div");
    wrapper.className = "info-screen-wrapper";

    const title = document.createElement("h2");
    title.className = "dish-type-title";
    title.textContent = "Dish Type: " + meal_type;

    wrapper.append(title);
    NewMealScreen.append(wrapper);

    screenContainer.append(NewMealScreen);
    MealScreen = document.getElementById(meal_type);

    console.log(MealScreen);
  }
  

  const wrap = MealScreen.firstElementChild;
  
  const dish = document.createElement("div");
  dish.className = "info-dish";

  const dish_header = document.createElement("div");
  dish_header.className = "info-dish-header";

  const name = document.createElement("spam");
  name.className = "dish-name";
  name.textContent = meal.meal_name;

  const allergens = document.createElement("spam");
  allergens.className = "allergens";

  const allergenIcons = {
    Gluten: "🌾",
    Dairy: "🥛",
    Eggs: "🥚",
    Peanuts: "🥜",
    Soy: "🌱"
  };

  const presentAllergens = Object.entries(meal.allergens || {})
    .filter(([_, value]) => value === true)
    .map(([key]) => allergenIcons[key] || key);

  allergens.textContent = presentAllergens.join(" ");

  dish_header.append(name, allergens);

  // Ingredients line
  const ingredients = document.createElement("p");
  const stron_ing = document.createElement("strong");
  stron_ing.textContent = "Ingredients: "

  const ingredients_text = meal.ingredients.join(", ");

  ingredients.append(stron_ing, ingredients_text);

  // Nutritional line
  const nutritional = document.createElement("p");
  const stron_nut = document.createElement("strong");
  stron_nut.textContent = "Nutritional values: "

  const units = {
    Calories: "kcal",
    Protein: "g protein",
    Fat: "g fat",
    Sugar: "g sugar"
  };
  
  const nutrientText = Object.entries(meal.nutrients)
    .map(([key, val]) => `${val} ${units[key] || key}`)
    .join(", ");

  const nutritional_text = nutrientText;

  nutritional.append(stron_nut, nutritional_text);

  dish.append(dish_header, ingredients, nutritional);
  wrap.append(dish);
}


function initCarousel(sectionClass) {
  let index = 0;
  const section = document.querySelector(sectionClass);
  const slides = section.querySelectorAll('.slider-item');
  const left = section.querySelector('.arrow.left');
  const right = section.querySelector('.arrow.right');

  const updateSlides = () => {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
  };

  left.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlides();
  });

  right.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    updateSlides();
  });

  updateSlides();
}



document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/meals');
  const meals = await response.json();

  const menuMeals = meals.filter(m => m.inMenu);

  console.log(menuMeals);


  for (const meal of menuMeals) {
    addToMenu(meal);
    addToScreen(meal);
  }

  const first_carousel = screenContainer.firstElementChild;
  first_carousel.className = "slider-item active";

  initCarousel('.carousel-entry-screen');
  initCarousel('.carousel-stand-screen');
});






