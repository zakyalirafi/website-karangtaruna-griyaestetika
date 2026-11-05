// ==========================================
// KARANG TARUNA GRIYA ESTETIKA
// Interaksi (selaras dengan css/style.css)
// ==========================================


// ==========================================
// MOBILE NAVBAR
// .hamburger.open  -> garis jadi X
// .nav-menu-mobile.show -> menu turun
// ==========================================

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const siteHeader = document.querySelector(".site-header");


function setMenu(open) {

    if (!hamburger || !navMenu) return;

    navMenu.classList.toggle("show", open);
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");

}


if (hamburger && navMenu) {

    hamburger.addEventListener("click", function () {
        setMenu(!navMenu.classList.contains("show"));
    });


    // klik link di menu mobile -> tutup menu
    navMenu.querySelectorAll(".mobile-link").forEach(function (link) {
        link.addEventListener("click", function () {
            setMenu(false);
        });
    });


    // kalau layar kembali ke desktop -> pastikan menutup
    window.addEventListener("resize", function () {
        if (window.innerWidth >= 1024) {
            setMenu(false);
        }
    });

}


// ==========================================
// NAVBAR SCROLL STATE (scrolled setelah 40px)
// ==========================================

if (siteHeader) {

    const onScrollHeader = function () {
        siteHeader.classList.toggle("scrolled", window.scrollY > 40);
    };

    window.addEventListener("scroll", onScrollHeader, { passive: true });
    onScrollHeader();

}


// ==========================================
// REVEAL ON SCROLL
// .reveal / .reveal--left / .reveal--right / .reveal--fade
// -> mendapat kelas .in-view (dengan --reveal-delay)
// ==========================================

const revealElements = new Set(
    document.querySelectorAll(
        ".reveal, .reveal--left, .reveal--right, .reveal--fade"
    )
);

const revealObserver = new IntersectionObserver(

    function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);

            }

        });

    },

    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }

);

revealElements.forEach(function (el) {
    revealObserver.observe(el);
});


// ==========================================
// MARQUEE
// HTML hanya punya satu .marquee-group per track:
// 1. duplikasi group sampai lebar track >= viewport
// 2. animasi rAF: translateX memakai data-base (periode detik)
//    dan data-dir (1 = ke kiri, -1 = ke kanan)
// 3. data-pause-hover: berhenti saat kursor di atas
// 4. kecepatan scroll menambah akselerasi seperti referensi
// ==========================================

const marquees = Array.from(document.querySelectorAll(".marquee"))
    .map(function (el) {

        const track = el.querySelector(".marquee-track");

        if (!track || !track.firstElementChild) return null;

        return {
            el: el,
            track: track,
            base: Math.max(4, parseFloat(el.dataset.base) || 30),
            dir: parseFloat(el.dataset.dir) === -1 ? -1 : 1,
            pauseHover: el.hasAttribute("data-pause-hover"),
            paused: false,
            groupWidth: 0,
            x: 0,
            boost: 0
        };

    })
    .filter(Boolean);


function buildMarquee(m) {

    const group = m.track.querySelector(".marquee-group");

    if (!group) return;

    const groupWidth = group.offsetWidth ||
        group.getBoundingClientRect().width;

    if (groupWidth === 0) return;

    // jumlah salinan secukupnya agar aman diputar tanpa lubang
    const copies = Math.max(2, Math.ceil(window.innerWidth / groupWidth) + 2);

    const html = group.outerHTML;

    if (m.track.children.length !== copies) {
        m.track.innerHTML = new Array(copies + 1).join(html);
    }

    m.groupWidth = groupWidth;

    // normalisasi posisi ke rentang [-groupWidth, 0)
    m.x = ((m.x % groupWidth) + groupWidth) % groupWidth - groupWidth;

}


function buildAllMarquees() {
    marquees.forEach(buildMarquee);
}


if (marquees.length) {

    window.addEventListener("resize", buildAllMarquees);
    window.addEventListener("load", buildAllMarquees);
    buildAllMarquees();


    // jeda saat kursor di atas (data-pause-hover)
    marquees.forEach(function (m) {

        if (!m.pauseHover) return;

        m.el.addEventListener("mouseenter", function () {
            m.paused = true;
        });

        m.el.addEventListener("mouseleave", function () {
            m.paused = false;
        });

    });


    // akselerasi mengikuti kecepatan scroll
    let lastY = window.scrollY;

    const tick = function (now) {

        const y = window.scrollY;
        const delta = Math.abs(y - lastY);
        lastY = y;

        marquees.forEach(function (m) {

            if (!m.groupWidth) return;

            // boost naik saat scroll, meluruh saat diam
            m.boost = Math.min(m.boost + delta * 0.02, 2) * 0.94;

            const timeScale = 1 + m.boost;
            const speed = (m.groupWidth / m.base) * m.dir * timeScale;

            if (!m.paused) {

                m.x += speed;

                m.x = ((m.x % m.groupWidth) + m.groupWidth) % m.groupWidth
                    - m.groupWidth;

                m.track.style.transform = "translateX(" + m.x + "px)";

            }

        });

        requestAnimationFrame(tick);

    };

    requestAnimationFrame(tick);

}


