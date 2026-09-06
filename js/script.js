// ==========================================
// MOBILE NAVBAR
// ==========================================

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");


if (hamburger && navMenu) {

    hamburger.addEventListener("click", function () {

        navMenu.classList.toggle("show");

    });


    const navLinks =
        document.querySelectorAll(".nav-link");


    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("show");

        });

    });

}


// ==========================================
// GALERI LIGHTBOX
// ==========================================

const galleryItems =
    document.querySelectorAll(".gallery-item");

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const closeLightbox =
    document.getElementById("closeLightbox");


galleryItems.forEach(function (item) {

    item.addEventListener("click", function () {

        const image =
            item.querySelector("img");

        if (!image || !lightbox) {
            return;
        }

        lightboxImage.src = image.src;

        lightboxImage.alt = image.alt;

        lightbox.classList.add("show");

        document.body.style.overflow = "hidden";

    });

});


// ==========================================
// CLOSE LIGHTBOX
// ==========================================

if (closeLightbox) {

    closeLightbox.addEventListener(
        "click",
        function () {

            lightbox.classList.remove("show");

            document.body.style.overflow = "";

        }
    );

}


// ==========================================
// KLIK DI LUAR FOTO
// ==========================================

if (lightbox) {

    lightbox.addEventListener(
        "click",
        function (event) {

            if (event.target === lightbox) {

                lightbox.classList.remove("show");

                document.body.style.overflow = "";

            }

        }
    );

}


// ==========================================
// TOMBOL ESC
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            lightbox &&
            lightbox.classList.contains("show")
        ) {

            lightbox.classList.remove("show");

            document.body.style.overflow = "";

        }

    }
);