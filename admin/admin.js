import {
    db,
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc
} from "../js/firebase.js";

"use strict";

/* ===========================
   Admin Session Check
=========================== */

const loggedIn =
localStorage.getItem("adminLoggedIn");

if(loggedIn !== "true"){

    window.location.replace("login.html");

    throw new Error("Login Required");

}

console.clear();

console.log("==================================");
console.log(" Ganpati Admin V3 Started");
console.log(" Firebase Connected");
console.log("==================================");

/* ===========================
   Admin Login
=========================== */

function login(){

    const password =
    document.getElementById("password").value;


    const error =
    document.getElementById("error");


    if(password === "admin123"){


        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );


        window.location.href =
        "dashboard.html";


    }

    else{


        error.innerText =
        "Wrong Password";


    }

}

/* ===========================
   Admin Session
=========================== */

function checkAdminSession() {

    const loggedIn =
        localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {

        window.location.href = "login.html";
        return;

    }

    console.log("✅ Admin Session OK");

}

document.addEventListener("DOMContentLoaded", async () => {

    const loginBtn =
    document.getElementById("loginBtn");


    if(loginBtn){

        loginBtn.addEventListener(
            "click",
            login
        );

const passwordInput =
document.getElementById("password");

passwordInput.addEventListener(
    "keydown",
    (e)=>{

        if(e.key==="Enter"){

            login();

        }

    }
);

        return;

    }


    checkAdminSession();

    await loadCustomers();

});

/* ===========================
   Load Customers
=========================== */

let customers = [];

let selectedCustomer = null;

async function loadCustomers() {

    try {

        const snapshot = await getDocs(
            collection(db, "customers")
        );

        customers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        renderCustomers();

        console.log("Customers :", customers);

    } catch (err) {

        console.error(err);

        // Show error to user
        const customerList = document.getElementById("customerList");
        if(customerList){
            customerList.innerHTML = `<p style="color:#ef4444;text-align:center;padding:20px;">Error loading customers. Please refresh.</p>`;
        }

    }

}

/* ===========================
   Render Customers
=========================== */

function renderCustomers() {

    const customerList =
        document.getElementById("customerList");

    const customerCount =
        document.getElementById("customerCount");


    if (!customerList) return;


    customerList.innerHTML = "";


    if (customerCount) {

        customerCount.textContent =
        customers.length;

    }



    customers.forEach(customer => {


        const card =
        document.createElement("div");


        card.className =
        "customerCard";


        card.innerHTML = `

        <h3>
        ${escapeHtml(customer.family || customer.name || customer.id)}
        </h3>

        <small>
        ${escapeHtml(customer.id)}
        </small>

        <button class="deleteCustomerBtn">
        🗑 Delete
        </button>

        `;



        /* Open Customer */

        card.addEventListener("click",()=>{


            selectedCustomer = customer;


            console.log(
                "Selected Customer :",
                selectedCustomer
            );


            window.location.href =
            "customer-dashboard.html?customer=" +
            encodeURIComponent(customer.id);


        });



        /* Delete Customer */

        const deleteBtn =
        card.querySelector(".deleteCustomerBtn");



        deleteBtn.addEventListener(
        "click",
        async(e)=>{


            e.stopPropagation();



            const confirmDelete =
            confirm(
            "Delete this customer permanently?"
            );


            if(!confirmDelete)
            return;



            try{


                console.log(
                "Deleting:",
                customer.id
                );



                await deleteDoc(
                    doc(
                    db,
                    "customers",
                    customer.id
                    )
                );



                alert(
                "Customer Deleted ✅"
                );



                await loadCustomers();



            }


            catch(error){


                console.error(error);


                alert(
                "Delete Failed"
                );


            }



        });



        customerList.appendChild(card);



    });


}

/* ===========================
   XSS Protection - Escape HTML
=========================== */

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

/* ===========================
   Add Customer
=========================== */

const addCustomerBtn =
document.getElementById("addCustomerBtn");


const addCustomerModal =
document.getElementById("addCustomerModal");


const closeCustomerModal =
document.getElementById("closeCustomerModal");


const createCustomerBtn =
document.getElementById("createCustomerBtn");



if(addCustomerBtn){

addCustomerBtn.onclick = ()=>{

    addCustomerModal.style.display="flex";

};

}



if(closeCustomerModal){

closeCustomerModal.onclick = ()=>{

    addCustomerModal.style.display="none";

};

}



