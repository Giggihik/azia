// static/js/menu-data.js
const dishesData = [
    { id: 1, name: "Фо Бо", description: "Традиционный вьетнамский суп с говядиной и рисовой лапшой.", price: 650, isPopular: true },
    { id: 2, name: "Том Ям", description: "Острый тайский суп с креветками и кокосовым молоком.", price: 890, isPopular: true },
    { id: 3, name: "Пад Тай", description: "Жареная рисовая лапша с креветками, тофу, арахисом.", price: 720, isPopular: true },
    { id: 4, name: "Удон с говядиной", description: "Толстая пшеничная лапша, говядина, овощи в соусе терияки.", price: 780, isPopular: false },
    { id: 5, name: "Гёдза", description: "Японские пельмени с курицей и овощами.", price: 420, isPopular: false },
    { id: 6, name: "Манго с клейким рисом", description: "Тайский десерт: кокосовый рис, свежее манго.", price: 390, isPopular: false },
    { id: 7, name: "Кимчи Чиге", description: "Острый корейский суп с тофу и кимчи.", price: 580, isPopular: false },
    { id: 8, name: "Лапша WOK с уткой", description: "Яичная лапша, утка, овощи в устричном соусе.", price: 850, isPopular: true }
];

function createDishCard(dish) {
    // Картинка берётся по id блюда: 1.jpg, 2.jpg и т.д.
    const imgSrc = `static/images/${dish.id}.jpg`;
    return `
        <div class="dish-card">
            <div class="dish-image">
                <img src="${imgSrc}" alt="${dish.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'no-img\'>[Фото блюда]</div>'">
            </div>
            <div class="dish-info">
                <h3 class="dish-title">${dish.name}</h3>
                <p>${dish.description.substring(0, 80)}${dish.description.length > 80 ? '…' : ''}</p>
                <div class="dish-price">${dish.price} ₽</div>
            </div>
        </div>
    `;
}

// Рендерим популярные блюда
const popularGrid = document.getElementById('popular-grid');
if (popularGrid) {
    const popularDishes = dishesData.filter(d => d.isPopular);
    popularGrid.innerHTML = popularDishes.map(createDishCard).join('');
}

// Рендерим полное меню
const fullMenuGrid = document.getElementById('full-menu-grid');
if (fullMenuGrid) {
    fullMenuGrid.innerHTML = dishesData.map(createDishCard).join('');
}