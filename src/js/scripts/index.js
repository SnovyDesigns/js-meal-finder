import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

// ----------------------------------------------

const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

// ----------------------------------------------

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal and meals
  single_mealEl.innerHTML = '';
  single_mealEl.style.display = 'none';
  mealsEl.innerHTML = '';

  // Get the search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        showHeading(`Search results for '${term}'`);

        if (!data.meals) {
          showHeading('Thera are no search results. Try again!', true);
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              meal =>
                `
          <div class="meals__single" data-mealid="${meal.idMeal}">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2 class="meals__title caption">${meal.strMeal}</h2>
          </div>
          `
            )
            .join('');
        }

        // Clear search text
        search.value = '';
      });
  } else {
    showHeading('Please enter a search term!', true);
  }
}

// Fetch random meal from API
function getRandomMeal(e) {
  e.preventDefault();

  // Clear meals and heading
  single_mealEl.innerHTML = '';
  single_mealEl.style.display = 'none';
  mealsEl.innerHTML = '';
  resultHeading.style.opacity = 0;

  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Fetch meal by ID
function getMealById(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  // Show single meal
  single_mealEl.style.display = 'block';
  single_mealEl.innerHTML = `
    <div class="meal__top">
      <div class="meal__foto">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      </div>
      <div class="meal__info-wrapper">
        <h2 class="meal__title heading-secondary">${meal.strMeal}</h2>
        ${
          meal.strCategory
            ? `<div class="meal__info">
                <i class="fas fa-utensils-alt"></i>
                <h3 class="heading-tertiary">${meal.strCategory}</h3>
              </div>`
            : ''
        }
        ${
          meal.strArea
            ? `<div class="meal__info">
                <i class="fas fa-globe-stand"></i>
                <h3 class="heading-tertiary">${meal.strArea}</h3>
              </div>`
            : ''
        }
      </div>
    </div>
    <div class="meal__ingredients">
        <p class="lead lead--show">Ingredients</p>
        <ul class="meal__ingredients-list">
          ${ingredients
            .map(ing => `<li class="meal__ingredient">${ing}</li>`)
            .join('')}
        </ul>
    </div>
    <p class="meal__body">${meal.strInstructions}</p>
  `;
}

// Show result heading
function showHeading(msg, hideHeading = false) {
  resultHeading.style.opacity = 1;
  resultHeading.textContent = msg;

  if (hideHeading) {
    setTimeout(() => {
      resultHeading.style.opacity = 0;
    }, 3000);
  }
}

// ----------------------------------------------

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
  if (!e.target.closest('.meals__single')) return;
  let meal;
  if (e.path) {
    meal = e.path.find(item => item.classList.contains('meals__single'));
  } else {
    meal = e
      .composedPath()
      .find(item => item.classList.contains('meals__single'));
  }
  const mealID = meal.dataset.mealid;
  getMealById(mealID);
  gsap.to(window, { duration: 0.75, scrollTo: single_mealEl });
});
