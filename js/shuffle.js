// https://developers.google.com/youtube/iframe_api_reference?hl=ko#Playback_controls

// 0. Youtube iframe player API를 로드.
let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 1. playlists 객체 생성
// 키는 장르명, 속성은 YouTube Video ID의 배열에 해당한다.
const playlists = {
  lofi: ["lCOiahfnNIw", "y_WPhHHvzus"],
  공부: ["pBRZzsO3L3o", "Cx_dXJn1BwE"],
};

// 2. 전역변수 선언
// playlist 변수는 playlists 객체에서 선택된 특정 배열
// currentOrder는 playlist에서 재생하고 있는 요소의 인덱스
let playlist = null;
let currentOrder = null;

// 3. genreSelector에 이벤트 리스너 설정
// 장르를 바꾸면 플레이어 초기화
const genreSelector = document.querySelector("#shuffle_selector");
genreSelector.addEventListener("change", (event) => {
  const genre = document.querySelector("#shuffle_selector").value;
  playlist = playlists[genre];
  currentOrder = 0;
  removePlayer();
  createPlayer();
  initController();
});

function removePlayer() {
  player.stopVideo();
  player.destroy();
  player = null;
}

function initController() {
  const puaseBtn = document.querySelector("#shuffle_pause");
  if (puaseBtn != undefined) {
    const pauseBtn = document.getElementById("shuffle_pause");
    const playBtn = createControlBtn("shuffle_play", "fa-solid fa-play");
    playBtn.addEventListener("click", clickPlayBtnEvent);
    pauseBtn.parentNode.replaceChild(playBtn, pauseBtn);
  }
}

// 4. 플레이어 컨트롤러 이벤트 리스너 설정
document.querySelector("#shuffle_play").addEventListener("click", (event) => {
  event.preventDefault();
  clickPlayBtnEvent();
});
document.querySelector("#shuffle_next").addEventListener("click", (event) => {
  event.preventDefault();
  currentOrder++;
  if (currentOrder >= playlist.length) currentOrder = 0;
  player.loadVideoById(playlist[currentOrder], 0);
});
document.querySelector("#shuffle_prev").addEventListener("click", (event) => {
  event.preventDefault();
  currentOrder--;
  if (currentOrder < 0) currentOrder = playlist.length - 1;
  player.loadVideoById(playlist[currentOrder], 0);
});
document.querySelector("#shuffle_vol_up").addEventListener("click", (event) => {
  event.preventDefault();
  volumeControl(event);
});
document.querySelector("#shuffle_vol_down").addEventListener("click", (event) => {
  event.preventDefault();
  volumeControl(event);
});

// 5. YouTube iframe player API의 로드가 완료되면 플레이어 객체 생성
let player;
function onYouTubeIframeAPIReady() {
  const genre = document.querySelector("#shuffle_selector").value;
  playlist = playlists[genre];
  currentOrder = 0;
  createPlayer();
}

function createPlayer() {
  // YouTube Player 객체 생성
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: playlist[0],
    playerVars: { controls: 0 }, // 컨트롤러 비활성화
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// 6. player가 준비되면 아래의 명령을 실행
function onPlayerReady() {
  player.setVolume(30); // 기본 볼륨을 30%로 설정
}

// 7. player의 state가 변경되면 아래 명령을 실행
function onPlayerStateChange(event) {
  showTitle();
  if (event.data == YT.PlayerState.ENDED) {
    currentOrder++;
    if (currentOrder >= playlist.length) currentOrder = 0;
    player.loadVideoById(playlist[currentOrder], 0);
  }
  if (event.data == YT.PlayerState.PLAYING && document.querySelector("#shuffle_pause") == undefined) {
    clickPlayBtnEvent();
  }
  if (event.data == YT.PlayerState.PAUSED && document.querySelector("#shuffle_play") == undefined) {
    clickPauseBtnEvent();
  }
}

// 재생 중인 동영상 정보를 확인하여 제목을 컨트롤러에 표시
function showTitle() {
  const title = document.querySelector("#shuffle_title");
  title.innerText = player.getVideoData().title;
}

function clickPlayBtnEvent() {
  const playBtn = document.getElementById("shuffle_play");
  const pauseBtn = createControlBtn("shuffle_pause", "fa-solid fa-pause");
  pauseBtn.addEventListener("click", clickPauseBtnEvent);
  playBtn.parentNode.replaceChild(pauseBtn, playBtn);
  player.playVideo();
}

function clickPauseBtnEvent() {
  const pauseBtn = document.getElementById("shuffle_pause");
  const playBtn = createControlBtn("shuffle_play", "fa-solid fa-play");
  playBtn.addEventListener("click", clickPlayBtnEvent);
  pauseBtn.parentNode.replaceChild(playBtn, pauseBtn);
  player.pauseVideo();
}

function createControlBtn(anchorID, iconClass) {
  const controller = document.createElement("a");
  controller.setAttribute("href", "#");
  controller.setAttribute("id", anchorID);
  const innerTag = document.createElement("i");
  innerTag.className = iconClass;
  controller.appendChild(innerTag);
  return controller;
}

function volumeControl(event) {
  const elementID = event.target.parentNode.id;

  if (document.querySelector("#volControlBox") != undefined) {
    const temp = document.querySelector("#volControlBox");
    temp.parentNode.removeChild(temp);
  }

  const box = document.createElement("div");
  box.id = "volControlBox";
  if (elementID == "shuffle_vol_up") {
    player.setVolume(player.getVolume() + 5);
    const volumeIcon = document.createElement("i");
    volumeIcon.classList.add("fa-solid");
    volumeIcon.classList.add("fa-volume-high");
    box.appendChild(volumeIcon);
  } else if (elementID == "shuffle_vol_down") {
    player.setVolume(player.getVolume() - 5);
    const volumeIcon = document.createElement("i");
    volumeIcon.classList.add("fa-solid");
    volumeIcon.classList.add("fa-volume-low");
    box.appendChild(volumeIcon);
  }

  const currentVol = document.createElement("div");
  currentVol.style.width = `${150 * (player.getVolume() / 100)}px`;
  box.appendChild(currentVol);

  document.body.appendChild(box);

  setTimeout(() => {
    if (box.parentNode != null) box.parentNode.removeChild(box);
  }, 2000);
}
