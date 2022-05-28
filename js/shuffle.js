// https://developers.google.com/youtube/iframe_api_reference?hl=ko

/*
플레이어는 <div id="player"></div>에,
컨트롤러는 <div id="controllers"></div>에 생성
컨트롤러 아이콘은 fontawesome에 의존성 가지고 있음
*/

/**
 * YoutubeAPI를 적재함
 */
function loadYoutubeAPI() {
  let tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

var player;
/**
 * YoutubeAPI 적재가 완료되면 player 객체를 생성
 */
function onYouTubeIframeAPIReady() {
  createPlayer();
}

/**
 * player 객체 생성
 */
async function createPlayer() {
  const theme = document.querySelector("#playlist_selector").value;
  const playlist = await getPlaylist(theme, "db/shuffle_playlists.json");
  // shuffle(playlist);

  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: playlist[0],
    playerVars: {
      // controls: 0,
    }, // 컨트롤러 비활성화
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });

  // player 객체 자체에 playlist를 추가
  player.playlist = playlist;
  // playlist에서 현재 재생 중인 요소의 index
  player.playingOrder = 0;

  // 제목 표시란 초기화
  initTitle();

  function onPlayerReady(event) {
    event.target.setVolume(30);
    createControllers();
  }

  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      playHandler();
    }
    if (event.data == YT.PlayerState.PAUSED) {
      pauseHandler();
    }
    if (event.data == YT.PlayerState.ENDED) {
      playNextHandler();
    }
  }
}

/**
 * player 객체 제거
 */
function destroyPlayer() {
  player.stopVideo();
  player.destroy();
  player = null;
  destroyControllers();
}

/**
 * musicDB에 있는 모든 playlist를 객체로 반환
 * @param {string} musicDB
 * @returns Object of all playlists
 */
async function getPlaylistsAll(musicDB) {
  const res = await fetch(musicDB);
  const data = await res.json();
  return data;
}

/**
 * 매개변수로 입력된 Array를 무작위로 섞는다.
 * @param {Array} array
 */
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

/**
 * 음악 주제에 따른 Playlist를 반환
 *
 * @param {string} theme Playlist의 주제 또는 장르
 * @param {string} musicDB 음악 DB의 경로
 * @returns playlist 배열
 */
async function getPlaylist(theme, musicDB) {
  const allPlaylists = await getPlaylistsAll(musicDB);
  const playlist = allPlaylists[theme];
  return playlist;
}

/**
 * <div id="controllers"></div> 영역에 컨트롤러 생성
 */
function createControllers() {
  const playBtn = `<a href="#"><i class="fa-solid fa-play"></i></a>`;
  const prevBtn = `<a href="#"><i class="fa-solid fa-backward-fast"></i></a>`;
  const nextBtn = `<a href="#"><i class="fa-solid fa-forward-fast"></i></a>`;
  const volDownBtn = `<a href="#"><i class="fa-solid fa-minus"></i></a>`;
  const volUpBtn = `<a href="#"><i class="fa-solid fa-plus"></i></a>`;
  const controllers = [volDownBtn, prevBtn, playBtn, nextBtn, volUpBtn];

  const controlArea = document.getElementById("controllers");
  for (let i = 0; i < controllers.length; i++) {
    controlArea.innerHTML += controllers[i];
  }

  // controlComponents = [volDownBtn, prevBtn, playBtn, nextBtn, volUpBtn]
  const controlComponents = getControllers();
  controlComponents[0].addEventListener("click", (event) => {
    event.preventDefault();
    volumeDownHandler();
  });
  controlComponents[1].addEventListener("click", (event) => {
    event.preventDefault();
    playPrevHandler();
  });
  controlComponents[2].addEventListener("click", (event) => {
    event.preventDefault();
    player.playVideo();
  });
  controlComponents[3].addEventListener("click", (event) => {
    event.preventDefault();
    playNextHandler();
  });
  controlComponents[4].addEventListener("click", (event) => {
    event.preventDefault();
    volumeUpHandler();
  });
}

/**
 * <div id="controllers"></div> 영역에 생성된 컨트롤러를 삭제
 */
function destroyControllers() {
  const controlArea = document.querySelector("#controllers");
  controlArea.innerHTML = "";
}

/**
 * <div id="controllers"></div>의 자식요소인 컨트롤러 요소들을 배열로 반환
 * @returns controllers 배열
 */
function getControllers() {
  const controlArea = document.getElementById("controllers");
  const controllers = new Array();
  controlArea.childNodes.forEach((element) => controllers.push(element));
  return controllers;
}

/**
 * 음악을 Play할 때 발생
 *
 */
