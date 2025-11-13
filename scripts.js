// Settings menu
function myFunction() {
  var popup = document.getElementById("settingsMenu");
  popup.classList.toggle("show");
}

// Character Count

let area = document.getElementById('msgBox');
let char = document.getElementById('char');

area.addEventListener('input', function () {

    let content = this.value;
    char.textContent = content.length;
});

// Chat / Share mode selector

let chat = document.getElementById('chatBtn');
let share = document.getElementById('shareBtn');

chat.addEventListener("change", function() {
    if (this.checked) {
        share.checked = false
        share.disabled = false
        this.disabled = true
    }
})

share.addEventListener("change", function() {
    if (this.checked) {
        chat.checked = false
        chat.disabled = false
        this.disabled = true
    }
})

// Update current time
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const currentTime = `${hours}:${minutes}`;
    document.getElementById('timeTxt').textContent = currentTime;
}

// Update the time every minute
setInterval(updateTime, 60000);

// Initial call to display time immediately
updateTime()

