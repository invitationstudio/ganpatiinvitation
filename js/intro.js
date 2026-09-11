document.addEventListener("DOMContentLoaded", () => {


const openBtn = document.getElementById("openBtn");



if(openBtn){


openBtn.addEventListener(
"click",
()=>{


openBtn.classList.add("clicked");



setTimeout(()=>{


window.location.href =
"invitation.html";



},400);



}

);


}



});