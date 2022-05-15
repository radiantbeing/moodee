const toggleBtn = document.getElementById("nav_toggle_btn");
const menu = document.getElementById("nav_menu");

toggleBtn.addEventListener("click", () => {
  menu.classList.toggle("active");
});
