// 모바일 화면 토글 버튼 이벤트 추가
const toggleBtn = document.querySelector("#nav_toggle");
toggleBtn.addEventListener("click", (event) => {
  const menu = document.getElementById("nav_menu");
  const links = document.getElementById("nav_links");
  event.preventDefault();
  menu.classList.toggle("active");
  links.classList.toggle("active");
});
