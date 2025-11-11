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
