const removeBtns = document.querySelectorAll('.remove-btn');
const verifyBtns = document.querySelectorAll('.verify-btn');

removeBtns.forEach(removeBtn => {
   removeBtn.addEventListener('click', () => {
      removeBtn.parentElement.parentElement.remove();
      fetch(`/moderation/${removeBtn.value}/remove`);
   });
})

verifyBtns.forEach(verifyBtn => {
   verifyBtn.addEventListener('click', () => {
      verifyBtn.parentElement.parentElement.remove();
      fetch(`/moderation/${verifyBtn.value}/verify`);
   })
})

