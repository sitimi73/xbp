//===============================================================
// メニュー制御用の関数とイベント設定（※バージョン2026-4｜オーバーレイ対応版）
//===============================================================
$(function(){
  //-------------------------------------------------
  // 変数の宣言
  //-------------------------------------------------
  const $menubar = $('#menubar');
  const $menubarHdr = $('#menubar_hdr');
  const $overlay = $('#menubar-overlay');
  const breakPoint = 9999;	// ここがブレイクポイント指定箇所です

  // ▼ここを切り替えるだけで 2パターンを使い分け！
  //   false → “従来どおり”
  //   true  → “ハンバーガーが非表示の間は #menubar も非表示”
  const HIDE_MENUBAR_IF_HDR_HIDDEN = false;

  // タッチデバイスかどうかの判定
  const isTouchDevice = ('ontouchstart' in window) ||
                       (navigator.maxTouchPoints > 0) ||
                       (navigator.msMaxTouchPoints > 0);

  //-------------------------------------------------
  // debounce(処理の呼び出し頻度を抑制) 関数
  //-------------------------------------------------
  function debounce(fn, wait) {
    let timerId;
    return function(...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
    };
  }

  //-------------------------------------------------
  // メニューを閉じる共通関数
  // ※ハンバーガー解除・メニュー非表示・オーバーレイ非表示・
  //   noscroll解除・ドロップダウン閉じ を一括で行う
  //-------------------------------------------------
  function closeMenu() {
    $menubarHdr.removeClass('ham');
    $menubar.hide();
    $overlay.hide();
    $menubar.find('.ddmenu_parent ul').hide();
    $('body').removeClass('noscroll');
  }

  //-------------------------------------------------
  // メニューを開く共通関数
  //-------------------------------------------------
  function openMenu() {
    $menubarHdr.addClass('ham');
    $menubar.show();
    $overlay.show();
    $menubar.find('.ddmenu_parent ul').hide();
    if ($(window).width() < breakPoint) {
      $('body').addClass('noscroll');
    }
  }

  //-------------------------------------------------
  // ドロップダウン用の初期化関数
  //-------------------------------------------------
  function initDropdown($menu, isTouch) {
    // ドロップダウンメニューが存在するliにクラス追加
    $menu.find('ul li').each(function() {
      if ($(this).find('ul').length) {
        $(this).addClass('ddmenu_parent');
        $(this).children('a').addClass('ddmenu');
      }
    });

    // 子メニューは初期状態で閉じる（ちらつき防止）
    $menu.find('.ddmenu_parent ul').hide();

    // 万一の再初期化に備えてイベントを解除（多重バインド防止）
    $menu.find('.ddmenu').off('click.ddmenu');
    $menu.find('.ddmenu_parent').off('mouseenter.ddmenu mouseleave.ddmenu');

    //---------------------------------------------
    // ▼ブレイクポイント未満（開閉メニュー時）は
    //   PCでも「クリックで開閉」に統一（hover無効）
    //---------------------------------------------
    $menu.find('.ddmenu').on('click.ddmenu', function(e) {
      if (!isTouch && $(window).width() >= breakPoint) return; // PC大画面はhover運用

      e.preventDefault();
      e.stopPropagation();

      const $dropdownMenu = $(this).siblings('ul');
      if ($dropdownMenu.is(':visible')) {
        $dropdownMenu.hide();
      } else {
        $menu.find('.ddmenu_parent ul').hide(); // 他を閉じる
        $dropdownMenu.show();
      }
    });

    //---------------------------------------------
    // ▼PC大画面（breakPoint以上）のみ hover で開閉
    //---------------------------------------------
    $menu.find('.ddmenu_parent').on('mouseenter.ddmenu', function() {
      if (isTouch) return;
      if ($(window).width() < breakPoint) return; // 開閉メニュー時はhover無効
      $(this).children('ul').show();
    }).on('mouseleave.ddmenu', function() {
      if (isTouch) return;
      if ($(window).width() < breakPoint) return; // 開閉メニュー時はhover無効
      $(this).children('ul').hide();
    });
  }

  //-------------------------------------------------
  // ハンバーガーメニューでの開閉制御関数
  //-------------------------------------------------
  function initHamburger($hamburger) {
    let isAnimating = false;	// 連打防止用フラグ
    $hamburger.on('click', function() {
      if (isAnimating) return;	// アニメーション中は何もしない
      isAnimating = true;

      if ($(this).hasClass('ham')) {
        // 開いている → 閉じる
        closeMenu();
      } else {
        // 閉じている → 開く
        openMenu();
      }

      // メニューのCSSアニメーション(0.2s)完了後にロック解除
      setTimeout(function() { isAnimating = false; }, 300);
    });
  }

  //-------------------------------------------------
  // オーバーレイクリックでメニューを閉じる
  //-------------------------------------------------
  $overlay.on('click', function() {
    closeMenu();
  });

  //-------------------------------------------------
  // レスポンシブ時の表示制御 (リサイズ時)
  //-------------------------------------------------
  const handleResize = debounce(function() {
    const windowWidth = $(window).width();

    // bodyクラスの制御 (small-screen / large-screen)
    if (windowWidth < breakPoint) {
      $('body').removeClass('large-screen').addClass('small-screen');
    } else {
      $('body').removeClass('small-screen').addClass('large-screen');
      // PC表示になったら、ハンバーガー解除 + メニュー・オーバーレイを閉じる
      $menubarHdr.removeClass('ham');
      $menubar.find('.ddmenu_parent ul').hide();
      $overlay.hide();
      $('body').removeClass('noscroll');

      // ▼ #menubar を表示するか/しないかの切り替え
      if (HIDE_MENUBAR_IF_HDR_HIDDEN) {
        $menubarHdr.hide();
        $menubar.hide();
      } else {
        $menubarHdr.hide();
        $menubar.show();
      }
    }

    // スマホ(ブレイクポイント未満)のとき
    if (windowWidth < breakPoint) {
      $menubarHdr.show();
      if (!$menubarHdr.hasClass('ham')) {
        $menubar.hide();
        $overlay.hide();
        $('body').removeClass('noscroll');
      }
    }
  }, 200);

  //-------------------------------------------------
  // 初期化
  //-------------------------------------------------
  // 1) ドロップダウン初期化 (#menubar)
  initDropdown($menubar, isTouchDevice);

  // 2) ハンバーガーメニュー初期化 (#menubar_hdr)
  initHamburger($menubarHdr);

  // 3) レスポンシブ表示の初期処理 & リサイズイベント
  handleResize();
  $(window).on('resize', handleResize);

  //-------------------------------------------------
  // アンカーリンク(#)のクリックイベント
  //-------------------------------------------------
  $menubar.find('a[href^=”#”]').on('click', function() {
    // ドロップダウンメニューの親(a.ddmenu)のリンクはメニューを閉じない
    if ($(this).hasClass('ddmenu')) return;

    // スマホ表示＆ハンバーガーが開いている状態なら閉じる
    if ($menubarHdr.is(':visible') && $menubarHdr.hasClass('ham')) {
      closeMenu();
    }
  });

  //-------------------------------------------------
  // 「header nav」など別メニューにドロップダウンだけ適用したい場合
  //-------------------------------------------------
  // 例：header nav へドロップダウンだけ適用（ハンバーガー連動なし）
  //initDropdown($('header nav'), isTouchDevice);
});


