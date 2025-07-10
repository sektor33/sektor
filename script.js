async function getUsers() {
try {
        
const response = await fetch("https://borjomi.loremipsum.ge/api/all-users");
const data = await response.json();

console.log("Users from server:", data.users);

const usersContainer = document.querySelector("#users-container");
usersContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Personal ID</th>
                        <th>Mobile Number</th>
                        <th>ZIP</th>
                        <th>Gender</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.users.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.first_name}</td>
                            <td>${user.last_name}</td>
                            <td>${user.email}</td>
                            <td>${user.id_number}</td>
                            <td>${user.phone}</td>
                            <td>${user.zip_code}</td>
                            <td>${user.gender}</td>
                            <td>
                                <button class="edit-btn" data-user-id="${user.id}">Edit</button>
                                <button class="delete-btn" data-user-id="${user.id}">Delete</button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

userActions();
} catch (error) {
console.error("Error fetching users:", error);
}
}

getUsers();


//------------მომხმარებლის ამოშლა-----------

function deleteUser(id) {
fetch(`https://borjomi.loremipsum.ge/api/delete-user/${id}`, {
method: "DELETE",
})
.then((response) => response.json())
.then((data) => {
console.log(`User ${id} deleted:`, data);
getUsers();
})
.catch((error) => {
console.error(`Error deleting user ${id}:`, error);
});
}


//------------ივენთ ლისენერების მიმაგრება-----------

function userActions() {
const deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach((btn) => {
btn.addEventListener("click", () => {
const userId = btn.dataset.userId;
const confirmDelete = confirm("Are you sure you want to delete this user?");
if (confirmDelete) {
deleteUser(userId);
}
});
});

const editButtons = document.querySelectorAll(".edit-btn");
editButtons.forEach((btn) => {
btn.addEventListener("click", async () => {
const userId = btn.dataset.userId;
const userData = await getSingleUser(userId);

            
const user = userData.users;

document.querySelector("#user-id").value = user.id;
document.querySelector("#user-first-name").value = user.first_name;
document.querySelector("#user-last-name").value = user.last_name;
document.querySelector("#user-email").value = user.email;
document.querySelector("#user-phone").value = user.phone;
document.querySelector("#user-id-number").value = user.id_number;
document.querySelector("#user-zip-code").value = user.zip_code;
document.querySelector("#user-gender").value = user.gender;
document.querySelector("#userModal").showModal();
});
});
}


//------------ერთი კონკრეტული იუზერის წამოღება-----------

async function getSingleUser(id) {
try {
const response = await fetch(`https://borjomi.loremipsum.ge/api/get-user/${id}`);
const data = await response.json();
console.log("Single user data:", data);
return data;
} catch (error) {
console.error(`Error fetching user ${id}:`, error);
}
}


//------------მომხმარებლის აფდეითი-----------

async function updateUser(userObj) {
try {
const response = await fetch(`https://borjomi.loremipsum.ge/api/update-user/${userObj.id}`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(userObj),
});
const data = await response.json();
console.log("User updated:", data);
getUsers();
} catch (error) {
console.error("Error updating user:", error);
}
}


//------------ფორმის საბმითი-----------

const userForm = document.querySelector("#userForm");
userForm.addEventListener("submit", (e) => {
e.preventDefault();

const updatedUser = {
id: document.querySelector("#user-id").value,
first_name: document.querySelector("#user-first-name").value,
last_name: document.querySelector("#user-last-name").value,
email: document.querySelector("#user-email").value,
phone: document.querySelector("#user-phone").value,
id_number: document.querySelector("#user-id-number").value,
zip_code: document.querySelector("#user-zip-code").value,
gender: document.querySelector("#user-gender").value,
};

if (updatedUser.id) {
  updateUser(updatedUser);
} else {
  registerUser(updatedUser);
}

//console.log("Updated User object:", updatedUser);
//updateUser(updatedUser);
document.querySelector("#userModal").close();
});

//--------------ქენსელ ღილაკი დამავიწყდა---------------

const closeModalBtn=document.querySelector("#closeModalBtn");
closeModalBtn.addEventListener("click", ()=>{
  document.querySelector("#userModal").close();
})

//----------დრო დამრჩა და ბარემ რეგისტრაციასაც ვამატებ სავარჯიშოდ--------

function registerUser(newUser){
  fetch ("https://borjomi.loremipsum.ge/api/register",{
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newUser),
  })

  .then((response)=> response.json())
  .then((data)=>{
    console.log("new users added", data);
    getUsers();
  })
  .catch((error)=>{
    console.error("error adding users:", error);
  });
}

function clearForm(){
  document.querySelector("#userForm").reset();
  document.querySelector("#user-id").value="";
}

const addUserBtn=document.querySelector("#addUserBtn");
addUserBtn.addEventListener("click", ()=>{
  clearForm();
  document.querySelector("#userModal").showModal();
});


closeModalBtn.addEventListener("click", ()=>{
  clearForm();
  document.querySelector("#userModal").close();
});