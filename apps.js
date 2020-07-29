// variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
let cart = []
//btns
let buttonsDOM = [];
// classes 
// class for products and get them
class Products{
    async getProducts(){
        try {
            let result = await fetch('products.json');
            let data=  await result.json();
            let products = data['items'];
            products = products.map(item=>{
                const {title,price} = item['fields'];
                const {id} = item['sys'];
                const image= item['fields']['image']['fields']['file']['url'];
                return {title,price,id,image};

            })
            return products;
        } catch (error) {
            console.log('error -1');
            console.log(error);
        }
    }
}
// display products
class UI{
    displayProducts(products){
        let result ='';
        products.forEach(product=> {
            result+=`
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product['id']}>
                        <i class="fas fa-shopping-cart"></i>
                        add to bag
                    </button>

                </div>
                <h3>${product['title']}</h3>
                <h4>$${product['price']}</h4>
            </article>
            
            `
        });
        productsDOM.innerHTML= result;
    }
    getBtns(){
        const btns = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = btns;
        btns.forEach(btn=>{
            let id = btn.dataset.id;
            let inCart = cart.find(item=> item.id===id);
            if(inCart){
                btn.innerText= "in cart";
                btn.disabled= true ; 
            }
            
            btn.addEventListener("click",(event)=>{
                event.target.innerText = "in cart";
                event.target.disabled = true;
                /// get product from products local storage
                let cartItem ={...Storage.getProduct(id),amount:1}; ///spreading and adding amount property to the product
                /// add product to cart
                cart = [...cart , cartItem];
                /// save cart in local storage
                Storage.saveCart(cart);
                /// set cart values
                this.setCartValue(cart);
                /// display cart items'
                this.addCartItem(cartItem);
                ///show the cart
                this.showCart();
            })
        
        })
    }
    setCartValue(cart){
        let tempTotal = 0;
        let itemsTotal = 0 ;
        cart.map(item=>{
            tempTotal+= item.price *item.amount;
            itemsTotal+=item.amount;
        });
        cartItems.innerText = itemsTotal;
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML =`
            <img src=${item.image} alt="product">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>$${item.price}</h5>
                        <span class="remove-item" data-id=${item.id} > remove </span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id=${item.id}></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="fas fa-chevron-down" data-id=${item.id}></i>
                    </div>
        
        `
        cartContent.appendChild(div);
    }
    showCart(){
        cartDOM.classList.add('showCart');
        cartOverlay.classList.add('transparentBcg');
    }
    hideCart(){
        cartDOM.classList.remove('showCart');
        cartOverlay.classList.remove('transparentBcg');
    }
    setupAPP(){
        cart  = Storage.getCart();
        this.setCartValue(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click',this.hideCart); /// todo
    }
    populateCart(cart){
        cart.forEach(item=>{
            this.addCartItem(item);
        })
    }
    cartLogic(){
        /// clear cart btn
        clearCartBtn.addEventListener('click',()=>{this.clearCart()});
        
    }
    clearCart(){
        let cartItems = cart.map(item=>item.id);
        cartItems.forEach(id=>{
            this.removeItem(id);
        });
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item=>item.id!==id);
        this.setCartValue(cart);
        Storage.saveCart(cart);
        let btn = this.getSingleButton(id);
        btn.disabled = false; 
        btn.innerHTML=`<i class="fas fa-shopping-cart"></i> add to cart`
    }
    getSingleButton(id){
        return buttonsDOM.find(btn=>{
           return btn.dataset.id ===id;
        });
    }

}
/// local storage class
class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProduct(id){
        let prods = JSON.parse(localStorage.getItem("products"));
        return prods.find(item=> item.id ===id);
    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) : [];
    }
}
/// listener
document.addEventListener("DOMContentLoaded" , function(){
    const ui = new UI();
    const products = new Products();
    ui.setupAPP();
    products.getProducts().then((products)=>{
         ui.displayProducts(products)
         Storage.saveProducts(products);
    }).then(()=>{
        ui.getBtns();
        ui.cartLogic();
    });
})