//===============================================================
// スムーススクロール（※バージョン2025-3）
// 通常タイプ / fixedヘッダー対応 切り替え版
//===============================================================
$(function() {

    //===========================================================
    // 設定
    //===========================================================
    // 'normal' ＝ 通常タイプ（固定ヘッダーなし）
    // 'fixed' ＝ fixedヘッダー対応
    var scrollType = 'normal';

    // fixedヘッダー時に位置計算に使う要素（※fixed版を使う際は必ずチェック。画面上部に貼り付くブロックを指定する。）
    // 例：'header' / '#header' / '.site-header'
    var fixedHeaderSelector = '#menubar';

    // ページ上部へ戻るボタンのセレクター
    var topButton = $('.pagetop');

    // ページトップボタン表示用のクラス名
    var scrollShow = 'pagetop-show';


    //===========================================================
    // fixedヘッダーぶんの補正値を取得
    //===========================================================
    function getHeaderOffset() {

        // 通常タイプなら補正なし
        if(scrollType !== 'fixed') {
            return 0;
        }

        // 指定要素を取得
        var $header = $(fixedHeaderSelector);

        // 要素がなければ補正なし
        if(!$header.length) {
            return 0;
        }

        // 画面上でのヘッダー下端位置を取得
        // 高さ + 上部の余白(topやmarginで見た目上ずれている分)も含めて見られる
        var rect = $header.get(0).getBoundingClientRect();

        // 念のためマイナスは0にする
        return Math.max(0, rect.bottom);
    }


    //===========================================================
    // スムーススクロール本体
    //===========================================================
    function smoothScroll(target) {

        var scrollTo = 0;

        // '#' の場合はページ最上部へ
        if(target === '#') {
            scrollTo = 0;

        } else {

            // スクロール先の要素を取得
            var $target = $(target);

            // 対象が存在しない場合は何もしない
            if(!$target.length) {
                return;
            }

            // 通常位置から、fixedヘッダー分を引く
            scrollTo = $target.offset().top - getHeaderOffset();

            // 0未満にならないように補正
            if(scrollTo < 0) {
                scrollTo = 0;
            }
        }

        // アニメーションでスムーススクロール
        $('html, body').animate({scrollTop: scrollTo}, 500);
    }

	//===========================================================
	// ページ内リンク / ページトップボタン
	//===========================================================
	$('a[href^="#"], .pagetop').click(function(e) {

		// hrefが無い.pagtopでも '#' 扱いにする
		var id = $(this).attr('href') || '#';

		// .pagetop 以外の href="#" は無視（その場に止める）
		if(id === '#' && !$(this).hasClass('pagetop')) {
			e.preventDefault();
			return;
		}

		e.preventDefault();
		smoothScroll(id);
	});

    //===========================================================
    // ページトップボタンの表示切り替え
    //===========================================================
    $(topButton).hide();

    $(window).scroll(function() {
        if($(this).scrollTop() >= 300) {
            $(topButton).fadeIn().addClass(scrollShow);
        } else {
            $(topButton).fadeOut().removeClass(scrollShow);
        }
    });


    //===========================================================
    // ハッシュ付きURLで開いた時
    //===========================================================
    if(window.location.hash) {
        $('html, body').scrollTop(0);

        setTimeout(function() {
            smoothScroll(window.location.hash);
        }, 500);
    }

});


