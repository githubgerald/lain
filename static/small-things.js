// Settings menu toggle
function myFunction() {
  var popup = document.getElementById("settingsMenu");
  popup.classList.toggle("show");
}

// Channel name changer (Just temp changes placeholder for now)
function channelNameChanger(event) {
  event.preventDefault();
  var channelNameInput = document.getElementById("channelName");

  if (channelNameInput.value.trim() !== "") {
    channelNameInput.placeholder = channelNameInput.value;
    channelNameInput.value = "";
  }
}

// Character counter
let area = document.getElementById("msgBox");
let char = document.getElementById("char");

area.addEventListener("input", function () {
  let content = this.value;
  char.textContent = content.length;
});

// Chat / Share mode selector
let chat = document.getElementById("chatBtn");
let share = document.getElementById("shareBtn");

chat.addEventListener("change", function () {
  if (this.checked) {
    share.checked = false;
    share.disabled = false;
    this.disabled = true;
  }
});

share.addEventListener("change", function () {
  if (this.checked) {
    chat.checked = false;
    chat.disabled = false;
    this.disabled = true;
  }
});

// Update current time
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const currentTime = `${hours}:${minutes}`;
  document.getElementById("timeTxt").textContent = currentTime;
}

// Update the time every minute
setInterval(updateTime, 60000);
// Probably doesnt work becuase it takes the current time from
// when the server starts, then counts 1 minute, so if the server is started
// at 16:40:30, it will take 30 extra seconds to add 1 minute.
// so at 16:41:30 the timer will finally show 16:41.

// Initial call to display time immediately
updateTime();
