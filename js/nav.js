const menuBtn = document.querySelector(".menu-btn");
const hamburgermenu = document.querySelector(".hamburger-menu");
const bg = document.querySelector(".bg");

let menuOpen = false;
menuBtn.addEventListener("click", () => {
    if (!menuOpen) {
        show();
        hamburgermenu.classList.remove("remove");
        bg.classList.remove("remove");
        bg.classList.add("show");

        menuOpen = true;
    } else {
        show();
        hamburgermenu.classList.add("remove");
        bg.classList.remove("add");
        bg.classList.add("remove");

        menuOpen = false;
    }
});

function show() {
    menuBtn.classList.toggle("open");
    hamburgermenu.classList.toggle("show");
    // bg.classList.toggle("show");
}