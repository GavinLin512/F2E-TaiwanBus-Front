const menuBtn = document.querySelector(".menu-btn");
const hamburgermenu = document.querySelector(".hamburger-menu");
const bg = document.querySelector(".bg");

menuBtn.addEventListener("click", () => {
    if (menuBtn.classList.contains("open")) {
        remove();
    } else {
        show();
    }
});

bg.addEventListener("click", () => {
    if (menuBtn.classList.contains("open")) {
        remove();
    }
});

function show() {
    menuBtn.classList.toggle("open");
    hamburgermenu.classList.remove("remove");
    hamburgermenu.classList.add("show");
    bg.classList.remove("remove");
    bg.classList.add("show");
}

function remove() {
    menuBtn.classList.toggle("open");
    hamburgermenu.classList.remove("show");
    hamburgermenu.classList.add("remove");
    bg.classList.remove("show");
    bg.classList.add("remove");
}