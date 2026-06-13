import { favSongs } from "../data/fav-song.js";
import { artists } from "../data/artists.js";
import { playlists } from "../data/all-playlist.js";
import { formatTime } from "../utility/format-time.js";

import { playlist1song } from "../data/playlist-1-song.js";
import { playlist2song } from "../data/playlist-2-song.js";

import { initFavSongCards } from "../script/play-song.js";
import { initPlaylistSongCards } from "../script/play-song.js";

const allSongFiles = [playlist1song, playlist2song];

const favSongsElement = document.querySelector(".js-fav-song-render");
const artistsElement = document.querySelector(".js-artists-render");
const playlistsElement = document.querySelector(".js-playlist-section");
const playlistSongsElement = document.querySelector(".js-playlist-song-list");

const mainPage = document.querySelector(".js-right-section");

let favSongsHTML = "";
for (const song of favSongs) {
  const cardHTML = `<div class="song-card">
              <div class="song-img">
                <img src="${song["song-poster-src"]}" alt="song-img" />
                <div class="green-play-img js-fav-song-play" data-song-src="${song["song-src"]}" data-song-img="${song["song-poster-src"]}" data-song-title="${song["song-name"]}" data-song-artist="${song["song-artist-name"]}"><img src="Icons/play-icon.svg" alt="song-play-icon" /></div>
              </div>
              <div class="card-name-details">
                <p class="song-title">${song["song-name"]}</p>
                <p class="song-subtitle">${song["song-artist-name"]}</p>
              </div>
            </div>`;
  favSongsHTML += cardHTML;
}
favSongsElement.innerHTML += favSongsHTML;
initFavSongCards();

let artistHTML = "";
for (const artist of artists) {
  const cardHTML = `<div class="artists-card">
              <div class="artists-img">
                <img src="${artist["artist-img-src"]}" alt="song-img" />
                <div class="green-play-img"><img src="Icons/play-icon.svg" alt="song-play-icon" /></div>
              </div>
              <p class="artists-title">${artist["artist-name"]}</p>
              <p class="artists-subtitle">Artist</p>
            </div>`;
  artistHTML += cardHTML;
}
artistsElement.innerHTML += artistHTML;

let playlistHTML = "";
for (const playlist of playlists) {
  const cardHTML = `<div class="playlist-card">
            <div class="card-img-div">
              <img class="card-img" src="${playlist["playlist-img"]}" alt="playlist-card-img" />
              <img class="card-play-icon" src="Icons/play-icon.svg" alt="play-icon" />
            </div>
            <div class="card-names">
              <p class="playlist-card-name" data-playlist-description='${playlist["playlist-description"]}' data-playlist-song-id='${playlist["playlist-id"]}'>${playlist["playlist-name"]}</p>
              <p class="playlist-card-artist-name">${playlist["playlist-artist"]}</p>
            </div>
          </div>`;
  playlistHTML += cardHTML;
}
playlistsElement.innerHTML += playlistHTML;

const homePage = document.querySelector(".js-home-page");
const playlistPage = document.querySelector(".js-playlist-page");

