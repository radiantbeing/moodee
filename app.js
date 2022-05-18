const toggleBtn = document.querySelector("#nav_toggle");
console.log(toggleBtn);
const menu = document.getElementById("nav_menu");

toggleBtn.addEventListener("click", () => {
  menu.classList.toggle("active");
});