// ==========================================
// TILT EFEK [data-tilt] (desktop saja)
// rotasi kecil pada elemen di dalam elemen ber-atribut
// ==========================================

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

    document.querySelectorAll("[data-tilt]").forEach(function (wrap) {

        const target = wrap.querySelector(".photo-panel") || wrap;

        wrap.addEventListener("mousemove", function (e) {

            const rect = wrap.getBoundingClientRect();
            const mx = (e.clientX - rect.left) / rect.width - 0.5;
            const my = (e.clientY - rect.top) / rect.height - 0.5;

            target.style.transform =
                "perspective(900px) rotateX(" + (-my * 6) + "deg)" +
                " rotateY(" + (mx * 6) + "deg) translateZ(0)";

        });

        wrap.addEventListener("mouseleave", function () {
            target.style.transform = "";
        });

    });

}


// ==========================================
// BACK TO TOP
// ==========================================

const toTop = document.getElementById("toTop");

if (toTop) {

    toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

}


// ==========================================
// GALERI LIGHTBOX (foto)
// foto di .gallery-item (bukan .gallery-video) dibuka overlay
// ==========================================

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");


function openLightbox(img) {

    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";

}


function closeLightboxOverlay() {

    if (!lightbox) return;

    lightbox.classList.remove("show");
    document.body.style.overflow = "";

}


document.querySelectorAll(".gallery-item:not(.gallery-video), .photo-panel, .org-avatar")
    .forEach(function (item) {

        const img = item.querySelector("img");

        if (!img) return;

        item.style.cursor = "zoom-in";

        item.addEventListener("click", function () {
            openLightbox(img);
        });

    });


// tombol X

if (closeLightbox) {
    closeLightbox.addEventListener("click", closeLightboxOverlay);
}


// klik area gelap di luar gambar

if (lightbox) {
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightboxOverlay();
        }
    });
}


// tombol ESC

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        if (lightbox && lightbox.classList.contains("show")) {
            closeLightboxOverlay();
        }

        if (navMenu && navMenu.classList.contains("show")) {
            setMenu(false);
        }

    }

});


// ==========================================
// TYPEWRITER (loop ketik-hapus)
// teks dari attribute data-text di #typing-title
// caret memakai kelas .typewriter-caret dari CSS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const typingTitle = document.getElementById("typing-title");

    if (!typingTitle) return;

    let caret = document.querySelector(".typewriter-caret");

    if (!caret && typingTitle.parentElement) {

        caret = document.createElement("span");
        caret.className = "typewriter-caret";
        caret.setAttribute("aria-hidden", "true");
        typingTitle.insertAdjacentElement("afterend", caret);

    }


    const text = typingTitle.dataset.text || "Karang Taruna";
    const speed = 90;
    const deleteSpeed = 40;
    const pause = 2200;

    let index = 0;
    let deleting = false;


    function typeLoop() {

        if (!deleting && index < text.length) {

            typingTitle.textContent = text.slice(0, ++index);
            setTimeout(typeLoop, speed);


        } else if (!deleting && index === text.length) {

            deleting = true;
            setTimeout(typeLoop, pause);


        } else if (deleting && index > 0) {

            typingTitle.textContent = text.slice(0, --index);
            setTimeout(typeLoop, deleteSpeed);


        } else {

            deleting = false;
            setTimeout(typeLoop, speed);

        }

    }


    typeLoop();

});


// ==========================================
// TIM — SPOTLIGHT + MARK
// 1. kursor memindahkan lingkaran warna (veil grayscale)
//    lewat CSS var --x / --y di .spotwrap
// 2. klik foto -> kartu "aktif": keluar dari veil,
//    berwarna penuh, dan menyala (ring emas) -> item terpilih
// 3. klik kartu lagi / klik area kosong / ESC -> batal tandai
// ==========================================

(function () {

    const spotwrap = document.getElementById("teamSpot");

    if (!spotwrap) return;

    const cards = spotwrap.querySelectorAll(".team-tint");

    // kursor -> sorot warna (hanya perangkat dengan hover)
    if (window.matchMedia("(hover: hover)").matches) {

        spotwrap.addEventListener("pointermove", function (e) {
            const rect = spotwrap.getBoundingClientRect();
            spotwrap.style.setProperty("--x", (e.clientX - rect.left) + "px");
            spotwrap.style.setProperty("--y", (e.clientY - rect.top) + "px");
        });

        spotwrap.addEventListener("pointerleave", function () {
            spotwrap.style.setProperty("--x", "50%");
            spotwrap.style.setProperty("--y", "50%");
        });

    }


    // aksesibilitas keyboard: kartu bisa di-Focus + Enter/Spasi
    cards.forEach(function (card) {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-pressed", "false");
    });


    function markCard(card) {

        const already = card.classList.contains("active");

        cards.forEach(function (c) {
            c.classList.remove("active");
            c.setAttribute("aria-pressed", "false");
        });

        if (already) return; // klik kartu terpilih lagi -> batal

        // efek cahaya muncul, lalu stabil sebagai item terpilih
        card.classList.add("active");
        card.setAttribute("aria-pressed", "true");

    }


    function clearMarks() {
        cards.forEach(function (c) {
            c.classList.remove("active");
            c.setAttribute("aria-pressed", "false");
        });
    }


    spotwrap.addEventListener("click", function (e) {

        const card = e.target.closest(".team-tint");

        if (!card) {
            clearMarks(); // klik area kosong -> bersihkan
            return;
        }

        markCard(card);

    });


    spotwrap.addEventListener("keydown", function (e) {

        if (e.key !== "Enter" && e.key !== " ") return;

        const card = e.target.closest(".team-tint");

        if (!card) return;

        e.preventDefault();
        markCard(card);

    });


    // ESC -> hapus tanda
    document.addEventListener("keydown", function (e) {

        if (e.key !== "Escape") return;

        if (spotwrap.querySelector(".team-tint.active")) {
            clearMarks();
        }

    });

})();

