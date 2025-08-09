gsap.registerPlugin(ScrollTrigger);


const isFirstVisit = !sessionStorage.getItem('visited');
const loader = document.querySelector('.loader--text');

if (isFirstVisit) {
    sessionStorage.setItem('visited', 'true');

    let progress = 0;
    const fakeProgress = setInterval(() => {
        progress += 1;
        loader.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(fakeProgress);

            setTimeout(() => {
                showDemo();
            }, 800);
        }
    }, 20);
} else {

    document.querySelector('.loader').style.display = 'none';
    document.body.style.overflow = 'auto';

    window.addEventListener('DOMContentLoaded', () => {
        showDemo();
    });
}

const showDemo = () => {
    document.body.style.overflow = 'auto';
    document.scrollingElement.scrollTo(0, 0);

    gsap.to(document.querySelector('.loader'), {
        autoAlpha: 0,
        duration: 1.2
    });

    document.querySelector('.hero').classList.add('show');

    setTimeout(() => {
      if (window.innerWidth > 768) {
        gsap.utils.toArray('.demo-gallery').forEach((section, index) => {
          const w = section.querySelector('.wrapper');
          if (!w) return;

          const [x, xEnd] = (index % 2)
            ? ['100%', (w.scrollWidth - section.offsetWidth) * -1]
            : [w.scrollWidth * -1, 0];

          gsap.fromTo(w, { x }, {
            x: xEnd,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              scrub: 0.5,
            },
          });
        });
        ScrollTrigger.refresh();
      }
    }, 1500);
};

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');
});

navOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', () => {
  const mapLinks = document.querySelectorAll('.nav-menu a');
  const mapImage = document.getElementById('hover-map-image');

  const imageMap = {
    'hokkaido.html': 'img/hokkaido.png',
    'ehimeken.html': 'img/ehime.png',
    'kagosimaken.html': 'img/kagoshima.png',
    'kannkoku.html': 'img/korea.png',
  };

  mapLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (imageMap[href]) {
      link.addEventListener('mouseenter', () => {
        mapImage.src = imageMap[href];
        mapImage.classList.add('is-visible');
      });

      link.addEventListener('mouseleave', () => {
        mapImage.classList.remove('is-visible');
        mapImage.removeAttribute('src');
      });
    }
  });
});

const images = document.querySelectorAll('.fade-up');

const handleScroll = () => {
  images.forEach(img => {
    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      img.classList.add('show');
    }
  });
};

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) return;

  const image = document.getElementById('hover-map-image');
  const items = document.querySelectorAll('.menu-item');

  if (!image || items.length === 0) {
    console.warn('⚠️ 地図画像またはリンクが見つかりません');
    return;
  }

  // 念のため、初期状態で alt 表示が出ないように
  image.removeAttribute('src');

  items.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();

      const mapKey = item.dataset.map;
      if (!mapKey) {
        // 万一 data-map が無いリンクなら普通に遷移
        window.location.href = item.href;
        return;
      }

      image.src = `img/${mapKey}.png`;
      image.classList.add('is-visible');   // ← ここを .show から変更
      document.body.classList.add('nav-open');

      setTimeout(() => {
        image.classList.remove('is-visible'); // ← ここも .show から変更
        image.removeAttribute('src');         // ← alt文字を出さないために src を外す
        document.body.classList.remove('nav-open');
      }, 2000);

      setTimeout(() => {
        window.location.href = item.href;
      }, 2100);
    });
  });
});

// === SP: <br> をスペースへ、<br><br> は小余白へ。PC: 完全復元 ===
(function(){
  const BP = 767;
  const SEL = '.photo-block p:not(.keep-br):not(.pc-lines)';

  function toMobile(p){
    const src = p.getAttribute('data-br-original');
    if (!src) return;

    // 1) <br><br>… を 小さな余白 に
    let html = src.replace(/(\s*<br\s*\/?>\s*){2,}/gi, '<span class="sp-gap" aria-hidden="true"></span>');
    // 2) 残りの単発 <br> は “スペース” に
    html = html.replace(/<br\s*\/?>/gi, ' ');
    p.innerHTML = html;
  }

  function toDesktop(p){
    const src = p.getAttribute('data-br-original');
    if (src) p.innerHTML = src;
  }

  function storeOriginal(){
    document.querySelectorAll(SEL).forEach(p=>{
      if (!p.hasAttribute('data-br-original')){
        p.setAttribute('data-br-original', p.innerHTML);
      }
    });
  }

  function apply(){
    const isSP = window.innerWidth <= BP;
    document.querySelectorAll(SEL).forEach(p=>{
      if (isSP) toMobile(p); else toDesktop(p);
    });
  }

  // 初期化
  document.addEventListener('DOMContentLoaded', ()=>{
    storeOriginal();
    apply();
  });

  // リサイズ対応（軽いデバウンス）
  let t;
  window.addEventListener('resize', ()=>{
    clearTimeout(t);
    t = setTimeout(apply, 150);
  });
})();
