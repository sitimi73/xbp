document.addEventListener('DOMContentLoaded', () => {
    const orbitCenter = document.getElementById('orbit-center');
    const monitors = document.querySelectorAll('.monitor');
    
    // 自動回転の状態を管理するフラグ
    let isRotationPaused = false; 
    
    // ダブルクリック/ダブルタップの判定に必要な変数
    let lastTap = 0;
    const DOUBLE_CLICK_DELAY = 300; // 300ms 以内の2回目のクリック/タップをダブル判定
    
    // ----------------------------------------------------
    // 回転の状態を切り替えるメイン関数
    // ----------------------------------------------------
    const toggleRotation = () => {
        isRotationPaused = !isRotationPaused;
        
        if (isRotationPaused) {
            // 回転を停止
            orbitCenter.classList.add('paused-animation');
            console.log('Rotation PAUSED (Double Click/Tap)');
        } else {
            // 回転を再開 (ゆっくりと回り始める)
            orbitCenter.classList.remove('paused-animation');
            console.log('Rotation STARTED (Double Click/Tap)');
        }
    };
    
    // ----------------------------------------------------
    // クリックイベントのリスナー
    // ----------------------------------------------------
    document.body.addEventListener('click', (e) => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastTap;
        
        // 【ダブルクリック判定】300ms以内に2回目のクリックが発生した場合
        if (timeDiff < DOUBLE_CLICK_DELAY && timeDiff > 0) {
            // ブラウザのデフォルトのダブルクリックイベントを抑制
            e.preventDefault(); 
            
            // モニター上のリンクをクリックしても遷移させない
            if (e.target.closest('.monitor')) {
                e.preventDefault(); 
            }
            
            // 回転の状態を切り替え
            toggleRotation();
            
            // 処理完了後、 lastTap をリセット
            lastTap = 0;
            
        } else {
            // 1回目のクリック/タップとして時間を記録
            lastTap = currentTime;
        }
    });

    // ----------------------------------------------------
    // タッチイベントのリスナー
    // ----------------------------------------------------
    document.body.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastTap;
        
        // 【ダブルタップ判定】
        if (timeDiff < DOUBLE_CLICK_DELAY && timeDiff > 0) {
            // 連続タップによる画面拡大などのデフォルト動作を抑制
            e.preventDefault(); 
            
            // 回転の状態を切り替え
            toggleRotation();
            
            // 処理完了後、 lastTap をリセット
            lastTap = 0;
        } else {
            // 1回目のタップとして時間を記録
            lastTap = currentTime;
        }
    });

    // ----------------------------------------------------
    // モニターのクリックでリンクに飛ばないようにする処理 (ダブルクリック操作時は不要なため削除)
    // ----------------------------------------------------
    monitors.forEach(monitor => {
        monitor.addEventListener('click', (e) => {
            // 通常のクリックではリンク遷移を許可
            // ダブルクリック判定は上の body イベントリスナーで行われる
        });
    });

});