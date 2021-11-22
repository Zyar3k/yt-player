const tag = document.createElement("script");
const submit = document.querySelector("#submit");
const input = document.querySelector("form input");
const counterPlace = document.querySelector("#counterPlace");
const layer = document.querySelector(".layer");

let player;
const regExp =
  /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
let userInput = "";

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: userInput,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  //   event.target.playVideo();
}

function onPlayerStateChange(event) {
  const fullLength = Math.floor(event.target.getDuration());
  let interval;
  if (
    event.data == YT.PlayerState.PLAYING ||
    event.data == YT.PlayerState.PAUSED
  ) {
    interval = setInterval(() => {
      let check = Math.floor(event.target.getCurrentTime());
      let lastTenSec = fullLength - check;
      if (lastTenSec <= 10) {
        counterPlace.innerHTML = lastTenSec;
        layer.classList.add("active");
      } else if (lastTenSec === 0) {
        counterPlace.innerHTML = "";
        layer.classList.remove("active");
      } else if (lastTenSec > 10) {
        layer.classList.remove("active");
        counterPlace.innerHTML = "";
      }
      if (lastTenSec < 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  if (event.data == YT.PlayerState.BUFFERING) {
    clearInterval(interval);
  }
}

function onCLick(e) {
  e.preventDefault();
  const stringCheck = input.value;

  if (stringCheck.length > 11) {
    const match = stringCheck.match(regExp);
    if (match && match[2].length === 11) {
      userInput = match[2];
      player.loadVideoById(userInput);
      input.value = "";
    } else {
      console.error("error");
    }
  } else {
    userInput = stringCheck;
    player.loadVideoById(userInput);
    input.value = "";
  }
}

submit.addEventListener("submit", onCLick);
