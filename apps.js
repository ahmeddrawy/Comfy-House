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
                /// save cart in local storage
                /// set cart values
                /// display cart items
                ///show the cart
            })
        
        })
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
}
/// listener
document.addEventListener("DOMContentLoaded" , function(){
    const ui = new UI();
    const products = new Products();
    products.getProducts().then((products)=>{
         ui.displayProducts(products)
         Storage.saveProducts(products);
    }).then(()=>{
        ui.getBtns();
    });
})
