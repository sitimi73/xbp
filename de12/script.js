document.addEventListener('DOMContentLoaded', () => {
    const orbitCenter = document.getElementById('orbit-center');
    const body = document.body;
    const monitors = document.querySelectorAll('.monitor');

    let isDragging = false; 
    let startX = 0;         
    let currentRotationY = 0; // 現在の回転角度を保持
    let isSlideDetected = false; // スライド操作が検出されたか
    const DRAG_DISTANCE_THRESHOLD = 5; // スライド判定のしきい値

    // CSSのtransform (matrix3d) から現在のY軸回転角度を取得する関数
    const getRotationFromMatrix = () => {
        const style = window.getComputedStyle(orbitCenter).transform;
        const matrixRegex = /matrix3d\((.+)\)/;
        const match = style.match(matrixRegex);

        if (match) {
            const matrixValues = match[1].split(',').map(v => parseFloat(v.trim()));
            const cosVal = matrixValues[0]; 
            const sinVal = matrixValues[8]; 
            // ラジアンを度に変換して返す
            return Math.atan2(sinVal, cosVal) * (180 / Math.PI);
        }
        return 0;
    };

    // ----------------------------------------------------
    // ドラッグ操作開始 (イベントハンドラ)
    // ----------------------------------------------------
    const startDrag = (clientX) => {
        isDragging = true;
        isSlideDetected = false; 
        startX = clientX;
        body.classList.add('grabbing');
        
        // 自動アニメーションを一時停止
        orbitCenter.classList.add('paused-animation');

        // 自動回転で止まった時点の角度を取得して、手動操作の基点にする
        currentRotationY = getRotationFromMatrix();
    };

    // ----------------------------------------------------
    // ドラッグ操作中 (イベントハンドラ)
    // ----------------------------------------------------
    const onDrag = (clientX, event) => {
        if (!isDragging) return;

        const deltaX = clientX - startX;
        
        // わずかでも動いたらスライド（ドラッグ）と判定
        if (Math.abs(deltaX) > DRAG_DISTANCE_THRESHOLD) {
             isSlideDetected = true;
        }

        // 0.3 は回転の感度
        const rotationDelta = deltaX * 0.3; 
        
        currentRotationY += rotationDelta;
        
        // CSSのtransformを更新
        orbitCenter.style.transform = `rotateY(${currentRotationY}deg)`;

        startX = clientX; // 次の移動の基準点を更新
        
        // タッチパネルでは、スライド中にブラウザのスクロールを防ぐ
        if (event && (event.type === 'touchmove' || event.type === 'mousemove')) {
             event.preventDefault(); 
        }
    };

    // ----------------------------------------------------
    // ドラッグ操作終了 (イベントハンドラ)
    // ----------------------------------------------------
    const endDrag = () => {
        if (!isDragging) return;
        
        isDragging = false;
        body.classList.remove('grabbing');
        
        // 自動アニメーションを再開
        orbitCenter.classList.remove('paused-animation');
    };

    // ----------------------------------------------------
    // リンクのクリック/タップ制御
    // ----------------------------------------------------
    monitors.forEach(monitor => {
        monitor.addEventListener('click', (e) => {
            // スライド操作（ドラッグ）と判定された場合のみ、リンク遷移をブロック
            if (isSlideDetected) {
                e.preventDefault(); 
            }
            // 短いクリック/タップの場合はリンク遷移が実行される
        });
    });


    // ----------------------------------------------------
    // イベントリスナーの設定（マウス＆タッチ）
    // ----------------------------------------------------
    
    // マウスイベント
    body.addEventListener('mousedown', (e) => {
        startDrag(e.clientX);
    });
    body.addEventListener('mousemove', (e) => {
        onDrag(e.clientX, e);
    });
    body.addEventListener('mouseup', endDrag);
    body.addEventListener('mouseleave', endDrag); 

    // タッチイベント
    // 【重要】 { passive: false } を設定し、ブラウザのデフォルト動作（スクロール）を抑制
    body.addEventListener('touchstart', (e) => {
        startDrag(e.touches[0].clientX); 
        // e.preventDefault(); は touchmove で実行します
    }, { passive: true }); // touchstart は passive: true のままにすることが推奨

    body.addEventListener('touchmove', (e) => {
        onDrag(e.touches[0].clientX, e);
        // スライド操作が検出されたら、スクロールを抑制
        if (isSlideDetected) {
            e.preventDefault(); 
        }
    }, { passive: false }); // ここで passive: false にして preventDefault を有効にする

    body.addEventListener('touchend', endDrag);
});