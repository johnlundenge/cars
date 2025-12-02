
        // Mobile Menu Toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            menuToggle.textContent = navLinks.classList.contains('open') ? 'Close' : 'Menu';
        });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
                document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Filter Functionality
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const priceFilter = document.getElementById('priceFilter');
        const cars = document.querySelectorAll('.car-card');
        const searchBtn = document.querySelector('.btn-search');

        function filterCars() {
            const searchTerm = searchInput.value.toLowerCase();
            const typeValue = typeFilter.value;
            const priceValue = priceFilter.value;

            cars.forEach(car => {
                const title = car.querySelector('h3').textContent.toLowerCase();
                const type = car.dataset.type;
                const price = car.dataset.price;

                const matchesSearch = title.includes(searchTerm);
                const matchesType = typeValue === 'all' || type === typeValue;
                const matchesPrice = priceValue === 'all' || price === priceValue;

                if (matchesSearch && matchesType && matchesPrice) {
                    car.style.display = 'block';
                } else {
                    car.style.display = 'none';
                }
            });
        }

        searchBtn.addEventListener('click', filterCars);
        searchInput.addEventListener('input', filterCars);
        typeFilter.addEventListener('change', filterCars);
        priceFilter.addEventListener('change', filterCars);

        // Cart Functionality
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        function updateCartBadge() {
            const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            const badge = document.getElementById('cartCount');
            if (cartCount > 0) {
                badge.textContent = cartCount;
                badge.style.display = 'inline';
            } else {
                badge.style.display = 'none';
            }
        }

        function addToCart(carId) {
            const existingItem = cart.find(item => item.id === carId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id: carId, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartBadge();
            alert('Car added to cart!');
        }

        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const carId = parseInt(btn.dataset.id);
                addToCart(carId);
            });
        });

        // Initial cart badge update
        updateCartBadge();
