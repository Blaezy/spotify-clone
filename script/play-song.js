import { formatTime } from "../utility/format-time.js";
import { favSongs } from "../data/fav-song.js";
import { playlist1song } from "../data/playlist-1-song.js";
import { playlist2song } from "../data/playlist-2-song.js";

const allSongFiles = [playlist1song, playlist2song];

//playing song of the favSongs

const currentSongTimeElement = document.querySelector(".js-song-current-time");
const durationSongTimeElement = document.querySelector(".js-song-duration-time");
const progressBarElement = document.querySelector(".js-progress-bar-fill");

const playPauseButton = document.querySelector(".js-music-play-btn");

const progressBarContainer = document.querySelector(".progress-bar-container");
const progressBarBg = document.querySelector(".progress-bar-bg");

const volumeProgressBarContainer = document.querySelector(".volume-progress-bar-container");
const volumeProgressBarBg = document.querySelector(".volume-progress-bar-bg");
const volumeProgressBarFill = document.querySelector(".volume-progress-bar-fill");
const volumeIcon = document.querySelector(".volume-bar img");

let currentSongList = null;
const currentAudio = new Audio();
let currentSongCard = null;
let currentSongIndex = 0;

export function initFavSongCards() {
  document.querySelectorAll(".js-fav-song-play").forEach((song) => {
    song.addEventListener("click", () => {
      if (currentSongCard === song) {
        if (!currentAudio.paused) {
          currentAudio.pause();
        } else {
          currentAudio.play();
        }
        return;
      }

      if (currentSongCard && currentSongCard !== song) {
        currentSongCard.querySelector("img").src = "Icons/play-icon.svg";
        currentSongCard.querySelector("img").style.height = "26px";
        currentSongCard.querySelector("img").style.width = "26px";
      }
      currentSongIndex = findIndexOfCurrentSongList(favSongs, "song-src", song.dataset.songSrc);

      currentSongList = favSongs;
      currentSongCard = song;
      currentAudioPlay(currentSongList[currentSongIndex]);
    });
  });
}

export function initPlaylistSongCards() {
  document.querySelectorAll(".js-playlist-song-play").forEach((song) => {
    song.addEventListener("click", () => {
      if (currentSongCard === song) {
        if (!currentAudio.paused) {
          currentAudio.pause();
        } else {
          currentAudio.play();
        }
        return;
      }

      if (currentSongCard && currentSongCard !== song) {
        currentSongCard.querySelector("img").src = "Icons/play-icon.svg";
        currentSongCard.querySelector("img").style.height = "19px";
        currentSongCard.querySelector("img").style.width = "19px";
        currentSongCard.style.color = "white";
      }

      const playlistId = song.dataset.playlistId;
      const matchedSongs = allSongFiles.find((p) => p["id"] == playlistId);
      currentSongList = matchedSongs.songs;

      currentSongIndex = findIndexOfCurrentSongList(currentSongList, "song-src", song.dataset.songSrc);

      currentSongCard = song;
      currentSongCard.style.color = "#1ed760";
      currentAudioPlay(currentSongList[currentSongIndex]);
    });
    currentAudio.addEventListener("pause", () => {
      if (currentSongCard) {
        currentSongCard.querySelector("img").src = "Icons/play-icon.svg";
        currentSongCard.querySelector("img").style.height = "19px";
        currentSongCard.querySelector("img").style.width = "19px";
      }
    });
  });
}

playPauseButton.addEventListener("click", () => {
  if (!currentAudio.paused) {
    currentAudio.pause();
  } else {
    currentAudio.play();
  }
});

currentAudio.addEventListener("loadedmetadata", () => {
  durationSongTimeElement.innerHTML = formatTime(currentAudio.duration);
});
currentAudio.addEventListener("timeupdate", () => {
  updateCurrentAudioTime(currentAudio);
  updateSongProgressBar(currentAudio);

  if (
    currentSongIndex >= 1 &&
    currentSongIndex <= currentSongList.length - 2 &&
    currentAudio.currentTime === currentAudio.duration
  ) {
    console.log("song end next song playing");
    currentAudioPlay(currentSongList[currentSongIndex + 1]);
    currentSongIndex++;
  }
});
currentAudio.addEventListener("play", () => {
  updatePauseButton();
  if (currentSongCard) {
    currentSongCard.querySelector("img").src = "Icons/pause-icon.svg";
    currentSongCard.querySelector("img").style.height = "18px";
    currentSongCard.querySelector("img").style.width = "18px";
  }
});
currentAudio.addEventListener("pause", () => {
  updatePlayButton();
  if (currentSongCard) {
    currentSongCard.querySelector("img").src = "Icons/play-icon.svg";
    currentSongCard.querySelector("img").style.height = "26px";
    currentSongCard.querySelector("img").style.width = "26px";
  }
});

