// //! npm run dev
//* URL Base
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/";
//* Mostrar y ocultar carrito
const cartToggle = document.querySelector('.cart_toggle');
const cartBlock = document.querySelector('.cart_block');
//* Dibujar productos
const productsList = document.querySelector('#products-container');
//* Carrito
const cart = document.querySelector('#cart');
const cartList = document.querySelector('#cart_list');
//* Vaciar carrito
emptyCartButton = document.querySelector('#empty_cart')
//? Necesito tener un array que reciba los elementos que debo introducir en el carrito de compras.
let cartProducts = [];
//* Modal
const modalContainer = document.querySelector('#modal-container');
const modalElement = document.querySelector('#modal');
let modalDetails = [];
//* lógica para mostrar y ocultar el carrito
cartToggle.addEventListener('click', () => {
  cartBlock.classList.toggle("nav_cart_visible")
  //* Alterna entre poner y quitar la clase
})
//! Vamos a crear una función que contenga y que ejecute todos los Listeners al inicio de la carga del código.
eventListenersLoader()
function eventListenersLoader() {
  //* Cuando se presione el botón "Add to cart"
  productsList.addEventListener('click', addProduct)
  //* Cuando se presione el botón "Delete"
  cart.addEventListener('click', deleteProduct)
  //* Cuando se presione el botón "Empty cart"
  emptyCartButton.addEventListener('click', emptyCart)
  //* Se ejecuta cuando se carga la página
  document.addEventListener('DOMContentLoaded', () => {
    cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
    cartElementsHTML();
  })
  //* Cuando se presione el botón "View Details"
  productsList.addEventListener('click', modalProduct);
  //* Cuando se presione el botón para cerrar la ventana modal
  modalContainer.addEventListener('click', closeModal);
}
function getProducts() {
  axios.get(baseUrl)
    .then(function (response){
      const products = response.data
      printProducts(products)
    })
    .catch(function(error){
      console.log(error)
    })
}
getProducts()
function printProducts(products){
  let html = '';
  for(let i = 0; i < products.length; i++){
    html += `
    <div class='product_container'>
      <div class='product_container_img'>
        <img src="${products[i].image}" alt="image">
      </div>
      <div class="product_container_name">
        <p>${products[i].name}</p>
      </div>
      <div class="product_container_price">
        <p>$ ${products[i].price.toFixed(2)}</p>
      </div>
      <div class="product_container_button">
        <button class="cart_button add_to_cart" id="add_to_cart" data-id="${products[i].id}">Add to cart</button>
        <button class="product_details" data-id="${products[i].id}">View Details</button>
      </div>
    </div>
    `
  }
  productsList.innerHTML = html
}
//* Agregar productos al carrito
//* 1. Capturar la información del producto clickeado
function addProduct(event){
  if(event.target.classList.contains('add_to_cart')){
    const product = event.target.parentElement.parentElement
    // parentElement nos ayuda a acceder al padre inmediatamente superior del elemento.
    cartProductsElements(product)
  }
}
//* 2. Transoframar a un array de objetos
//* 2.1 Validar si el elemento está dentro del carrito para no repetirlo
function cartProductsElements(product){
  const infoProduct = {
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product_container_name p').textContent,
    price: product.querySelector('.product_container_price p').textContent,
    quantity: 1
  }
  //* Agregar un contador
  // some, valida si existe algún elemento dentro del array que cumpla la condición
  if(cartProducts.some(product => product.id === infoProduct.id)){
    // Si el producto al que le doy click en infoProduct ya existe en carProducts, entonces:
    const product = cartProducts.map(product => {
      // Actualizar quantity
      if(product.id === infoProduct.id){
        product.quantity ++;
        return product;
      } else {
        return product;
      }
    })
    cartProducts = [...product]
  } else {
    cartProducts = [...cartProducts, infoProduct]
  }
  console.log(cartProducts)
  cartElementsHTML()
}
//* 3. Mostrar los productos en el carrito
function cartElementsHTML(){
  //! Depuramos los duplicados reinicializando el contenedor cartList con innerHTML vacío
  cartList.innerHTML = "";
  cartProducts.forEach(product => {
    const div = document.createElement('div');
    // createElement, permite crear etiquetas desde el DOM.
    div.innerHTML = `
      <div class="cart_product">
        <div class="cart_product_image">
          <img src="${product.image}">
        </div>
        <div class="cart_product_description">
          <p>${product.name}</p>
          <p>Precio: $ ${(parseFloat(product.price.replace(/[^0-9.-]+/g,""))*product.quantity).toFixed(2)}</p>
          <p>Cantidad: ${product.quantity}</p>
        </div>
        <div class="cart_product_button">
          <button class="delete_product" data-id="${product.id}">
            Delete
          </button>
        </div>
      </div>
      <hr>
    `;
    // appendChild permite insertar elementos al DOM, muy similar a innerHTML
    cartList.appendChild(div);
  })
  productsStorage()
}
//* LocalStorage
function productsStorage() {
  localStorage.setItem('cart', JSON.stringify(cartProducts))
}
//* Eliminar productos del carrito
function deleteProduct(event){
  if(event.target.classList.contains('delete_product')){
    const productId = event.target.getAttribute('data-id')
    cartProducts = cartProducts.filter(product => product.id !== productId)
    cartElementsHTML()
  }
}
//* Vaciar el carrito
function emptyCart() {
  cartProducts = [];
  cartElementsHTML();
}
//* Ventana Modal
function modalProduct(event){
  if(event.target.classList.contains('product_details')){
    modalContainer.classList.add('show_modal')
    const product = event.target.parentElement.parentElement
    modalDetailsElement(product)
  }
}
function closeModal(event){
  if(event.target.classList.contains('icon_modal')){
    modalContainer.classList.remove('show_modal')
    modalElement.innerHTML = "";
    modalDetails = []
  }
}
function modalDetailsElement(product){
  const infoDetails = [{
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product_container_name p').textContent,
    price: product.querySelector('.product_container_price p').textContent,
  }]
  modalDetails = [...infoDetails]
  modalHTML();
}
function modalHTML() {
  let modalDetailsHTML = "";
  for(let element of modalDetails){
    modalDetailsHTML += `
      <div class="principal_element">
        <div class="first_modal_section">
          <div class="first_modal_text">
            <p>${element.name}</p>
            <p>${element.price}</p>
          </div>
          <div class="first_modal_colors">
            <p>Colores</p>
            <div>
              <img src="${element.image}">
            </div>
          </div>
          <div class="first_modal_sizes_text">
            <div>
              <p>Tallas</p>
            </div>
          </div>
          <div class="first_modal_sizes">
            <div>
              <p>S</p>
            </div>
            <div>
              <p>M</p>
            </div>
            <div>
              <p>L</p>
            </div>
            <div>
              <p>XL</p>
            </div>
            <div>
              <p>2XL</p>
            </div>
            <div>
              <p>3XL</p>
            </div>
          </div>
        </div>
        <div class="second_modal_section">
          <div class="modal_vector"></div>
          <img src="${element.image}">
          
        </div>
      </div>
    `;
  }
  modalElement.innerHTML = modalDetailsHTML;
}
//* Local Storage
// localStorage.setItem("Apellido", "Garavito")
//console.log(localStorage.getItem("Apellido"))
// const usuario = {
//   name: 'Miguel',
//   age: 19
// }
// localStorage.setItem('usuario', JSON.stringify(usuario))
// const usuarioLocal = localStorage.getItem('usuario')
// console.log(JSON.parse(usuarioLocal))