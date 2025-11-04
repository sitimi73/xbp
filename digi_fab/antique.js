/*javascript、調べながら頑張ったけどあんまり頭に入ってない。*/ 
function updateClock() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(Math.floor(now.getMilliseconds() /10)).padStart(2,'0');

    document.getElementById('digital-clock').textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

setInterval(updateClock, 100);

updateClock();