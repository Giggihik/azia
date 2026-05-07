document.addEventListener('DOMContentLoaded', () => {
    const menuGrid = document.getElementById('menuGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let cart = {};

    const cartIcon = document.getElementById('cartIcon');
    const cartBadge = document.getElementById('cartBadge');
    const cartPanel = document.getElementById('cartPanel');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const closeCartBtn = document.getElementById('closeCart');
    const clearCartBtn = document.getElementById('clearCart');
    const notification = document.getElementById('notification');

    function showNotification(text, isSuccess = true) {
    notification.textContent = text;
    notification.className = `notification ${isSuccess ? 'notification--success' : 'notification--error'}`;
    notification.classList.add('notification--show');
    setTimeout(() => {
        notification.classList.remove('notification--show');
    }, 2500);
    }

    function toggleCart(show) {
        if (show) {
            cartPanel.classList.add('open');
            cartOverlay.classList.add('open');
        } else {
            cartPanel.classList.remove('open');
            cartOverlay.classList.remove('open');
        }
    }

    clearCartBtn.addEventListener('click', () => {
    cart = {};
    updateCartUI();
    renderCurrentCategory();
    showNotification('Корзина очищена', true);
    });

    cartIcon.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));

    const checkoutBtn = document.querySelector('.cart-panel__checkout');
    checkoutBtn.addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            showNotification('Корзина пуста', false);
            return;
        }
        showNotification('Заказ оформлен! Спасибо! 🎉', true);
        cart = {};
        updateCartUI();
        renderCurrentCategory();
        toggleCart(false);
    });
    function updateCartUI() {
        let totalCount = 0;
        let totalPrice = 0;
        let itemsHTML = '';

        if (Object.keys(cart).length === 0) {
            itemsHTML = '<p class="cart-panel__empty">Корзина пуста</p>';
        } else {
            for (const id in cart) {
                const qty = cart[id];
                const item = menuItems.find(m => m.id == id);
                if (!item || qty === 0) continue;
                totalCount += qty;
                totalPrice += item.price * qty;
                itemsHTML += `
                    <div class="cart-item">
                        <span class="cart-item__name">${item.name}</span>
                        <div class="cart-item__qty">
                            <button class="qty-btn" data-id="${id}" data-action="dec">−</button>
                            <span class="qty-value">${qty}</span>
                            <button class="qty-btn" data-id="${id}" data-action="inc">+</button>
                        </div>
                        <span class="cart-item__price">${item.price * qty} ₽</span>
                    </div>
                    <div class="cart-panel__header">
                        <h2>Ваш заказ</h2>
                        <div class="cart-panel__header-actions">
                            <button class="cart-panel__clear" id="clearCart">Очистить</button>
                            <button class="cart-panel__close" id="closeCart">&times;</button>
                        </div>
                    </div>
                `;
            }
        }

        cartBadge.textContent = totalCount;
        cartTotalEl.textContent = totalPrice;
        cartItemsContainer.innerHTML = itemsHTML;

        document.querySelectorAll('.cart-item .qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const action = e.currentTarget.dataset.action;
                if (action === 'inc') {
                    cart[id] = (cart[id] || 0) + 1;
                } else if (action === 'dec') {
                    cart[id]--;
                    if (cart[id] <= 0) delete cart[id];
                }
                updateCartUI();
                renderCurrentCategory(); 
            });
        });
    }


    function getActiveCategory() {
        const activeBtn = document.querySelector('.filter-btn.active');
        return activeBtn ? activeBtn.dataset.category : 'all';
    }

    function renderMenu(category = 'all') {
        menuGrid.innerHTML = '';
        const filtered = category === 'all'
            ? menuItems
            : menuItems.filter(item => item.category === category);

        filtered.forEach(item => {
            const inCartQty = cart[item.id] || 0;
            const card = document.createElement('div');
            card.className = 'menu-card animate';
            card.innerHTML = `
                <div class="menu-card__image">
                    <img src="${STATIC_URL}${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="menu-card__content">
                    <h3 class="menu-card__title">${item.name}</h3>
                    <p class="menu-card__desc">${item.description}</p>
                    <div class="menu-card__footer">
                        <span class="menu-card__price">${item.price} ₽</span>
                        ${inCartQty > 0 
                            ? `<div class="quantity-control">
                                <button class="qty-btn qty-dec" data-id="${item.id}">−</button>
                                <span class="qty-value">${inCartQty}</span>
                                <button class="qty-btn qty-inc" data-id="${item.id}">+</button>
                               </div>`
                            : `<button class="btn btn--red menu-card__btn" data-id="${item.id}">Заказать</button>`
                        }
                    </div>
                </div>
            `;
            menuGrid.appendChild(card);
        });

        document.querySelectorAll('.menu-card__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                cart[id] = 1;
                updateCartUI();
                renderCurrentCategory();
            });
        });

        document.querySelectorAll('.quantity-control .qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                if (e.currentTarget.classList.contains('qty-inc')) {
                    cart[id] = (cart[id] || 0) + 1;
                } else if (e.currentTarget.classList.contains('qty-dec')) {
                    cart[id]--;
                    if (cart[id] <= 0) delete cart[id];
                }
                updateCartUI();
                renderCurrentCategory();
            });
        });
    }

    function renderCurrentCategory() {
        renderMenu(getActiveCategory());
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenu(btn.dataset.category);
        });
    });

    renderMenu('all');
    updateCartUI();
});