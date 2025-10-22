document.addEventListener('DOMContentLoaded', () => {
    const orbitCenter = document.getElementById('orbit-center');
    const body = document.body;
    const monitors = document.querySelectorAll('.monitor');

    let isDragging = false; 
    let startX = 0;         
    let currentRotationY = 0; 
    let transformValue = '0deg'; // 初期回転角度を保存
    
    // 現在のCSSのtransform値から角度を抽出し、初期値として設定する関数
    const getInitialRotation = () => {
        // CSSのtransformから現在のrotateY(Xdeg)のXdeg部分を抽出
        const computedStyle = window.getComputedStyle(orbitCenter);
        const transform = computedStyle.getPropertyValue('transform');
        
        // matrix3dからY軸回転角度を概算で取得
        // matrix3d(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
        // rotateY(θ) は transform: matrix3d(cos(θ), 0, -sin(θ), 0, 0, 1, 0, 0, sin(θ), 0, cos(θ), 0, 0, 0, 0, 1)
        // ここでは簡単な方法として、現在の角度を推定するシンプルな仕組みを採用
        // （複雑な計算を避け、ユーザーが手動で回転を始めた時点の角度を基準とする）
        
        // 自動アニメーションが開始しているため、ここでは初期値は0として扱い、
        // ドラッグ開始時に現在の状態を取得するようにします。
    };

    const startDrag = (clientX) => {
        isDragging = true;
        startX = clientX;
        body.classList.add('grabbing');
        
        // 【重要】ドラッグ開始時に自動アニメーションを一時停止
        orbitCenter.classList.add('paused-animation');

        // 【重要】現在の回転角度をCSSから取得
        const style = window.getComputedStyle(orbitCenter).transform;
        // 例: matrix3d(0.866..., 0, 0.5, 0, ...) -> 角度を解析
        const matrixRegex = /matrix3d\((.+)\)/;
        const match = style.match(matrixRegex);

        if (match) {
            const matrixValues = match[1].split(',').map(v => parseFloat(v.trim()));
            // Y軸回転のcos(θ)とsin(θ)の値から角度を計算 (matrix3dの1要素目と9要素目)
            const cosVal = matrixValues[0];
            const sinVal = matrixValues[8];
            currentRotationY = Math.atan2(sinVal, cosVal) * (180 / Math.PI);
        } else {
            // transformプロパティがない（初期状態など）場合は0度
            currentRotationY = 0;
        }
    };

    const onDrag = (clientX) => {
        if (!isDragging) return;

        const deltaX = clientX - startX;
        
        // 感度を調整
        const rotationDelta = deltaX * 0.3; 
        
        currentRotationY += rotationDelta;
        
        // CSSのtransformを更新
        orbitCenter.style.transform = `rotateY(${currentRotationY}deg)`;

        startX = clientX;
    };

    const endDrag = () => {
        isDragging = false;
        body.classList.remove('grabbing');
        
        // 【重要】ドラッグ終了時に自動アニメーションを再開
        orbitCenter.classList.remove('paused-animation');
    };

    // ----------------------------------------------------
    // 【重要】リンクのデフォルト動作のキャンセル処理
    // スライド操作（ドラッグ）とリンククリックを区別する
    // ----------------------------------------------------
    let isSlideDetected = false;
    let clickStartTime = 0;
    const CLICK_DURATION_THRESHOLD = 200; // ms
    const DRAG_DISTANCE_THRESHOLD = 5; // pixels

    monitors.forEach(monitor => {
        monitor.addEventListener('mousedown', () => {
            isSlideDetected = false; // クリック時にリセット
            clickStartTime = Date.now();
        });

        monitor.addEventListener('mouseup', (e) => {
            // ドラッグ操作だった場合は、リンク遷移をブロック
            if (isSlideDetected || (Date.now() - clickStartTime > CLICK_DURATION_THRESHOLD)) {
                e.preventDefault(); 
            }
            // 短いクリックかつドラッグと判定されなければ、リンク遷移が実行される
        });
        
        // タッチ操作の場合のリンクブロック
        monitor.addEventListener('touchend', (e) => {
            // スライド操作が検出されたら、リンク遷移をブロック
            if (isSlideDetected) {
                e.preventDefault();
            }
        });
    });


    // ----------------------------------------------------
    // マウスイベント
    // ----------------------------------------------------
    body.addEventListener('mousedown', (e) => {
        // モニター上でのクリック開始時もドラッグ操作を開始できるようにする
        startDrag(e.clientX);
    });

    body.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // わずかでも動いたらスライド（ドラッグ）と判定
        if (Math.abs(e.clientX - startX) > DRAG_DISTANCE_THRESHOLD) {
             isSlideDetected = true;
        }

        onDrag(e.clientX);
    });

    body.addEventListener('mouseup', endDrag);
    body.addEventListener('mouseleave', endDrag); // 画面外に出たときも終了

    // ----------------------------------------------------
    // タッチイベント
    // ----------------------------------------------------
    body.addEventListener('touchstart', (e) => {
        isSlideDetected = false;
        clickStartTime = Date.now();
        startDrag(e.touches[0].clientX); 
    });

    body.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        // わずかでも動いたらスライド（ドラッグ）と判定
        if (Math.abs(e.touches[0].clientX - startX) > DRAG_DISTANCE_THRESHOLD) {
             isSlideDetected = true;
        }

        onDrag(e.touches[0].clientX);
        e.preventDefault(); // スクロール動作を抑制
    });

    body.addEventListener('touchend', endDrag);
});