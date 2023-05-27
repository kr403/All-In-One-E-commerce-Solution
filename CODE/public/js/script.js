// Selecting necessary elements.
const dropdownHamburger = document.querySelector('#dropdown-hamburger');
const dropdown = document.querySelector('#dropdown');
const searchSuggestions = document.querySelector('#search-suggestions');
const searchBar = document.querySelector('#search-bar');

// Declarations.
let timeoutId;

// Necessary functions.
// Adding suggestions on search bar.
function addSuggestion(data) {
   // Add suggestion for the first 10 data.
   data.forEach((data, index) => {
      if(index < 10) {
         // Creating elements.
         const li = document.createElement('li');
         const a = document.createElement('a');
         
         // Assigning values.
         a.href = `/product/${data.id}`;
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

// Open or close dropdown when clicked on hamburger.
if(dropdownHamburger) {
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
}

// Show suggestions when searching.
if(searchBar) {
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
   searchBar.addEventListener('keypress', (e) => {
      if(e.keyCode === 13) {
         // getting the domain name out.
         const hostName = window.location.href.split('/')[2];
         window.location.href = `http://${hostName}/search/${searchBar.value}`;
      }
   })
}




// Things that should happen when clicked on the document.
document.addEventListener('click', () => {
   if(searchSuggestions) {
      clearSuggestion();
      if(window.getComputedStyle(dropdown).opacity === '1') {
         dropdown.style.opacity = 0;
         dropdown.style.transform = 'translateY(-20px)';
         dropdown.style.pointerEvents = 'none';
      }
   }
})
