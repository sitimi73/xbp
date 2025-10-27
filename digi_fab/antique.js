document.addEventListener('DOMContentLoaded', () => {
    const shelfRows = [
        document.getElementById('shelf-row-1'),
        document.getElementById('shelf-row-2'),
        document.getElementById('shelf-row-3')
    ];
    const colors = [
        'var(--color-1)', 'var(--color-2)', 'var(--color-3)', 'var(--color-4)',
        'var(--color-5)', 'var(--color-6)', 'var(--color-7)', 'var(--color-8)',
        'var(--color-9)', 'var(--color-10)'
    ];

    // ダミーの本データ (総数1冊からランダムに選択される)
    const bookData = [
        { title: 'ピンセット', url: 'pinsetto.html' },
        { title: 'xbpポートフォリオ', url: '../index.html' },
    ];

    // 各段に本を生成し、隙間なく敷き詰める
    shelfRows.forEach((row, rowIndex) => {
        const padding = 50; // 本棚左右のpadding
        const availableWidth = window.innerWidth - (padding * 2); // 本を配置できる幅
        let currentWidthSum = 0; // その段に配置された本の合計幅

        const booksInThisRow = []; // その段に配置する本の一時リスト

        // 許容される本の厚さの範囲
        const minBookWidth = 100; // 最小の厚さ
        const maxBookWidth = 150; // 最大の厚さ

        // まず、ランダムな厚さの本をリストに追加していく
        while (currentWidthSum < availableWidth) {
            const bookWidth = Math.floor(Math.random() * (maxBookWidth - minBookWidth + 1)) + minBookWidth;
            
            // はみ出しそうならループを抜ける
            if (currentWidthSum + bookWidth > availableWidth + maxBookWidth / 2 && booksInThisRow.length > 0) { // ある程度本が入っていれば終了
                break;
            }

            booksInThisRow.push({
                width: bookWidth,
                height: Math.floor(Math.random() * (280 - 180 + 1)) + 180, // 180px - 280px
                color: colors[Math.floor(Math.random() * colors.length)],
                data: bookData[Math.floor(Math.random() * bookData.length)]
            });
            currentWidthSum += bookWidth;
        }

        // 最後に、全ての本の幅を調整して隙間なく敷き詰める
        const totalBookWidths = booksInThisRow.reduce((sum, book) => sum + book.width, 0);
        const scaleFactor = availableWidth / totalBookWidths;

        booksInThisRow.forEach((bookProps) => {
            const scaledWidth = bookProps.width * scaleFactor;

            const bookElement = document.createElement('a');
            bookElement.href = bookProps.data.url;
            bookElement.target = "_blank";
            bookElement.classList.add('book');
            bookElement.setAttribute('data-url', bookProps.data.url);
            
            bookElement.style.setProperty('--b-height', `${bookProps.height}px`);
            bookElement.style.setProperty('--b-width', `${scaledWidth}px`); // 調整された幅
            bookElement.style.setProperty('--b-color', bookProps.color);
            
            bookElement.innerHTML = `<span>${bookProps.data.title}</span>`;
            
            row.appendChild(bookElement);
        });
    });

    const books = document.querySelectorAll('.book');
    const animationDuration = 1000;

    books.forEach(book => {
        book.addEventListener('click', (e) => {
            e.preventDefault();

            if (book.classList.contains('animating')) {
                return;
            }

            // 現在開いている本を閉じる
            books.forEach(otherBook => {
                if (otherBook !== book && otherBook.classList.contains('is-open')) {
                    otherBook.classList.remove('is-open');
                    otherBook.classList.add('animating');
                    setTimeout(() => {
                        otherBook.classList.remove('animating');
                    }, animationDuration);
                }
            });

            // クリックされた本を開く/閉じる
            const isOpen = book.classList.toggle('is-open');
            book.classList.add('animating');

            if (isOpen) {
                // 本を開くアニメーションが完了したら、サイトに遷移
                setTimeout(() => {
                    book.classList.remove('animating');
                    const url = book.getAttribute('data-url');
                    if (url) {
                        window.open(url, '_blank');
                    }
                    // サイト遷移後に自動で本を閉じる
                    setTimeout(() => {
                        book.classList.remove('is-open');
                    }, 500); 
                    
                }, animationDuration);
            } else {
                // 閉じるアニメーションが完了
                setTimeout(() => {
                    book.classList.remove('animating');
                }, animationDuration);
            }
        });
    });
});