document.querySelectorAll(".js-home-btn").forEach((home) => {
  home.addEventListener("click", () => {
    homePage.style.display = "block";
    playlistPage.style.display = "none";
    mainPage.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

document.querySelectorAll(".playlist-card").forEach((card) => {
  card.addEventListener("click", () => {
    homePage.style.display = "none";
    playlistPage.style.display = "block";
    mainPage.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // console.log(card);
    const playlistCardImg = card.querySelector(".card-img").src;
    const playlistCardName = card.querySelector(".playlist-card-name").innerHTML;
    const playlistCardArtist = card.querySelector(".playlist-card-artist-name").innerHTML;
    const playlistDescription = card.querySelector(".playlist-card-name").dataset.playlistDescription;

    document.querySelector(".js-playlist-info-img img").src = playlistCardImg;
    document.querySelector(".js-playlist-title").innerHTML = playlistCardName;
    document.querySelector(".js-playlist-description").innerHTML = playlistDescription;
    document.querySelector(".js-playlist-artist").innerHTML = playlistCardArtist;

    const playlistId = card.querySelector(".playlist-card-name").dataset.playlistSongId;
    const matchedSongs = allSongFiles.find((p) => p["id"] == playlistId);
    
    renderPlaylistSongs(matchedSongs);
  });
});

function getSongDuration(src) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = src;
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
  });
}

async function renderPlaylistSongs(matchedSongs) {
  let playlistSongsHTML = "";
  let index = 1;
  let totalDuration = 0;
  const playlistAllSongs = matchedSongs.songs;
  for (const song of playlistAllSongs) {
    const duration = await getSongDuration(song["song-src"]);
    totalDuration += duration;

    const cardHTML = `<div class="playlist-song-card js-playlist-song-play" data-song-src="${song["song-src"]}" data-playlist-id="${matchedSongs.id}">
          <div class="song-cnt"><div class="song-cnt-value">${index}</div>
          <img class="playlist-cnt-play-icon" src="Icons/play-icon.svg" alt="play-icon"/>
          </div>
          <div class="song-card-title">
          <div class="song-card-title-img">
          <img src="${song["song-poster-src"]}" alt="Double-Life" />
          </div>
          <div class="song-card-title-info">
          <div>${song["song-name"]}</div>
          <div>${song["song-artist-name"]}</div>
          </div>
          </div>
          <div class="song-card-album">
          <div>${song["song-album-name"]}</div>
          </div>
          <div class="song-card-duration">${formatTime(duration)}</div>
          </div>`;
    playlistSongsHTML += cardHTML;
    index++;
  }

  playlistSongsElement.innerHTML = playlistSongsHTML;
  document.querySelector(".js-total-songs").innerHTML = ` • ${index - 1} Songs,`;
  document.querySelector(".js-total-songs-duration").innerHTML = `about ${formatTime(totalDuration)}`;
  initPlaylistSongCards();
}

// Mobile library panel
const mobileLibraryPanel = document.querySelector(".js-mobile-library-panel");
const mobileLibraryList = document.querySelector(".js-mobile-library-list");

// render same playlist cards into mobile panel
let mobilePlaylistHTML = "";
for (const playlist of playlists) {
  mobilePlaylistHTML += `<div class="playlist-card mobile-playlist-card">
    <div class="card-img-div">
      <img class="card-img" src="${playlist["playlist-img"]}" alt="playlist-card-img" />
    </div>
    <div class="card-names">
      <p class="playlist-card-name" data-playlist-description='${playlist["playlist-description"]}' data-playlist-song-id='${playlist["playlist-id"]}'>${playlist["playlist-name"]}</p>
      <p class="playlist-card-artist-name">${playlist["playlist-artist"]}</p>
    </div>
  </div>`;
}
mobileLibraryList.innerHTML = mobilePlaylistHTML;

// open panel on library click
document.querySelector(".js-library-btn").addEventListener("click", () => {
  mobileLibraryPanel.classList.add("active");
  mobileSearchPanel.classList.remove("active");
});

// close panel on home click
document.querySelectorAll(".js-home-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    mobileLibraryPanel.classList.remove("active");
  });
});

// clicking a playlist inside mobile panel
document.querySelectorAll(".mobile-playlist-card").forEach((card) => {
  card.addEventListener("click", () => {
    mobileLibraryPanel.classList.remove("active");
    homePage.style.display = "none";
    playlistPage.style.display = "block";
    mainPage.scrollTo({ top: 0, behavior: "smooth" });

    const playlistCardImg = card.querySelector(".card-img").src;
    const playlistCardName = card.querySelector(".playlist-card-name").innerHTML;
    const playlistCardArtist = card.querySelector(".playlist-card-artist-name").innerHTML;
    const playlistDescription = card.querySelector(".playlist-card-name").dataset.playlistDescription;

    document.querySelector(".js-playlist-info-img img").src = playlistCardImg;
    document.querySelector(".js-playlist-title").innerHTML = playlistCardName;
    document.querySelector(".js-playlist-description").innerHTML = playlistDescription;
    document.querySelector(".js-playlist-artist").innerHTML = playlistCardArtist;

    const playlistId = card.querySelector(".playlist-card-name").dataset.playlistSongId;
    const matchedSongs = allSongFiles.find((p) => p["id"] == playlistId);
    renderPlaylistSongs(matchedSongs);
  });
});

const mobileSearchPanel = document.querySelector(".js-mobile-search-panel");

document.querySelector(".js-search-btn").addEventListener("click", () => {
  mobileSearchPanel.classList.add("active");
  mobileLibraryPanel.classList.remove("active");
});

document.querySelectorAll(".js-home-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    mobileSearchPanel.classList.remove("active");
  });
});

const disclaimerOverlay = document.querySelector(".js-disclaimer-overlay");

document.querySelector(".js-spotify-btn").addEventListener("click", () => {
  disclaimerOverlay.classList.add("active");
});

document.querySelector(".js-mobile-spotify-btn").addEventListener("click", () => {
  disclaimerOverlay.classList.add("active");
});

document.querySelector(".js-disclaimer-close").addEventListener("click", () => {
  disclaimerOverlay.classList.remove("active");
});

disclaimerOverlay.addEventListener("click", (e) => {
  if (e.target === disclaimerOverlay) {
    disclaimerOverlay.classList.remove("active");
  }
});