//===============================================================
// headerのフェード
//===============================================================
const header = document.getElementById('header');
let lastScrollY = 0; // 直前の位置をメモ

// --- 設定値（ここを変えると動きが変わります） ---
const startPos = 150;     // 何px以上スクロールしたら隠し始めるか
const tolerance = 10;     // 何px以上「戻した」時に表示させるか（遊びの量）
// --------------------------------------------

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // 1. ページ最上部付近なら必ず表示する
    if (currentScrollY < startPos) {
        header.classList.remove('is-hide');
    } 
    // 2. 下にスクロールしている時
    else if (currentScrollY > lastScrollY) {
        header.classList.add('is-hide');
    } 
    // 3. 上にスクロールしている時（遊びを持たせる）
    else if (lastScrollY - currentScrollY > tolerance) {
        header.classList.remove('is-hide');
    }

    // 現在の位置をメモして次に備える
    lastScrollY = currentScrollY;
});


//===============================================================
// ドロップダウン専用（#menubar2）
//===============================================================
$(function () {

	// ▼ 適用先（ここだけ変えれば他のメニューにも流用OK）
	var $menu = $('#menubar2');
	if (!$menu.length) return;

	// ▼ 親リンクの挙動（スマホ/タッチ系）
	// true  : 1回目=開く、2回目=リンクへ移動（推奨）
	// false : 常に開閉のみ（親リンクへは移動しない）
	var SECOND_TAP_NAVIGATES = true;

	// タッチ系判定（hoverできない端末を優先して判定）
	var isTouchLike = false;
	if (window.matchMedia) {
		isTouchLike = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
	} else {
		isTouchLike = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
	}

	// ------------------------------------------------------------
	// 初期化本体
	// ------------------------------------------------------------
	function initDropdown($menu, touchMode) {

		// 多重バインド防止（このスクリプトだけの名前空間）
		$menu.find('.ddmenu').off('.dd2');
		$menu.find('.ddmenu_parent').off('.dd2');
		$menu.find('.ddmenu_parent > ul a').off('.dd2');
		$(document).off('.dd2');
		$(window).off('.dd2');

		// 「子ulを持つli」にクラス付与（既に付いててもOK）
		$menu.find('li').each(function () {
			var $li = $(this);
			if ($li.children('ul').length) {
				$li.addClass('ddmenu_parent');
				$li.children('a').addClass('ddmenu')
					.attr('aria-haspopup', 'true')
					.attr('aria-expanded', 'false');
			}
		});

		function closeAll() {
			$menu.find('.ddmenu_parent > ul').hide();
			$menu.find('.ddmenu').attr('aria-expanded', 'false');
		}

		// 初期は閉じる
		closeAll();

		if (touchMode) {
			// -------------------------
			// タッチ系：タップで開閉
			// -------------------------
			$menu.find('.ddmenu').on('click.dd2', function (e) {
				var $a = $(this);
				var $ul = $a.siblings('ul');
				if (!$ul.length) return;

				var href = ($a.attr('href') || '').trim();
				var isDummyLink = (href === '' || href === '#' || href.indexOf('#') === 0);

				// 閉じている → まず開く（この時は遷移させない）
				if (!$ul.is(':visible')) {
					e.preventDefault();
					e.stopPropagation();
					closeAll();
					$ul.show();
					$a.attr('aria-expanded', 'true');
					return;
				}

				// 開いている → 挙動切替
				if (SECOND_TAP_NAVIGATES && !isDummyLink) {
					// 2回目は遷移（preventDefaultしない）
					return;
				} else {
					// 開閉のみ（またはダミーリンクの場合は閉じる）
					e.preventDefault();
					e.stopPropagation();
					$ul.hide();
					$a.attr('aria-expanded', 'false');
				}
			});

			// メニュー外タップで閉じる
			$(document).on('click.dd2 touchstart.dd2', function () {
				closeAll();
			});

			// メニュー内クリックは外側判定に流さない
			$menu.on('click.dd2 touchstart.dd2', function (e) {
				e.stopPropagation();
			});

			// 子メニュー項目を押したら閉じる（必要なら残してOK）
			$menu.find('.ddmenu_parent > ul a').on('click.dd2', function () {
				closeAll();
			});

		} else {
			// -------------------------
			// PC：ホバーで開閉
			// -------------------------
			$menu.find('.ddmenu_parent').on('mouseenter.dd2', function () {
				$(this).children('ul').show();
				$(this).children('a.ddmenu').attr('aria-expanded', 'true');
			}).on('mouseleave.dd2', function () {
				$(this).children('ul').hide();
				$(this).children('a.ddmenu').attr('aria-expanded', 'false');
			});

			// Escapeキーで閉じる（地味に便利）
			$(window).on('keydown.dd2', function (e) {
				if (e.key === 'Escape') closeAll();
			});
		}
	}

	// 実行
	initDropdown($menu, isTouchLike);

});


