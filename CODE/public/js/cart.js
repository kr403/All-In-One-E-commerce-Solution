// Selecting elements.
const cart = document.querySelector('#cart');
const clearBtn = document.querySelector('#clear-btn');
const deleteBtns = document.querySelectorAll('.delete-btn')

// If there is any item in the cart.
if(localStorage.getItem('cart')) {
   // Extracting data from localstorage.
   let cartItems = localStorage.getItem('cart').split(',');

   // creating a div  and puttin the item name and qunatity in that div.
   cartItems.forEach((item, index) => {
      // Creating elements.
      const name = document.createElement('p');
      const quantity = document.createElement('p');
      const price = document.createElement('p');
      const itemContainer = document.createElement('div');
      const itemInfo = document.createElement('div');
      const delButton = document.createElement('button');
      
      // Assigning values.
      name.innerText = item.split(':')[0];
      quantity.innerText = item.split(':')[1];
      price.innerText = item.split(':')[2];
      delButton.innerText = 'X';
      
      // Adding proper classes and id.
      itemContainer.classList.add('item-container');
      itemInfo.classList.add('item');
      name.classList.add('name');
      quantity.classList.add('quantity');
      price.classList.add('price');
      delButton.classList.add('delete-btn');

      // Pressing delButton should clear this item.
      delButton.addEventListener('click', () => {
         // Deleting from the cart.
         if(cartItems.length > 1) {
            newCart = '';
            cartItems.forEach((newItem, newIndex) => {
               // Add all the items to newCart except the current item.
               if(newIndex != index) {
                  if(newCart === '') {
                     newCart += newItem;
                  }
                  else { //if it is not the first item
                     // there should be a comma to differentiate between items.
                     newCart = newCart + ',' + newItem;
                  }
               }
            })
            localStorage.setItem('cart', newCart);
            cartItems = newCart.split(',');
         }
         else { // If it is the last item just remove the whole cart.
            localStorage.removeItem('cart');
         }
         // Deleting Visually.
         itemContainer.parentNode.removeChild(itemContainer);
      })

      // Appending everything properly.
      itemInfo.appendChild(name);
      itemInfo.appendChild(quantity);
      itemInfo.appendChild(price);
      itemContainer.appendChild(itemInfo);
      itemContainer.appendChild(delButton);
      cart.appendChild(itemContainer);
   })
}

// clearing everythin inside the div cart.
clearBtn.addEventListener('click', () => {
   localStorage.removeItem('cart');
   while(cart.firstChild) {
      cart.removeChild(cart.firstChild);
   }
})
