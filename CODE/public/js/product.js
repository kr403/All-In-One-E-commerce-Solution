// Selecting all necessary elements.
const addToCart = document.querySelector('#add-to-cart');
const qunatity = document.querySelector('#quantity');
const commentBtn = document.querySelector('#comment-btn');
const commentText = document.querySelector('#comment-text');
const commentContainer = document.querySelector('#comment-container');
const user = document.querySelector('#user');
const updateProductInfo = document.querySelector('#update-product-info');
const verifyBtn = document.querySelector('#verify-btn');
const productPrice = document.querySelector('#product-price');

// Extracting necessary data.
const productId = window.location.href.split('/')[4];

// Adding all the events.
// Redirect events.
if(addToCart) {
   addToCart.addEventListener('click', () => {
      // If there is an item, set it to previous item + new item.
      if(localStorage.getItem('cart') !== null) {
         localStorage.setItem('cart', `${localStorage.getItem('cart')},${addToCart.value}:${qunatity.value}:${productPrice.innerText}`);
      }
      else { // If there are no item just set it as the first item.
         localStorage.setItem('cart', `${addToCart.value}:${qunatity.value}:${productPrice.innerText}`);
      }
   });
}



if(commentBtn) { //The button does not exists when user is not logged in.
   commentBtn.addEventListener('click', () => {
      // We need to make sure that the user has written a comment first.
      if(commentText.value === '') {
         alert('Please type a comment first.');
      }
      else {
         // Send the data to the server.
         fetch(`/product/${productId}/createcomment`, {
            method: "POST",
            body: JSON.stringify({
               commentContent: commentText.value
            }),
            headers: {
               'Content-type': 'application/json; charset=UTF-8'
            }
         })
         // Add the comment visually.
         // Create all the necessary elements.
         const newComment = document.createElement('div');
         const newCommentInfo = document.createElement('p');
         const newCommentTime = document.createElement('span');
         const newCommentContent = document.createElement('p');
         
         // Adding the necessary classes.
         newComment.classList.add('comment');
         newCommentInfo.classList.add('comment-info');
         newCommentTime.classList.add('comment-time');
         newCommentContent.classList.add('comment-content');
         
         // Adding data in the elements.
         newCommentTime.innerText = ` ${new Date().toDateString()} ${new Date().getHours()}:${new Date().getMinutes()}`;
         newCommentInfo.innerText = user.value;
         newCommentInfo.appendChild(newCommentTime);
         newCommentContent.innerText = commentText.value;
         newComment.appendChild(newCommentInfo);
         newComment.appendChild(newCommentContent);
         commentContainer.appendChild(newComment);
         
         // Clearing the comment textarea.
         commentText.value = '';
      }
   })
}

if(updateProductInfo) {
   updateProductInfo.addEventListener('click', (e) => {
      window.location.href += '/updateproductinfo';
   });
}

if(verifyBtn) {
   verifyBtn.addEventListener('click', (e) => {
      verifyBtn.classList.add('waiting-btn');
      verifyBtn.innerText = 'WAITING';

      fetch(`/product/${productId}/verify`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json; charset=UTF-8'
         }
      });
   })
}