//===============================================================
// スライドショー（ズーム版・Ken Burns効果）
//===============================================================
$(function(){
  $('.mainimg').each(function(){
    var $mainimg = $(this);
    var slides = $mainimg.find('.slide');
    var slideCount = slides.length;
    if (slideCount <= 1) return;

    var INTERVAL = 5000;
    var FADE_MS = 1000;
    var ZOOM_MS = INTERVAL;
    var currentIndex = 0;
    var autoTimer;
    var isAnimating = false;

    var $indicators = $mainimg.find('.slide-indicators');
    for (var i = 0; i < slideCount; i++) {
      $indicators.append('<span class="dot" data-index="' + i + '"></span>');
    }
    var $dots = $indicators.find('.dot');

    function resetZoom($slide) {
      var $img = $slide.find('img');
      $img.css('transition', 'none');
      $slide.removeClass('zoom');
      if ($img[0]) { $img[0].offsetHeight; }
      $img.css('transition', 'transform ' + ZOOM_MS + 'ms linear');
    }

    function startZoom($slide) {
      window.requestAnimationFrame(function() { $slide.addClass('zoom'); });
    }

    slides.css('opacity', 0).removeClass('active');
    slides.each(function() { resetZoom($(this)); });
    slides.eq(0).css('opacity', 1).addClass('active');
    $dots.removeClass('active').eq(0).addClass('active');
    startZoom(slides.eq(0));

    function setActive(nextIndex) {
      if (nextIndex === currentIndex) return;
      isAnimating = true;
      var $current = slides.eq(currentIndex);
      var $next = slides.eq(nextIndex);
      resetZoom($next);
      $current.css('opacity', 0).removeClass('active');
      $next.css('opacity', 1).addClass('active');
      startZoom($next);
      $dots.eq(currentIndex).removeClass('active');
      $dots.eq(nextIndex).addClass('active');
      var prevIndex = currentIndex;
      currentIndex = nextIndex;
      setTimeout(function() {
        resetZoom(slides.eq(prevIndex));
        isAnimating = false;
      }, FADE_MS);
    }

    function next() {
      var n = (currentIndex + 1) % slideCount;
      setActive(n);
      restartTimer();
    }

    function restartTimer() {
      clearTimeout(autoTimer);
      autoTimer = setTimeout(next, INTERVAL);
    }

    $dots.on('click', function() {
      var to = $(this).data('index');
      if (isAnimating) return;
      if (to === currentIndex) { return restartTimer(); }
      setActive(to);
      restartTimer();
    });

    restartTimer();
  });
});