const userSearch = document.querySelector('#user-search');
const userResultContainer = document.querySelector('#user-result-container');
const userSearchSuggestions = document.querySelector('#user-search-suggestions')

// Declarations.
let userTimeoutId;

// Necessary functions.
// Adding suggestions on search bar.
function addUserSuggestion(data) {
   // Add suggestion for the first 10 data.
   data.forEach((data, index) => {
      if(index < 10) {
         // Creating elements.
         const li = document.createElement('li');
         const a = document.createElement('a');
         
         // Assigning values.
         li.innerText = data.name;

         // Adding functionality.
         li.addEventListener('click', e => {
            clearUserResult();
            AddUserResult([data]);
         })
         
         // Appending everything properly.
         userSearchSuggestions.appendChild(li);
      }
   })
}
// Clear the suggestions on search bar.
function clearUserSuggestion() {
   while(userSearchSuggestions.firstChild) {
      userSearchSuggestions.removeChild(userSearchSuggestions.firstChild);
   }
}
// Add user to the search result.
function AddUserResult(datas) {
   // Add result for each data.
   datas.forEach(data => {
      // Creating elements.
      const user = document.createElement('li');
      const userName = document.createElement('p');
      const userType = document.createElement('p')
      // All 4 buttons in an array.
      let adminButtons = [];
      for(let i = 0; i < 4; ++i) {
         adminButtons.push(document.createElement('button'));
      }

      // Adding classes
      user.classList.add('user');
      userName.classList.add('user-name');
      userType.classList.add('user-type');
      for(let i = 0; i < 4; ++i) {
         adminButtons[i].classList.add('btn');
         adminButtons[i].classList.add('admin-btn');
      }

      // Assigning values.
      userName.innerText = data.name;
      userType.innerText = data.type;
      if(data.type === 'admin') {
         adminButtons[0].innerText = 'Remove Admin';
      }
      else {
         adminButtons[0].innerText = 'Make Admin';
      }
      if(data.type === 'moderator') {
         adminButtons[1].innerText = 'Remove Moderator';
      }
      else {
         adminButtons[1].innerText = 'Make Moderator';
      }
      adminButtons[2].innerText = 'Temporary Ban';
      adminButtons[3].innerText = 'Permanent Ban';

      // Adding necessary functionality.
      // Adding functionality to buttons using a function.
      changeUserType(adminButtons[0], data, 'admin');
      changeUserType(adminButtons[1], data, 'moderator');

      adminButtons[2].addEventListener('click', e => temporaryBan(data.id, e));
      adminButtons[3].addEventListener('click', e => permanentBan(data.id, e));
      
      // Appending everything properly.
      user.appendChild(userName);
      user.appendChild(userType);
      //using loop to add all the four buttons
      for(let i = 0; i < 4; ++i) {
         user.appendChild(adminButtons[i]);
      }
      userResultContainer.append(user);
   })
}
// Clear user from search result.
function clearUserResult() {
   while(userResultContainer.firstChild) {
      userResultContainer.removeChild(userResultContainer.firstChild);
   }
}
function changeUserType(btn, data, userType) {
   btn.addEventListener('click', e => {
      let path;
      // Decide which path to take based on users type.
      if(data.type === userType) {
         path = `remove${userType}`;
         // Change the button info and user type to match the server.
         btn.innerText = `Make ${userType}`;
         data.type = 'user';
      }
      else {
         path = `make${userType}`;
         // Change the button info and user type to match the server.
         btn.innerText = `Remove ${userType}`;
         data.type = userType;
      }
      // Update user info in the server.
      fetch(`/moderation/${path}`, {
         method: "PUT",
         body: JSON.stringify({
            userId: data.id
         }),
         headers: {
            'Content-type': 'application/json; charset=UTF-8'
         }
      })
   });
}


// Events in the page.
// Show suggestions when searching.
userSearch.addEventListener('keyup', (e) => {
   if(userTimeoutId) {
      clearTimeout(userTimeoutId);
   }
   // if there is no value, search suggestions need to be cleared.
   userTimeoutId = setTimeout(() => {
      if(userSearch.value === '') {
         clearUserSuggestion();
      }
      // Need to make sure that enter, up, down, left,
      // right key was not presed
      else if(e.keyCode !== 13 && e.keyCode !== 37 && e.keyCode !== 38 && e.keyCode !== 39 && e.keyCode !== 40) {
         fetch(`/data/user/${userSearch.value}`)
         .then(res => {
            return res.json();
         })
         .then(data => {
            clearUserSuggestion();
            addUserSuggestion(data);
         })
      }
   }, 100);
})

// search with enter.
userSearch.addEventListener('keypress', (e) => {
   if(e.keyCode === 13) {
      // getting the domain name out.
      fetch(`/data/user/${userSearch.value}`)
      .then(res => {
         return res.json();
      })
      .then(data => {
         clearUserSuggestion();
         clearUserResult();
         AddUserResult(data);
      })
   }
})

// Things that should happen when clicked on the document.
document.addEventListener('click', () => {
   clearUserSuggestion();
})

