// Character Count

let area = document.getElementById('msgBox');
let char = document.getElementById('char');

area.addEventListener('input', function () {

    let content = this.value;
    char.textContent = content.length;
});