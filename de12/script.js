document.addEventListener('DOMContentLoaded', () => {
    const orbitCenter = document.getElementById('orbit-center');
    const body = document.body;

    let isDragging = false; // ドラッグ中かどうかのフラグ
    let startX = 0;         // ドラッグ開始時のX座標
    let currentRotationY = 0; // 現在のY軸回転角度 (度)

    // マウスダウン（クリック）でドラッグ開始
    body.addEventListener('mousedown', (e) => {
        // リンクをクリックした場合は回転させないようにする
        if (e.target.closest('.monitor')) {
            return;
        }
        
        isDragging = true;
        startX = e.clientX;
        body.classList.add('grabbing'); // カーソルを変化
    });

    // マウスムーブ（ドラッグ中）
    body.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // ドラッグによるX座標の変化量
        const deltaX = e.clientX - startX;
        
        // 変化量に応じて回転角度を更新
        // 数値 (0.5) は感度。大きくすると速く回る
        const rotationDelta = deltaX * 0.5; 
        
        // 新しい回転角度 = 現在の角度 + 変化量
        currentRotationY += rotationDelta;
        
        // CSSのtransformを更新して、3D空間を回転
        orbitCenter.style.transform = `rotateY(${currentRotationY}deg)`;

        // 次の移動のために開始X座標を更新
        startX = e.clientX;
    });

    // マウスアップ（クリック解除）でドラッグ終了
    body.addEventListener('mouseup', () => {
        isDragging = false;
        body.classList.remove('grabbing');
    });

    // タッチデバイス（スマートフォンなど）への対応も追加
    body.addEventListener('touchstart', (e) => {
        // リンクをタップした場合は回転させない
        if (e.target.closest('.monitor')) {
            return;
        }
        
        isDragging = true;
        // タッチイベントの最初の指の座標を取得
        startX = e.touches[0].clientX; 
        body.classList.add('grabbing');
    });

    body.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.touches[0].clientX - startX;
        const rotationDelta = deltaX * 0.5;
        
        currentRotationY += rotationDelta;
        orbitCenter.style.transform = `rotateY(${currentRotationY}deg)`;
        
        // デフォルトのスクロール動作を抑制
        e.preventDefault(); 
        startX = e.touches[0].clientX;
    });

    body.addEventListener('touchend', () => {
        isDragging = false;
        body.classList.remove('grabbing');
    });

});