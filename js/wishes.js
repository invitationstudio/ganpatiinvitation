/* =========================
   GUEST WISHES JS - FIXED
========================= */


document.addEventListener(
"DOMContentLoaded",
async ()=>{


/* =========================
   Load Wishes HTML
========================= */

const container =
document.getElementById("wishesContainer");


if(container){

    try {
        
        const response =
        await fetch("components/wishes.html");


        if(!response.ok){
            throw new Error("Failed to load wishes component");
        }

        const html =
        await response.text();


        container.innerHTML =
        html;

        console.log("Wishes HTML Loaded Successfully");
        
    } catch(error) {
        console.error("Error loading wishes:", error);
    }

}



/* =========================
   Wishes Elements
========================= */


const wishBtn =
document.getElementById("wishBtn");


const wishPopup =
document.getElementById("wishPopup");


const closeWish =
document.getElementById("closeWish");


const sendWishWhatsapp =
document.getElementById("sendWishWhatsapp");


const wishName =
document.getElementById("wishName");


const wishMessage =
document.getElementById("wishMessage");


console.log("Elements found:", {
    wishBtn: !!wishBtn,
    wishPopup: !!wishPopup,
    closeWish: !!closeWish,
    sendWishWhatsapp: !!sendWishWhatsapp,
    wishName: !!wishName,
    wishMessage: !!wishMessage
});


/* =========================
   Open Popup
========================= */

if(wishBtn){

    wishBtn.onclick = ()=>{


        if(!wishPopup){
            console.error("Wish popup not found");
            return;
        }

        wishPopup.style.display="block";

        // Focus on name input
        if(wishName){
            setTimeout(() => {
                wishName.focus();
            }, 100);
        }

    };

}


/* =========================
   Close Popup
========================= */

if(closeWish){

    closeWish.onclick = ()=>{

        if(wishPopup){
            wishPopup.style.display="none";
        }

        // Clear inputs
        if(wishName) wishName.value = "";
        if(wishMessage) wishMessage.value = "";

    };

}


/* =========================
   Close on Outside Click
========================= */

if(wishPopup){

    wishPopup.addEventListener("click", (e) => {

        if(e.target === wishPopup){
            wishPopup.style.display = "none";
            
            // Clear inputs
            if(wishName) wishName.value = "";
            if(wishMessage) wishMessage.value = "";
        }

    });

}


/* =========================
   Close on Escape Key
========================= */

document.addEventListener("keydown", (e) => {

    if(e.key === "Escape" && wishPopup){
        if(wishPopup.style.display === "block"){
            wishPopup.style.display = "none";
            
            // Clear inputs
            if(wishName) wishName.value = "";
            if(wishMessage) wishMessage.value = "";
        }
    }

});


/* =========================
   Send WhatsApp
========================= */

if(sendWishWhatsapp){


sendWishWhatsapp.onclick = ()=>{


const name =
document.getElementById("wishName")
.value.trim();


const message =
document.getElementById("wishMessage")
.value.trim();



if(!name || !message){

alert(
"कृपया नाव आणि संदेश लिहा"
);

return;

}


// Validate name length
if(name.length > 50){
    alert("नाव 50 अक्षरांपेक्षा कमी असावे");
    return;
}

// Validate message length
if(message.length > 500){
    alert("संदेश 500 अक्षरांपेक्षा कमी असावा");
    return;
}


const customerWhatsapp =
window.invitationWhatsapp || "";



if(!customerWhatsapp){

alert(
"WhatsApp number not found"
);

return;

}




const text =

`🙏 ${window.invitationTitle || "गणपती निमंत्रण"}

${window.invitationFamily || ""}

💌 शुभेच्छा पाठवणारे:
${name}

Message:
${message}

🔗 Invitation Link:
${window.location.href}

🙏 गणपती बाप्पा मोरया`;




const url =

"https://wa.me/" +

customerWhatsapp.replace(/\D/g,"") +

"?text=" +

encodeURIComponent(text);



window.open(
url,
"_blank"
);


// Clear inputs after sending
if(wishName) wishName.value = "";
if(wishMessage) wishMessage.value = "";

// Close popup
if(wishPopup){
    wishPopup.style.display = "none";
}


};


}


/* =========================
   Character Counter
========================= */

if(wishMessage){

    wishMessage.addEventListener("input", () => {

        const maxLength = 500;
        const currentLength = wishMessage.value.length;

        // Create or update counter
        let counter = document.getElementById("messageCounter");

        if(!counter){
            counter = document.createElement("small");
            counter.id = "messageCounter";
            counter.style.cssText = "display:block;text-align:right;color:#94a3b8;font-size:12px;margin-top:5px;";
            wishMessage.parentElement.appendChild(counter);
        }

        counter.textContent = `${currentLength}/${maxLength}`;

        // Warning color when close to limit
        if(currentLength > maxLength - 50){
            counter.style.color = "#ef4444";
        } else {
            counter.style.color = "#94a3b8";
        }

    });

}


/* =========================
   Enter Key Submit
========================= */

if(wishName){

    wishName.addEventListener("keydown", (e) => {

        if(e.key === "Enter"){
            e.preventDefault();
            
            if(wishMessage){
                wishMessage.focus();
            }
        }

    });

}


/* =========================
   XSS Protection Helper
========================= */

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}


/* =========================
   Show Toast Message
========================= */

function showToast(message, type = "success") {

    let toast = document.getElementById("wishToast");

    if(!toast){
        toast = document.createElement("div");
        toast.id = "wishToast";
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${type === "success" ? "#22c55e" : "#ef4444"};
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 999999;
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            pointer-events: none;
        `;
        document.body.appendChild(toast);
    }

    // Reset position
    toast.style.transform = "translateX(-50%) translateY(100px)";
    toast.style.background = type === "success" ? "#22c55e" : "#ef4444";
    toast.textContent = message;

    // Show toast
    setTimeout(() => {
        toast.style.transform = "translateX(-50%) translateY(0)";
    }, 50);

    // Hide toast after 2.5 seconds
    setTimeout(() => {
        toast.style.transform = "translateX(-50%) translateY(100px)";
    }, 2500);

}


});