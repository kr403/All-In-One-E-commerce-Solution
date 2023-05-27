// Selecting necessary elements.
const form = document.querySelector('.form');
const shopName = document.querySelector('#name');

// Validate and submit.
form.addEventListener("submit", (e)=> {
   e.preventDefault();
   if(shopName.value.length < 4) {
      alert("Name is too short!");
   }
   else {
      fetch(`/data/shopexist/${shopName.value}`)
      .then(res => {
         return res.json();
      })
      .then(data => {
         if(data.doesExist) {
            alert('Please choose a unique name.');
         }
         else {
            form.submit();
         }
      })
   }
})
