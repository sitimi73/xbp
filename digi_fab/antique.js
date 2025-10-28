// 時計を更新する関数
function updateClock() {
    // 現在の日付と時刻を取得
    const now = new Date();
    
    // 時、分、秒を取得し、1桁の場合は先頭に0を付ける (padStart)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 表示形式を 'HH:MM:SS' にして、HTML要素に設定
    document.getElementById('digital-clock').textContent = `${hours}:${minutes}:${seconds}`;
}

// 1000ミリ秒（1秒）ごとに updateClock 関数を実行する
setInterval(updateClock, 1000);

// ページ読み込み時に一度だけ時計をすぐに表示する
updateClock();