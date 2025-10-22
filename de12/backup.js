document.addEventListener('DOMContentLoaded', () => {
    const orbitCenter = document.getElementById('orbit-center');
    const body = document.body;
    const monitors = document.querySelectorAll('.monitor');

    let isDragging = false; 
    let startX = 0;         
    let currentRotationY = 0; // 現在の回転角度を保持
    
    const DRAG_DISTANCE_THRESHOLD = 5; // スライド判定のしきい値 (5px以上動いたらスライド)
    let isSlideDetected = false; // スライド操作が検出されたか

    // ----------------------------------------------------
    // 回転角度の初期値を取得する関数
    // ----------------------------------------------------
    const getRotationFromMatrix = () => {
        const style = window.getComputedStyle(orbitCenter).transform;
        const matrixRegex = /matrix3d\((.+)\)/;
        const match = style.match(matrixRegex);

        if (match) {
            const matrixValues = match[1].split(',').map(v => parseFloat(v.trim()));
            // Y軸回転のcos(θ)とsin(θ)の値から角度を計算 (matrix3dの1要素目と9要素目)
            const cosVal = matrixValues[0];
            const sinVal = matrixValues[8];
            // Math.atan2(sin, cos) * (180 / Math.PI) でラジアンから度に変換
            currentRotationY = Math.atan2(sinVal, cosVal) * (180 / Math.PI);
        } else {
            // transformプロパティがない（初期状態など）場合は0度
            currentRotationY = 0;
        }
    };

    // ----------------------------------------------------
    // ドラッグ操作開始
    // ----------------------------------------------------
    const startDrag = (clientX) => {
        isDragging = true;
        isSlideDetected = false; // 操作開始時にスライド判定をリセット
        startX = clientX;
        body.classList.add('grabbing');
        
        // 自動アニメーションを一時停止
        orbitCenter.classList.add('paused-animation');

        // 自動回転で止まった時点の角度を取得して、手動操作の基点にする
        getRotationFromMatrix();
    };

    // ----------------------------------------------------
    // ドラッグ操作中
    // ----------------------------------------------------
    const onDrag = (clientX) => {
        if (!isDragging) return;

        const deltaX = clientX - startX;
        
        // わずかでも動いたらスライド（ドラッグ）と判定
        if (Math.abs(deltaX) > DRAG_DISTANCE_THRESHOLD) {
             isSlideDetected = true;
        }

        // 感度を調整
        const rotationDelta = deltaX * 0.3; 
        
        currentRotationY += rotationDelta;
        
        // CSSのtransformを更新
        orbitCenter.style.transform = `rotateY(${currentRotationY}deg)`;

        startX = clientX;
    };

    // ----------------------------------------------------
    // ドラッグ操作終了
    // ----------------------------------------------------
    const endDrag = () => {
        if (!isDragging) return;
        
        isDragging = false;
        body.classList.remove('grabbing');
        
        // 自動アニメーションを再開
        orbitCenter.classList.remove('paused-animation');
        
        // スライド操作が検出された場合は、次のクリックのためのフラグをリセット
        // （リンクのpreventDefaultのために必要）
        setTimeout(() => {
            isSlideDetected = false;
        }, 50); 
    };

    // ----------------------------------------------------
    // リンクのデフォルト動作のキャンセル処理
    // ----------------------------------------------------
    monitors.forEach(monitor => {
        monitor.addEventListener('click', (e) => {
            // スライド操作（ドラッグ）と判定された場合のみ、リンク遷移をブロック
            if (isSlideDetected) {
                e.preventDefault(); 
                isSlideDetected = false; // フラグをリセット
            }
            // 短いタップの場合はリンク遷移が実行される
        });
    });


    // ----------------------------------------------------
    // マウスイベント
    // ----------------------------------------------------
    body.addEventListener('mousedown', (e) => {
        // body全体で開始
        startDrag(e.clientX);
    });

    body.addEventListener('mousemove', (e) => {
        onDrag(e.clientX);
    });

    body.addEventListener('mouseup', endDrag);
    body.addEventListener('mouseleave', endDrag); 

    // ----------------------------------------------------
    // タッチイベント
    // ----------------------------------------------------
    body.addEventListener('touchstart', (e) => {
        startDrag(e.touches[0].clientX); 
    });

    body.addEventListener('touchmove', (e) => {
        onDrag(e.touches[0].clientX);
        // モニターを回している間は、画面のスクロールを防ぐ
        if (isDragging) {
             e.preventDefault(); 
        }
    });

    body.addEventListener('touchend', endDrag);
});