function playHandler() {
  console.log("Excuted:", "playHandler");
  // Play에서 Pause로 버튼 교체
  const playBtn = getControllers()[2];
  const new_pauseBtn = document.createElement("a");
  new_pauseBtn.href = "#";
  new_pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  new_pauseBtn.addEventListener("click", (event) => {
    event.preventDefault();
    player.pauseVideo();
  });
  playBtn.parentNode.replaceChild(new_pauseBtn, playBtn);

  displayTitle();
}

/**
 * 음악을 Pause할 때 발생
 */
function pauseHandler() {
  console.log("Excuted:", "pauseHandler");
  // Pause에서 Play로 버튼 교체
  const pauseBtn = getControllers()[2];
  const new_playBtn = document.createElement("a");
  new_playBtn.href = "#";
  new_playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  new_playBtn.addEventListener("click", (event) => {
    event.preventDefault();
    player.playVideo();
  });
  pauseBtn.parentNode.replaceChild(new_playBtn, pauseBtn);
}

/**
 * 볼륨을 높일 때 발생
 */
function volumeUpHandler() {
  console.log("Excuted:", "volumeUpHandler");
  if (player.getVolume() != 100) {
    player.setVolume(player.getVolume() + 5);
  }
  displayVolumeState("volUp");
}

/** 볼륨을 줄일 때 발생 */
function volumeDownHandler() {
  console.log("Excuted:", "volumeDownHandler");
  if (player.getVolume() != 0) {
    player.setVolume(player.getVolume() - 5);
  }
  displayVolumeState("volDown");
}

/**
 * 볼륨 컨트롤 시 화면 중앙에 볼륨 상태를 나타냄
 * @param {string} controlType "volUp" 또는 "volDown"
 */
function displayVolumeState(controlType) {
  if (document.querySelector("#volBox") != undefined) {
    const box = document.querySelector("#volBox");
    box.parentNode.removeChild(box);
  }

  const box = document.createElement("div");
  box.id = "volBox";
  if (controlType == "volUp") {
    const content = `<i class="fa-solid fa-volume-high"></i>`;
    box.innerHTML = content;
  } else if (controlType == "volDown") {
    const content = `<i class="fa-solid fa-volume-low"></i>`;
    box.innerHTML = content;
  }

  const volumeBar = document.createElement("div");
  volumeBar.style.width = `${150 * (player.getVolume() / 100)}px`;
  box.appendChild(volumeBar);

  document.body.appendChild(box);

  setTimeout(() => {
    if (box.parentNode != null) box.parentNode.removeChild(box);
  }, 2000);
}

/**
 * 다음 음악 재생 버튼을 누르거나 음악이 끝날 시 발생
 */
function playNextHandler() {
  console.log("Excuted:", "playNextHandler");
  const playlist = player.playlist;
  player.playingOrder++;
  if (player.playingOrder > playlist.length - 1) {
    player.playingOrder = 0;
  }
  player.loadVideoById(playlist[player.playingOrder], 0);
}

/**
 * 이전 음악 재생 버튼을 누를 때 발생
 */
function playPrevHandler() {
  console.log("Excuted:", "playPrevHandler");
  const playlist = player.playlist;
  player.playingOrder--;
  if (player.playingOrder < 0) {
    player.playingOrder = playlist.length - 1;
  }
  player.loadVideoById(playlist[player.playingOrder], 0);
}

/**
 * <select id="playlist_selector"></select>에 자동으로 플레이리스트 목록 추가
 * @param {string} musicDB Path of musicDB
 */
async function autoCreateThemeSelector(musicDB) {
  const allPlaylists = await getPlaylistsAll(musicDB);
  const themes = Object.keys(allPlaylists);
  const playlistSelector = document.querySelector("#playlist_selector");

  for (let i = 0; i < themes.length; i++) {
    const theme = document.createElement("option");
    theme.value = themes[i];
    theme.innerText = themes[i];
    playlistSelector.appendChild(theme);
  }

  playlistSelector.addEventListener("change", () => {
    destroyPlayer();
    createPlayer();
  });
}

/**
 * 재생 중인 영상의 제목을 반환
 * @returns video's title
 */
function getVideoTitle() {
  return player.getVideoData().title;
}

/**
 * <div id="playing_title"></div> 영역에 제목 표시
 */
function displayTitle() {
  const title = getVideoTitle();
  const titleArea = document.querySelector("#playing_title");
  titleArea.innerText = title;
}

/**
 * <div id="playing_title"></div> 영역에 제목을 초기화
 */
function initTitle() {
  const title = "재생 버튼을 클릭해주세요";
  const titleArea = document.querySelector("#playing_title");
  titleArea.innerText = title;
}

/**
 * Main 함수
 */
(async function main() {
  await autoCreateThemeSelector("db/shuffle_playlists.json");
  loadYoutubeAPI();
})();
