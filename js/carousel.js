let carousel_timeout_id = null; // Carousel 전환 버튼 이벤트 추가

const carouselBtnList = document.querySelectorAll("button.carousel_btn");
carouselBtnList.forEach((btn) => {
  const order = btn.innerText;
  btn.addEventListener("click", (event) => {
    clearTimeout(carousel_timeout_id);
    changeCarouselImg(order, 10);
  });
});

changeCarouselImg(1, 10);

// Carousel 사진 전환
function changeCarouselImg(order, intervalSecs) {
  // 이미지 전환
  const img = document.querySelector(".carousel > img");
  img.src = `imgs/${order}.png`;

  // 진행바 초기화
  triggerCarouselProgressBar();

  const timeout = setTimeout(() => {
    const img = document.querySelector(".carousel > img");
    const currentOrder = parseInt(img.src.slice(-5, -4));
    let nextOrder = currentOrder + 1;
    if (nextOrder == 4) nextOrder = 1;
    changeCarouselImg(nextOrder, intervalSecs);
  }, intervalSecs * 1000);

  carousel_timeout_id = timeout;

  function triggerCarouselProgressBar() {
    const progressBar = document.querySelector(".carousel_progress_bar");
    reset_animation(progressBar);
    progressBar.style.animation = `carousel_progress_bar_animation ${intervalSecs}s`;
  }
}

function reset_animation(DOMelement) {
  var el = DOMelement;
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = null;
}
