/*====================================================
Layout
====================================================*/
// 모바일 화면 토글 버튼 이벤트 추가
const toggleBtn = document.querySelector("#nav_toggle");
toggleBtn.addEventListener("click", (event) => {
  const menu = document.getElementById("nav_menu");
  const links = document.getElementById("nav_links");
  event.preventDefault();
  menu.classList.toggle("active");
  links.classList.toggle("active");
});

/*====================================================
Carousel
====================================================*/
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

/*====================================================
Youtube Player
====================================================*/

// https://jdh5202.tistory.com/450
//플레이어 변수 설정
let YTplayer = null;
function onYouTubeIframeAPIReady() {
  // iframeAPI 로딩 완료됐을 때
  YTplayer = new YT.Player("player", {
    //width&height를 설정할 수 있으나, 따로 css영역으로 뺐다.
    videoId: "5qap5aO4i9A",
    events: {
      onReady: onPlayerReady, //로딩중에 이벤트 실행한다
      onStateChange: onPlayerStateChange, //플레이어 상태 변화 시 이벤트를 실행한다.
    },
  });
}

// 동영상 플레이어가 로딩 완료됐을 때
function onPlayerReady(event) {
  // event.target.playVideo();
  event.target.setVolume(50);
}

// 동영상 플레이어의 상태가 변경되었을 때
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
  }
  if (event.data == YT.PlayerState.ENDED) {
  }
}

function removeYTplayer() {
  if (YTplayer != null) {
    YTplayer.stopVideo();
    YTplayer.destroy();
    YTplayer = null;
    return true;
  } else return false;
}

function createYTplayer(videoID) {
  // iframeAPI 로딩 완료됐을 때
  YTplayer = new YT.Player("player", {
    //width&height를 설정할 수 있으나, 따로 css영역으로 뺐다.
    videoId: videoID,
    events: {
      onReady: onPlayerReady, //로딩중에 이벤트 실행한다
      onStateChange: onPlayerStateChange, //플레이어 상태 변화 시 이벤트를 실행한다.
    },
  });
}

/*====================================================
Shuffle
====================================================*/
const shuffleSelector = document.getElementById("shuffle_selector");
shuffleSelector.addEventListener("change", (event) => {
  const genre = event.target.value;
  fetch("db/YT_musics.json")
    .then((res) => res.json())
    .then((data) => {
      const shuffleList = data.shuffle;
      const videoID = shuffleList[genre];
      removeYTplayer();
      createYTplayer(videoID);
    });
});
