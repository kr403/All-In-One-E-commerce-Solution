// This js file is a changed version of script.js for this specific page.

// Selecting necessary elements.
// Selection from script.js
const dropdownHamburger = document.querySelector('#dropdown-hamburger');
const dropdown = document.querySelector('#dropdown');
const searchSuggestions = document.querySelector('#search-suggestions');
const searchBar = document.querySelector('#search-bar');
// New selections.
const searchResults = document.querySelector('#search-results');

// Declarations.
let timeoutId;

// Necessary functions.
// Functions from script.js
// Adding suggestions on search bar.
function addSuggestion(data) {
   // Add suggestion for the first 10 data.
   data.forEach((data, index) => {
      if(index < 10) {
         // Creating elements.
         const li = document.createElement('li');
         const a = document.createElement('a');
         
         // Assigning values.
         a.href = `/product/${data.id}`; //Need to change this.
         a.innerText = data.name;
         
         // Appending everything properly.
         li.appendChild(a);
         searchSuggestions.appendChild(li);
      }
   })
}
// Clear the suggestions on search bar.
function clearSuggestion() {
   while(searchSuggestions.firstChild) {
      searchSuggestions.removeChild(searchSuggestions.firstChild);
   }
}
// New function here.
// Fliter the products shown on the page based on the given data
function filterProducts(datas) {
   // clear previous products.
   while(searchResults.firstChild) {
      searchResults.removeChild(searchResults.firstChild);
   }
   // Add new products based on the given data.
   datas.forEach(data => {
      // Creating elements.
      const product = document.createElement('div');
      const imageAnchor = document.createElement('a');
      const productImage = document.createElement('img');
      const productDescription = document.createElement('div');
      const productName = document.createElement('p');
      const productRating = document.createElement('p');
      const productPrice = document.createElement('p');
      
      // Assigning values.
      productImage.src = `/images/${data.image}`;
      imageAnchor.href = `/product/${data.id}`;
      productName.innerText = data.name;
      productRating.innerText = data.rating;
      productPrice.innerText = data.price;

      // Assigning classes
      product.classList.add('product');
      productImage.classList.add('product-image');
      productDescription.classList.add('product-description');
      productName.classList.add('product-name');
      productRating.classList.add('product-rating');
      productPrice.classList.add('product-price');

      // Appending everything properly.
      imageAnchor.appendChild(productImage);
      productDescription.appendChild(productName);
      productDescription.appendChild(productRating);
      productDescription.appendChild(productPrice);
      product.appendChild(imageAnchor);
      product.appendChild(productDescription);
      searchResults.appendChild(product)
   })
}

// Events from script.js
// Open or close dropdown when clicked on hamburger.
dropdownHamburger.addEventListener("click", () => {
   if(window.getComputedStyle(dropdown).opacity === '0') {
      dropdown.style.opacity = 1; 
      dropdown.style.transform = 'translateY(0px)';
      dropdown.style.pointerEvents = 'all';
   }
   else {
      dropdown.style.opacity = 0;
      dropdown.style.transform = 'translateY(-20px)';
      dropdown.style.pointerEvents = 'none';
   }
})

// Show suggestions when searching.
searchBar.addEventListener('keyup', (e) => {
   if(timeoutId) {
      clearTimeout(timeoutId);
   }
   // if there is no value, search suggestions need to be cleared.
   timeoutId = setTimeout(() => {
      if(searchBar.value === '') {
         clearSuggestion();
      }
      // Need to make sure that enter, up, down, left,
      // right key was not presed
      else if(e.keyCode !== 13 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) {
         fetch(`/data/product/${searchBar.value}`)
         .then(res => {
            return res.json();
         })
         .then(data => {
            clearSuggestion();
            addSuggestion(data);
         })
      }
   }, 100);
})

// search with enter.
// This function was changed here.
searchBar.addEventListener('keypress', (e) => {
   if(e.keyCode === 13) {
      // getting the domain name out.
      fetch(`/data/product/${searchBar.value}`)
      .then(res => {
         return res.json();
      })
      .then(data => {
         clearSuggestion();
         filterProducts(data);
      })
   }
})

// Things that should happen when clicked on the document.
document.addEventListener('click', () => {
   clearSuggestion();
   if(window.getComputedStyle(dropdown).opacity === '1') {
      dropdown.style.opacity = 0;
      dropdown.style.transform = 'translateY(-20px)';
      dropdown.style.pointerEvents = 'none';
   }
})
