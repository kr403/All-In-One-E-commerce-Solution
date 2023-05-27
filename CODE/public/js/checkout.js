// Selecting Necessary elements.
const bKashRadio = document.querySelector('#bKash-radio');
const radios = document.querySelectorAll('.radio');
const bKashNumberContainer = document.querySelector('#bKash-number-container');
const form = document.querySelector('#form')
const submit = document.querySelector('#submit')

radios.forEach(radio => {
   radio.addEventListener('change', () => {
      if(radio == bKashRadio) {
         bKashNumberContainer.style.opacity = 1;
         bKashNumberContainer.style.pointerEvents = 'all';
      }
      else {
         bKashNumberContainer.style.opacity = 0;
         bKashNumberContainer.style.pointerEvents = 'none';
      }
   })
})

submit.addEventListener('click', () => {
   localStorage.removeItem('cart');
})