// previous and next song control here

document.querySelector(".js-previous-song-btn").addEventListener("click", () => {
  if (currentSongIndex >= 1) {
    currentAudioPlay(currentSongList[currentSongIndex - 1]);
    currentSongIndex--;
  }
});
document.querySelector(".js-next-song-btn").addEventListener("click", () => {
  if (currentSongIndex <= currentSongList.length - 2) {
    currentAudioPlay(currentSongList[currentSongIndex + 1]);
    currentSongIndex++;
  }
});

// progress bar of audio control

let isDragging = false;

progressBarContainer.addEventListener("mousedown", () => {
  isDragging = true;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const rect = progressBarBg.getBoundingClientRect();
  let clickX = e.clientX - rect.left;

  // clamp between 0 and bar width
  clickX = Math.max(0, Math.min(clickX, rect.width));

  const percent = clickX / rect.width;
  progressBarElement.style.width = percent * 100 + "%";
});

document.addEventListener("mouseup", (e) => {
  if (!isDragging) return;
  isDragging = false;

  const rect = progressBarBg.getBoundingClientRect();
  let clickX = e.clientX - rect.left;
  clickX = Math.max(0, Math.min(clickX, rect.width));

  const percent = clickX / rect.width;
  currentAudio.currentTime = percent * currentAudio.duration;
});

// this is the Volume control

let isVolumeDragging = false;

function updateVolumeIcon(volume) {
  if (volume === 0) {
    volumeIcon.src = "./Icons/volume-mute-icon.svg";
  } else if (volume <= 0.33) {
    volumeIcon.src = "./Icons/volume-low-icon.svg";
  } else if (volume <= 0.66) {
    volumeIcon.src = "./Icons/volume-mid-icon.svg";
  } else {
    volumeIcon.src = "./Icons/volume-high-icon.svg";
  }
}

function setVolume(e) {
  const rect = volumeProgressBarBg.getBoundingClientRect();
  let clickX = e.clientX - rect.left;
  clickX = Math.max(0, Math.min(clickX, rect.width));

  const percent = clickX / rect.width;
  volumeProgressBarFill.style.width = percent * 100 + "%";
  currentAudio.volume = percent;
  updateVolumeIcon(percent);
}

// click
volumeProgressBarContainer.addEventListener("click", (e) => {
  setVolume(e);
});

// drag
volumeProgressBarContainer.addEventListener("mousedown", () => {
  isVolumeDragging = true;
});

document.addEventListener("mousemove", (e) => {
  if (!isVolumeDragging) return;
  setVolume(e);
});

document.addEventListener("mouseup", (e) => {
  if (!isVolumeDragging) return;
  isVolumeDragging = false;
  setVolume(e);
});

// mute toggle
let lastVolume = 1;
volumeIcon.addEventListener("click", () => {
  if (currentAudio.volume > 0) {
    lastVolume = currentAudio.volume;
    currentAudio.volume = 0;
    volumeProgressBarFill.style.width = "0%";
    updateVolumeIcon(0);
  } else {
    currentAudio.volume = lastVolume;
    volumeProgressBarFill.style.width = lastVolume * 100 + "%";
    updateVolumeIcon(lastVolume);
  }
});

// the fullscreen button
document.querySelector(".fullscreen-btn").addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// here are some working functions

function currentAudioPlay(song) {
  document.querySelector(".js-player-song-card-img img").src = song["song-poster-src"];
  document.querySelector(".js-song-title").innerHTML = song["song-name"];
  document.querySelector(".js-song-artist").innerHTML = song["song-artist-name"];
  currentAudio.src = song["song-src"];
  currentAudio.play();
}

function updateCurrentAudioTime(currentAudio) {
  currentSongTimeElement.innerHTML = formatTime(currentAudio.currentTime);
}

function updateSongProgressBar(currentAudio) {
  const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
  progressBarElement.style.width = percent + "%";
}

function updatePauseButton() {
  playPauseButton.querySelector("img").src = "Icons/pause-icon.svg";
  playPauseButton.querySelector("img").style.width = "15px";
  playPauseButton.querySelector("img").style.height = "15px";
}

function updatePlayButton() {
  playPauseButton.querySelector("img").src = "Icons/play-icon.svg";
  playPauseButton.querySelector("img").style.width = "20px";
  playPauseButton.querySelector("img").style.height = "20px";
}

function findIndexOfCurrentSongList(songList, songListSrc, currentSongSrc) {
  return songList.findIndex((p) => p[songListSrc] == currentSongSrc);
}


// default song on load
const defaultSong = favSongs[6];
currentSongList = favSongs;
currentSongIndex = 6;
currentAudio.src = defaultSong["song-src"];