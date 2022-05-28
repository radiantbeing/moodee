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
 * musicDB에 있는 모든 playlist를 객체로 반환
 * @param {string} musicDB
 * @returns Object of all playlists
 */
async function getPlaylistsAll(musicDB) {
  const res = await fetch(musicDB);
  const data = await res.json();
  return data;
}

(async function main() {
  const keys = Object.keys(await getPlaylistsAll("db/shuffle_playlists.json"));
  document.querySelectorAll(".playlist_item img");
  for (let i = 0; i < keys.length; i++) {
    const playlist = await getPlaylist(keys[i], "db/shuffle_playlists.json");
    shuffle(playlist);
    const video_id = playlist[0];
    const thumbnail_link = `https://img.youtube.com/vi/${video_id}/mqdefault.jpg`;
    document.querySelectorAll(".playlist_item img")[i].src = thumbnail_link;
  }
})();
