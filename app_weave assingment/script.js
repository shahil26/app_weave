function getHandle(id) {
    return document.getElementById(id);
}

function getHandleClass(className) {
    return document.querySelector('.' + className);
}

function getHandleAll(className) {
    return document.querySelectorAll('.' + className);
}

function onCartBtnPress() {
    const cart = getHandleClass('cart-wrapper');
    cart.classList.toggle('hidden');
    if (!cart.classList.contains('hidden')) {
        changeTotal();
    }
}

function remove(element) {
    element.remove();
    changeTotal();
}

function addToCart(btn) {
    const item = btn.closest('.product-card');
    const itemImg = item.querySelector('img').src;
    const itemName = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.card-text p').textContent.substring(1);

    const tableBody = getHandleClass('cart-table-body');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><img src="${itemImg}" alt="item" class="cart-item-img" width="50" height="50"><br>${itemName}</td>
        <td>${itemPrice}</td>
        <td><input type="number" value="1" class="cart-item-quantity" min="1"></td>
        <td>${Number(itemPrice)}</td>
        <td><button class="remove-item"><img src="remove.png" alt="" width="25" height="25"></button></td>
    `;
    tableBody.appendChild(tr);

    tr.querySelector('.cart-item-quantity').addEventListener('change', (event) => {
        const quantity = event.target.value;
        const price = tr.children[1].textContent;
        tr.children[3].textContent = (Number(price) * Number(quantity)).toFixed(2);
        changeTotal();
        event.stopPropagation();
    });

    tr.querySelector('.remove-item').addEventListener('click', (event) => {
        remove(tr);
        event.stopPropagation();
    });

    changeTotal();
}

function changeTotal() {
    const total = getHandle('cart-total');
    const trs = getHandleClass('cart-table-body').children;
    let sum = 0;
    for (let tr of trs) {
        sum += Number(tr.children[3].textContent);
    }
    total.textContent = sum.toFixed(2);
}

function applyFilters() {
    const genderFilter = getHandle('gender').value;
    const colorFilter = getHandle('color').value;
    const typeFilter = getHandle('type').value;
    const priceFilter = getHandle('price').value;

    const products = getHandleAll('product-card');
    products.forEach((product) => {
        const productGender = product.getAttribute('data-gender');
        const productColor = product.getAttribute('data-color');
        const productType = product.getAttribute('data-type');
        const productPrice = Number(product.getAttribute('data-price'));

        let priceMin = 0, priceMax = Infinity;
        if (priceFilter) {
            const priceRange = priceFilter.split('-');
            priceMin = Number(priceRange[0]);
            priceMax = Number(priceRange[1]);
        }

        const matchesGender = !genderFilter || productGender === genderFilter;
        const matchesColor = !colorFilter || productColor === colorFilter;
        const matchesType = !typeFilter || productType === typeFilter;
        const matchesPrice = !priceFilter || (productPrice >= priceMin && productPrice <= priceMax);

        if (matchesGender && matchesColor && matchesType && matchesPrice) {
            product.parentElement.style.display = 'block';
        } else {
            product.parentElement.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = getHandle('mycart');
    cartBtn.addEventListener('click', onCartBtnPress);

    const closeCart = getHandleClass('cart-wrapper');
    closeCart.addEventListener('click', (event) => {
        const cartContainer = getHandleClass('cart-container');
        if (!cartContainer.contains(event.target)) {
            onCartBtnPress();
        }
    });

    const itemBtns = getHandleAll('addToCartBtn');
    itemBtns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            addToCart(event.target);
        });
    });

    const filterForm = getHandle('filter-form');
    filterForm.addEventListener('change', applyFilters);

    // Add event listener for search functionality
    getHandle('search-input').addEventListener('keyup', function() {
        let filter = this.value.toLowerCase();
        let productList = getHandle('product-list');
        let products = productList.getElementsByClassName('product-card');

        Array.from(products).forEach(function(product) {
            let productName = product.getAttribute('data-name').toLowerCase();
            if (productName.includes(filter)) {
                product.parentElement.style.display = "";
            } else {
                product.parentElement.style.display = "none";
            }
        });
    });

    applyFilters(); // Initial application of filters on page load
});
