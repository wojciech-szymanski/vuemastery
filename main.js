var eventBus = new Vue();

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template: `
        <div class="product">              
            <div class="product-image">
                <img :src="image" >
            </div>
            <div class="product-info">
                <h1>{{ title }} <span class="on-sale" v-show="onSale">In Sale!</span></h1>
                <p v-if="inStock > 10">In stock</p>
                <p v-else-if="inStock <= 10 && inStock > 0">Seeling quickly</p>
                <p v-else>Out of stock</p>
                <p>Shipping: {{ shipping }}</span>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
                <hr />
                <div class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.id"
                    :style="{ backgroundColor: variant.color }"
                    @mouseover="updateProduct(index)"
                ></div>  
                <button
                    @click="addToCart"
                    :class="{ 'disabled-button': inStock === 0 }"
                    :disabled="inStock === 0"
                >Add to cart</button> 
            </div>
            <product-tabs :reviews="reviews"></product-tabs>
        </div>
    `,
    data() {
        return {
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
            reviews: [],
        };
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].id);
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
        shipping() {
            if (this.premium) {
                return 'Free';
            }

            return 2.99;
        },
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
});

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            requirted: false,
        },
    },
    template: `
    <div class="review-list">
        <div>
            <span class="tab" 
                v-for="(tab, index) in tabs" 
                :key="index"
                :class="{ activeTab: selectedTab === tab }"
                @click="selectedTab = tab"
            >{{ tab }}</span>
        </div>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="(review, index) in reviews" :key="index">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Add a Review'">
            <product-review></product-review>
        </div>
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Add a Review'],
            selectedTab: 'Reviews',
        };
    },
});

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <div v-if="errors.length">
                <h3>Please correct the following errors:</h3>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </div>
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" />
            </p>
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            <p>
                <input type="submit" value="Submit" />
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            let fields = ['name', 'review', 'rating'];
            this.errors = [];
            if (fields.every(field => !!this[field])) {
                eventBus.$emit('review-submitted', {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                });
                fields.forEach(field => this[field] = null);
            } else {
                fields
                    .filter(field => !this[field])
                    .forEach(field => {
                        this.errors.push(`${field} required`);
                    });
            }
        },
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
    }
});
