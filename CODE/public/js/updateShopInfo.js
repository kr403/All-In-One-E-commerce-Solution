// Selecting necessary elements.
const fileInput = document.querySelector('#file-input');
const mainButton = document.querySelector('#main-button');
const previewImage = document.querySelector('#preview-image');
const uploadContainer = document.querySelector('#upload-container');
const cancelButton = document.querySelector('#cancel-button');
// code to make the beautiful upload work.
mainButton.addEventListener('click', () => {
   fileInput.click();
})

cancelButton.addEventListener('click', () => {
   fileInput.value = '';
   previewImage.style.display = 'none';
   previewImage.src = '';
   uploadContainer.classList.remove('active');
})

fileInput.addEventListener('change', function() {
   if(this.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
         const result = reader.result;
         previewImage.src = result;
         uploadContainer.classList.add('active')
      }
      reader.readAsDataURL(this.files[0]);
   }
   previewImage.style.display = 'grid'
})


