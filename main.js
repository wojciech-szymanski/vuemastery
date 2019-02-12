var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        brand: 'Vue Mastery',
        selectedVariant: 0,
        onSale: true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral '],
        variants: [{
            id: 2334,
            color: 'green',
            image: './assets/vmSocks-green.jpg',
            quantity: 0,
        }, {
            id: 2335,
            color: 'blue',
            image: './assets/vmSocks-blue.jpg',
            quantity: 10,
        }],
        cart: 0,
    },
    methods: {
        addToCart() {
            this.cart += 1;
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    computed: {
        title() {
            return `${this.brand} ${this.product}`;
        },
        image() {
            return this.variants[this.selectedVariant].image;
        },
        inStock() {
            return this.variants[this.selectedVariant].quantity;
        },
    }
});