if(createCustomerBtn){

createCustomerBtn.onclick = async()=>{

    const id =
    document.getElementById("newCustomerId").value.trim();

    const family =
    document.getElementById("newCustomerFamily").value.trim();

    const title =
    document.getElementById("newCustomerTitle").value.trim();

    if(!id){
        alert("Customer ID Required");
        return;
    }

    if(!/^[a-zA-Z0-9-_]+$/.test(id)){
        alert("Customer ID can only contain letters, numbers, dashes, and underscores");
        return;
    }

    try{

        await setDoc(
            doc(db,"customers",id),
            {
                id:id,
                family:family,
                title:title,
                gallery:[],

                /* ===========================
                   🔥 DEFAULT MUSIC + VOICE
                   (आपोआप apply होईल)
                =========================== */

                music:{
                    enabled: true,

                    // 🔥 Default Background Music
                    bgMusic: "assets/music/bg.mp3",

                    // 🔥 Default Bell Music
                    bellMusic: "assets/music/bell.mp3",

                    // 🔥 Default Voice Over
                    voiceOver: "assets/music/voiceover.mp3",

                    // 🔥 Default Shubhechha Voice
                    shubhechhaVoice: "assets/music/shubhechha.mp3"
                },

                theme:"",
                texts:{},
                visibility:{},
                views:0,
                shares:0,
                createdAt: new Date().toISOString()
            }
        );

        alert("Customer Created ✅\n\nDefault Music + Voice आपोआप apply झाले आहेत.");
        location.reload();

    }
    catch(error){
        console.error(error);
        alert("Create Failed: " + error.message);
    }

};

}

/* ===========================
   Customer Search
=========================== */

const customerSearch =
document.getElementById("customerSearch");


if(customerSearch){

customerSearch.addEventListener(
"input",
()=>{


    const value =
    customerSearch.value.toLowerCase();


    const filtered =
    customers.filter(customer=>{


        return (
            (customer.family || "")
            .toLowerCase()
            .includes(value)

            ||

            customer.id
            .toLowerCase()
            .includes(value)

        );


    });


    const customerList =
    document.getElementById("customerList");


    customerList.innerHTML="";


    filtered.forEach(customer=>{


        const card =
        document.createElement("div");


        card.className =
        "customerCard";


        card.innerHTML = `

        <h3>
        ${escapeHtml(customer.family || customer.id)}
        </h3>

        <small>
        ${escapeHtml(customer.id)}
        </small>

        `;


        card.onclick = ()=>{


            window.location.href =
            "customer-dashboard.html?customer=" +
            encodeURIComponent(customer.id);


        };


        customerList.appendChild(card);


    });


    // Show "no results" message if empty
    if(filtered.length === 0){
        customerList.innerHTML = `<p style="color:#94a3b8;text-align:center;padding:20px;">No customers found</p>`;
    }


});


}

/* ===========================
    Admin Logout
=========================== */

const logoutBtn =
document.getElementById("logoutBtn");


if(logoutBtn){

logoutBtn.addEventListener("click",()=>{


    localStorage.removeItem(
        "adminLoggedIn"
    );


    window.location.href =
    "login.html";


});

}

/* ===========================
   Workspace Navigation
=========================== */

const editTab =
document.getElementById("editTab");

const galleryTab =
document.getElementById("galleryTab");

const musicTab =
document.getElementById("musicTab");

const themeTab =
document.getElementById("themeTab");

const previewTab =
document.getElementById("previewTab");


function checkSelectedCustomer(){

    if(!selectedCustomer){

        alert("Select Customer First");

        return false;

    }

    return true;

}



if(editTab){

editTab.onclick=()=>{

    if(!checkSelectedCustomer()) return;


    window.location.href =
    "customer-dashboard.html?customer=" +
    encodeURIComponent(selectedCustomer.id);

};

}


if(galleryTab){

galleryTab.onclick=()=>{

    if(!checkSelectedCustomer()) return;


    window.location.href =
    "gallery-manager.html?customer=" +
    encodeURIComponent(selectedCustomer.id);

};

}


if(musicTab){

musicTab.onclick=()=>{

    if(!checkSelectedCustomer()) return;


    window.location.href =
    "music-manager.html?customer=" +
    encodeURIComponent(selectedCustomer.id);

};

}


if(themeTab){

themeTab.onclick=()=>{

    if(!checkSelectedCustomer()) return;


    window.location.href =
    "theme-manager.html?customer=" +
    encodeURIComponent(selectedCustomer.id);

};

}


if(previewTab){

previewTab.onclick=()=>{

    if(!checkSelectedCustomer()) return;


    window.open(
    "../invitation.html?customer=" +
    encodeURIComponent(selectedCustomer.id),
    "_blank"
    );

};

}