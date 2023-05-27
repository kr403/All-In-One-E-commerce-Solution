const addProduct = document.querySelector('#add-product');
const changeShopImage = document.querySelector('#update-shop-info');

if(addProduct) {
   addProduct.addEventListener('click', () => {
      window.location.href += '/addproduct';
   })
}
if(changeShopImage) {
   changeShopImage.addEventListener('click', () => {
      window.location.href += '/updateshopinfo';
   })
}
