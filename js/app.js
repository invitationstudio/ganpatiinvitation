document.addEventListener("DOMContentLoaded", () => {


    setTimeout(() => {

        document.body.classList.add("loaded");

    }, 1000);



    const images = document.querySelectorAll("img");


    images.forEach(img => {

        img.addEventListener("load", () => {

            img.classList.add("loaded");

        });

    });



    window.addEventListener("scroll", () => {


        const elements =
        document.querySelectorAll(".reveal");


        elements.forEach(element => {


            const position =
            element.getBoundingClientRect().top;


            if(position < window.innerHeight - 100){

                element.classList.add("active");

            }


        });


    });



});