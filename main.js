// array care contine produsele adaugate in cos
let cart = [];

// indexul curent pentru sliderul de recenzii
let currentSlideIndex = 0;

// afiseaza o sectiune si ascunde toate celelalte
function showSection(id) {
    // ascunde toate sectiunile
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    
    // selecteaza sectiunea ceruta dupa id
    const section = document.getElementById(id);
    if(section) section.style.display = 'block';
    
    // selecteaza butonul plutitor al cosului
    const cartBtn = document.getElementById('floating-cart-btn');

    // ascunde cosul pe pagina cart si demo
    if(id === 'cart' || id === 'demo-page') {
        cartBtn.style.display = 'none';
    } else {
        cartBtn.style.display = 'block';
    }

    // daca intram pe cos, randam continutul
    if(id === 'cart') renderCart();
    
    // muta pagina in partea de sus
    window.scrollTo(0,0);

    // resetare si initializare slider cand intram pe recenzii
    if(id === 'reviews') {
        currentSlideIndex = 0;
        setTimeout(() => {
            initSliderDots();
            updateSliderUI();
        }, 50);
    }
}

// adauga un produs in cos
function addToCart(name, price, image) {
    // cauta daca produsul exista deja
    let existing = cart.find(item => item.name === name);

    if (existing) {
        // mareste cantitatea pana la maxim 50
        if(existing.quantity < 50) existing.quantity++;
    } else {
        // adauga produs nou in cos
        cart.push({ name, price, image, quantity: 1 });
    }

    // actualizeaza numarul din iconita cosului
    updateCartCount();

    // alerta de confirmare
    alert(`${name} a fost adăugat!`);
}

// actualizeaza numarul total de produse din cos
function updateCartCount() {
    document.getElementById('cart-count').innerText =
        cart.reduce((acc, item) => acc + item.quantity, 0);
}

// afiseaza produsele din cos
function renderCart() {
    const container = document.getElementById('cart-items-container');
    const footer = document.getElementById('cart-footer');
    const totalElem = document.getElementById('cart-total');
    
    // curata continutul anterior
    container.innerHTML = '';
    let totalPrice = 0;

    // daca cosul este gol
    if (cart.length === 0) {
        container.innerHTML = '<p style="font-size: 1.5rem; padding: 20px;">Coșul este gol momentan.</p>';
        footer.style.display = 'none';
        return;
    }

    // parcurge fiecare produs din cos
    cart.forEach((item, index) => {
        // calculeaza totalul
        totalPrice += item.price * item.quantity;
        
        // adauga html pentru fiecare produs
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    
                    <div class="qty-container">
                        <span class="qty-label">Cantitate:</span>
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <span class="qty-unit">buc.</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>

                </div>
                <div class="item-total-price">
                    ${item.price * item.quantity} lei
                </div>
            </div>`;
    });

    // afiseaza totalul cosului
    totalElem.innerText = totalPrice;
    footer.style.display = 'block';
}

// modifica cantitatea unui produs
function updateQty(index, change) {
    // crestere cantitate
    if (change === 1 && cart[index].quantity < 50) {
        cart[index].quantity++;
    }
    // scadere cantitate
    else if (change === -1 && cart[index].quantity > 1) {
        cart[index].quantity--;
    }
    // stergere produs daca ajunge sub 1
    else if (change === -1) { 
        if(confirm("Ștergi produsul din coș?")) cart.splice(index, 1); 
    }

    // actualizeaza cosul
    updateCartCount();
    renderCart();
}

// redirectionare catre pagina demo
function goToDemoPage(type) {
    // selectam elementele din pagina demo
    const titleElement = document.getElementById('demo-title');
    const messageElement = document.getElementById('demo-message');
    const noteElement = document.getElementById('demo-note');

    if (type === 'social') {
        // cazul butoanelor social media
        titleElement.innerText = "Mulțumim pentru interes!";
        messageElement.innerHTML =
            "Aceasta este o versiune DEMO a site-ului.<br><br> Paginilie nu sunt active încă în acest exemplu.";
        noteElement.style.display = 'none';
    } else {
        // cazul checkout
        titleElement.innerText = "Mulțumim pentru interes!";
        messageElement.innerText = "Aceasta este o versiune DEMO a site-ului.";
        noteElement.style.display = 'block';
        noteElement.innerText = "Funcționalitatea de plată nu este activă în acest exemplu.";
    }

    // afiseaza pagina demo
    showSection('demo-page');
}

// muta sliderul de recenzii stanga sau dreapta
function moveSlider(direction) {
    const cards = document.querySelectorAll('.review-card');
    const slider = document.getElementById('slider');
    
    // latimea unui card + spatiu
    const cardWidth = cards[0].offsetWidth + 20;

    // cate carduri sunt vizibile
    const visibleCards = Math.floor(slider.clientWidth / cardWidth);

    // index maxim permis
    const maxIndex = Math.max(0, cards.length - visibleCards);

    // modifica indexul curent
    currentSlideIndex += direction;
    
    // limiteaza indexul
    if (currentSlideIndex < 0) currentSlideIndex = 0;
    if (currentSlideIndex > maxIndex) currentSlideIndex = maxIndex;
    
    // actualizeaza sliderul
    updateSliderUI();
}

// creeaza punctele de navigare pentru slider
function initSliderDots() {
    const cards = document.querySelectorAll('.review-card');
    const slider = document.getElementById('slider');
    const dotsContainer = document.getElementById('dotsContainer');
    
    // curata punctele existente
    dotsContainer.innerHTML = ''; 
    
    const cardWidth = cards[0].offsetWidth + 20;
    const visibleCards = Math.floor(slider.clientWidth / cardWidth);
    const maxIndex = Math.max(0, cards.length - visibleCards);

    // creeaza cate un punct pentru fiecare pozitie
    for(let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');

        if (i === currentSlideIndex) dot.classList.add('active');
        
        // click pe punct
        dot.onclick = () => {
            currentSlideIndex = i;
            updateSliderUI();
        };

        dotsContainer.appendChild(dot);
    }
}

// actualizeaza pozitia sliderului si starea butoanelor
function updateSliderUI() {
    const slider = document.getElementById('slider');
    const cards = document.querySelectorAll('.review-card');
    
    // iesire daca nu exista carduri
    if(cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 20;
    const visibleCards = Math.floor(slider.clientWidth / cardWidth);
    const maxIndex = Math.max(0, cards.length - visibleCards);

    // muta sliderul
    slider.scrollTo({
        left: currentSlideIndex * cardWidth,
        behavior: 'smooth'
    });
    
    // activeaza sau dezactiveaza sagetile
    document.getElementById('prevBtn').disabled = (currentSlideIndex === 0);
    document.getElementById('nextBtn').disabled = (currentSlideIndex >= maxIndex);
    
    // actualizeaza punctele
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        if(idx === currentSlideIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

// la incarcarea paginii
window.onload = () => {
    // afiseaza home implicit
    showSection('home');

    // initializeaza sliderul dupa incarcare
    setTimeout(() => {
        initSliderDots();
        updateSliderUI();
    }, 100);
};

// la redimensionarea ferestrei
window.onresize = () => {
    // recalculeaza sliderul
    initSliderDots();
    updateSliderUI();
};