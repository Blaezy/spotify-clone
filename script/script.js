import { favSongs } from "../data/fav-song.js";

// this is for the left section scroll bar

const playlist = document.querySelector(".playlist-section");

playlist.addEventListener("mouseenter", () => {
  playlist.style.setProperty("--thumb-color", "#adadad7e");
});

playlist.addEventListener("mouseleave", () => {
  playlist.style.setProperty("--thumb-color", "transparent");
});

// this is for the right section scroll bar

const rightSection = document.querySelector(".js-right-section");

rightSection.addEventListener("mouseenter", () => {
  rightSection.style.setProperty("--thumb-color", "#adadad7e");
});

rightSection.addEventListener("mouseleave", () => {
  rightSection.style.setProperty("--thumb-color", "transparent");
});

// this is the scroll buttons for the right section songs

const scrollBox1 = document.querySelector(".js-fav-song-div");
const scrollBox2 = document.querySelector(".js-artists-div");

document.querySelector(".left-btn-scroll-first").addEventListener("click", () => {
  scrollBox1.scrollBy({ left: -300, behavior: "smooth" });
});
document.querySelector(".right-btn-scroll-first").addEventListener("click", () => {
  scrollBox1.scrollBy({ left: 300, behavior: "smooth" });
});
document.querySelector(".left-btn-scroll-second").addEventListener("click", () => {
  scrollBox2.scrollBy({ left: -300, behavior: "smooth" });
});
document.querySelector(".right-btn-scroll-second").addEventListener("click", () => {
  scrollBox2.scrollBy({ left: 300, behavior: "smooth" });
});


