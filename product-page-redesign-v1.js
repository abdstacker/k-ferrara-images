// K.Ferrara Color - Product Page Redesign v2 (modern & interactive)
// Preview mode: only activates on product pages with ?preview=on querystring
// Interactive: multi-image+video gallery, click-to-zoom lightbox, shade-swatch
// selector (auto-sampled colors), sticky add-to-cart, "see it in action" video
// band, lifestyle imagery, price-in-button, scroll-reveal animations.
(function() {
  "use strict";

  // PAGE GATE — only run on individual product pages with ?preview=on
  var hasPreview = (window.location.search || "").indexOf("preview=on") !== -1;
  if (!hasPreview) return;

  // Hosted brand media (same GitHub CDN pattern as the homepage redesign)
  var MEDIA = "https://raw.githubusercontent.com/abdstacker/k-ferrara-images/main/product-page/";
  var lifestyle = {
    cream: MEDIA + "pp-shade-cream.jpg",
    lavender: MEDIA + "pp-shade-lavender.jpg",
    coral: MEDIA + "pp-shade-coral.jpg",
    red: MEDIA + "pp-shade-red.jpg",
    charcoal: MEDIA + "pp-shade-charcoal.jpg",
    gold: MEDIA + "pp-shade-gold.jpg"
  };
  var videos = {
    paint: { src: MEDIA + "pp-paint.mp4", poster: MEDIA + "pp-paint-poster.jpg" },
    giftset: { src: MEDIA + "pp-giftset.mp4", poster: MEDIA + "pp-giftset-poster.jpg" },
    bottle: { src: MEDIA + "pp-bottle.mp4", poster: MEDIA + "pp-bottle-poster.jpg" },
    sharon: { src: MEDIA + "pp-sharon.mp4", poster: MEDIA + "pp-sharon-poster.jpg" }
  };

  // INJECT STYLES
  var style = document.createElement("style");
  style.textContent = [
    "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600&display=swap');",

    // Hide native Squarespace product layout while preview is active
    ".view-item.collection-type-products .ProductItem{display:none !important}",
    ".view-item.collection-type-products .sqs-block-summary-v2{display:none !important}",
    // Hide the big site tagline ("Healthy Nail Polish") so the product sits near the top
    // (the homepage redesign hides this too) — reclaims the wasted vertical space above the hero
    ".Header-tagline{display:none !important}",

    // Wrapper
    // overflow-x:clip prevents horizontal overflow WITHOUT making overflow-y compute to auto
    // (which 'hidden' would, turning the wrap into a nested scroll container)
    ".kf-pp-wrap{font-family:'Montserrat',sans-serif;color:#2C2C2C;background:#fff;overflow-x:clip}",
    ".kf-pp-wrap *{box-sizing:border-box}",

    // Scroll-reveal
    ".kf-pp-reveal{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s ease}",
    ".kf-pp-reveal.in{opacity:1;transform:none}",

    // Breadcrumb
    ".kf-pp-breadcrumb{font-family:'Montserrat',sans-serif;font-size:0.72rem;letter-spacing:2px;text-transform:uppercase;color:#999;padding:1.5rem 2rem 0;max-width:1280px;margin:0 auto}",
    ".kf-pp-breadcrumb a{color:#999;text-decoration:none;transition:color 0.2s ease}",
    ".kf-pp-breadcrumb a:hover{color:#D4A574}",
    ".kf-pp-breadcrumb span{color:#D4A574;margin:0 0.5rem}",

    // Hero — 2-column gallery + info
    ".kf-pp-hero{display:grid;grid-template-columns:1.15fr 1fr;gap:3.5rem;max-width:1280px;margin:0 auto;padding:1.5rem 2rem 4rem;align-items:stretch}",
    ".kf-pp-hero-media{display:flex;flex-direction:column}",
    // lifestyle image at the bottom of the media column — grows to fill any gap so the columns balance
    ".kf-pp-hero-lifestyle{flex:1 1 0;min-height:160px;margin-top:1.5rem;border-radius:10px;overflow:hidden;position:relative;background:#F5F3F0}",
    ".kf-pp-hero-lifestyle img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}",
    ".kf-pp-hero-lifestyle:hover img{transform:scale(1.04)}",
    ".kf-pp-hero-lifestyle-cap{position:absolute;left:0;bottom:0;right:0;padding:1.1rem 1.25rem;background:linear-gradient(transparent,rgba(0,0,0,0.55));color:#fff;font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:500;letter-spacing:0.5px}",

    // "At a glance" strip under the gallery (fills the space below the product image)
    ".kf-pp-gallery-extra{margin-top:1.5rem}",
    ".kf-pp-gh-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.65rem}",
    ".kf-pp-gh-item{background:#FDFBF7;border:1px solid #E8E3DC;border-radius:10px;padding:1.25rem 0.5rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:0.55rem;transition:border-color .25s ease,transform .25s ease}",
    ".kf-pp-gh-item:hover{border-color:#D4A574;transform:translateY(-2px)}",
    ".kf-pp-gh-item svg{width:26px;height:26px;color:#D4A574}",
    ".kf-pp-gh-label{font-family:'Montserrat',sans-serif;font-size:0.63rem;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:#2C2C2C;line-height:1.4}",
    ".kf-pp-gh-guarantee{display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;margin-top:1.1rem;padding-top:1.1rem;border-top:1px solid #E8E3DC}",
    ".kf-pp-gh-guarantee span{font-family:'Montserrat',sans-serif;font-size:0.72rem;color:#888;display:flex;align-items:center;gap:0.45rem}",
    ".kf-pp-gh-guarantee svg{width:17px;height:17px;color:#D4A574;flex-shrink:0}",

    // Gallery
    ".kf-pp-gallery{display:flex;gap:1rem;align-items:flex-start}",
    ".kf-pp-thumbs{display:flex;flex-direction:column;gap:0.6rem;flex-shrink:0}",
    ".kf-pp-thumb{position:relative;width:72px;height:72px;border:1px solid #E8E3DC;background:#F5F3F0;cursor:pointer;overflow:hidden;border-radius:6px;transition:all 0.25s ease;padding:0}",
    ".kf-pp-thumb:hover{border-color:#D4A574}",
    ".kf-pp-thumb.active{border-color:#2C2C2C;border-width:2px}",
    ".kf-pp-thumb img{width:100%;height:100%;object-fit:cover;display:block}",
    ".kf-pp-thumb-video::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:0;height:0;border-style:solid;border-width:7px 0 7px 12px;border-color:transparent transparent transparent #fff;filter:drop-shadow(0 0 3px rgba(0,0,0,0.5))}",
    ".kf-pp-thumb-video::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:30px;height:30px;background:rgba(44,44,44,0.55);border-radius:50%}",
    ".kf-pp-stage{flex:1;position:relative;background:#F5F3F0;border-radius:10px;overflow:hidden;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center}",
    ".kf-pp-stage img{max-width:100%;max-height:100%;object-fit:contain;display:block;transition:opacity 0.25s ease;cursor:zoom-in}",
    ".kf-pp-stage video{width:100%;height:100%;object-fit:cover;display:block;background:#000}",
    ".kf-pp-stage-badge{position:absolute;top:14px;left:14px;z-index:2;background:#D4A574;color:#fff;font-family:'Montserrat',sans-serif;font-size:0.62rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:0.4rem 0.7rem;border-radius:3px}",
    ".kf-pp-stage-zoomhint{position:absolute;bottom:12px;right:12px;z-index:2;background:rgba(255,255,255,0.9);color:#2C2C2C;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0;transition:opacity .25s ease}",
    ".kf-pp-stage:hover .kf-pp-stage-zoomhint{opacity:1}",

    // Lightbox
    ".kf-pp-lb{position:fixed;inset:0;z-index:99999;background:rgba(20,18,16,0.94);display:none;align-items:center;justify-content:center}",
    ".kf-pp-lb.open{display:flex}",
    ".kf-pp-lb-img{max-width:90vw;max-height:88vh;object-fit:contain;cursor:zoom-in;transition:transform .3s ease}",
    ".kf-pp-lb-img.zoomed{transform:scale(2);cursor:zoom-out}",
    ".kf-pp-lb-btn{position:absolute;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.3);color:#fff;width:46px;height:46px;border-radius:50%;font-size:1.4rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s ease}",
    ".kf-pp-lb-btn:hover{background:rgba(212,165,116,0.9);border-color:#D4A574}",
    ".kf-pp-lb-close{top:24px;right:24px}",
    ".kf-pp-lb-prev{left:24px;top:50%;transform:translateY(-50%)}",
    ".kf-pp-lb-next{right:24px;top:50%;transform:translateY(-50%)}",
    ".kf-pp-lb-count{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.8);font-family:'Montserrat',sans-serif;font-size:0.78rem;letter-spacing:1px}",

    // Info column
    ".kf-pp-info{padding-top:0.5rem;display:flex;flex-direction:column}",
    ".kf-pp-badge{display:inline-flex;align-items:center;gap:0.4rem;font-family:'Montserrat',sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#D4A574;margin-bottom:1rem}",
    ".kf-pp-badge svg{flex-shrink:0}",
    ".kf-pp-title{font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:400;color:#2C2C2C;margin:0 0 0.75rem 0;line-height:1.05;letter-spacing:0.5px}",
    ".kf-pp-tagline{font-family:'Montserrat',sans-serif;font-size:0.95rem;font-weight:300;color:#666;line-height:1.6;margin:0 0 1.5rem 0;max-width:92%}",
    ".kf-pp-price-row{display:flex;align-items:baseline;gap:0.75rem;margin:0 0 1.5rem 0;padding-bottom:1.5rem;border-bottom:1px solid #E8E3DC}",
    ".kf-pp-price{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:500;color:#2C2C2C}",
    ".kf-pp-price-note{font-family:'Montserrat',sans-serif;font-size:0.75rem;color:#999;letter-spacing:0.5px}",

    // Shade swatch selector
    ".kf-pp-shades{margin:0 0 1.75rem 0}",
    ".kf-pp-shades-label{font-family:'Montserrat',sans-serif;font-size:0.72rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#2C2C2C;margin:0 0 0.8rem 0}",
    ".kf-pp-shades-label b{color:#D4A574;font-weight:600}",
    ".kf-pp-swatches{display:flex;flex-wrap:wrap;gap:0.55rem;align-items:center}",
    ".kf-pp-swatch{width:34px;height:34px;border-radius:50%;border:1px solid #E8E3DC;cursor:pointer;position:relative;background:#F5F3F0 center/cover no-repeat;transition:transform .18s ease,box-shadow .18s ease;display:block;text-decoration:none;flex-shrink:0}",
    ".kf-pp-swatch:hover{transform:scale(1.15);box-shadow:0 2px 10px rgba(0,0,0,0.18)}",
    ".kf-pp-swatch.active{box-shadow:0 0 0 2px #fff,0 0 0 4px #2C2C2C}",
    ".kf-pp-swatch-all{font-family:'Montserrat',sans-serif;font-size:0.72rem;font-weight:500;letter-spacing:0.5px;color:#D4A574;text-decoration:none;margin-left:0.4rem;white-space:nowrap}",
    ".kf-pp-swatch-all:hover{text-decoration:underline}",

    // Chips
    ".kf-pp-chips{display:flex;flex-wrap:wrap;gap:0.5rem;margin:0 0 1.75rem 0}",
    ".kf-pp-chip{font-family:'Montserrat',sans-serif;font-size:0.7rem;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:#2C2C2C;background:#FDFBF7;border:1px solid #E8E3DC;padding:0.45rem 0.85rem;border-radius:999px}",

    // ATC row (qty + button)
    ".kf-pp-atc-row{display:flex;gap:0.75rem;margin:0 0 1rem 0;align-items:stretch}",
    ".kf-pp-atc-row .product-quantity-input{flex:0 0 140px;display:flex;align-items:center;border:1px solid #2C2C2C;border-radius:0;background:#fff;padding:0 1.1rem;height:56px;font-family:'Montserrat',sans-serif;font-size:0.95rem}",
    ".kf-pp-atc-row .product-quantity-input input{font-family:'Montserrat',sans-serif;font-size:0.95rem;text-align:center;border:none;background:transparent;color:#2C2C2C;width:50%;height:100%}",
    ".kf-pp-atc-row .product-quantity-input button,.kf-pp-atc-row .product-quantity-input .quantity-adjust{background:transparent;border:none;color:#2C2C2C;font-size:1.1rem;cursor:pointer;padding:0 0.5rem;height:100%}",
    ".kf-pp-atc-row .sqs-add-to-cart-button{flex:1;height:56px;background:#2C2C2C;color:#fff;border:none;border-radius:0;font-family:'Montserrat',sans-serif;font-size:0.85rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:background 0.25s ease;padding:0 1.5rem;display:flex;align-items:center;justify-content:center}",
    ".kf-pp-atc-row .sqs-add-to-cart-button:hover{background:#D4A574}",
    ".kf-pp-atc-row .sqs-add-to-cart-button-inner{font-family:'Montserrat',sans-serif !important;font-size:0.85rem !important;font-weight:600 !important;letter-spacing:2px !important;text-transform:uppercase !important;color:#fff !important;background:transparent !important}",
    ".kf-pp-ship-note{display:flex;align-items:center;gap:0.5rem;font-family:'Montserrat',sans-serif;font-size:0.78rem;color:#666;margin:0 0 2rem 0}",
    ".kf-pp-ship-note svg{flex-shrink:0;color:#D4A574}",

    // Accordions in info column
    ".kf-pp-accord{border-top:1px solid #E8E3DC}",
    ".kf-pp-accord-item{border-bottom:1px solid #E8E3DC}",
    ".kf-pp-accord-trigger{width:100%;background:transparent;border:none;text-align:left;padding:1.1rem 0;font-family:'Montserrat',sans-serif;font-size:0.78rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#2C2C2C;cursor:pointer;display:flex;justify-content:space-between;align-items:center}",
    ".kf-pp-accord-trigger:hover{color:#D4A574}",
    ".kf-pp-accord-trigger .kf-pp-accord-icon{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:300;line-height:1;color:#D4A574;transition:transform 0.25s ease}",
    ".kf-pp-accord-item.open .kf-pp-accord-icon{transform:rotate(45deg)}",
    ".kf-pp-accord-body{max-height:0;overflow:hidden;transition:max-height 0.3s ease}",
    ".kf-pp-accord-item.open .kf-pp-accord-body{max-height:1500px}",
    ".kf-pp-accord-body-inner{padding:0 0 1.25rem 0;font-family:'Montserrat',sans-serif;font-size:0.85rem;line-height:1.75;color:#666;font-weight:300}",
    ".kf-pp-accord-body-inner p{margin:0 0 0.75rem 0}",
    ".kf-pp-accord-body-inner ul{padding-left:1rem;margin:0.5rem 0}",
    ".kf-pp-accord-body-inner li{margin-bottom:0.3rem}",

    // Sticky add-to-cart bar
    ".kf-pp-stickybar{position:fixed;left:0;right:0;bottom:0;z-index:9000;background:#fff;border-top:1px solid #E8E3DC;box-shadow:0 -6px 24px rgba(0,0,0,0.08);transform:translateY(105%);transition:transform .35s ease;padding:0.7rem 1.5rem}",
    ".kf-pp-stickybar.visible{transform:translateY(0)}",
    ".kf-pp-stickybar-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:1rem}",
    ".kf-pp-stickybar-thumb{width:46px;height:46px;border-radius:6px;background:#F5F3F0 center/cover no-repeat;flex-shrink:0;border:1px solid #E8E3DC}",
    ".kf-pp-stickybar-meta{display:flex;flex-direction:column;line-height:1.2;min-width:0}",
    ".kf-pp-stickybar-name{font-family:'Cormorant Garamond',serif;font-size:1.15rem;color:#2C2C2C;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".kf-pp-stickybar-price{font-family:'Montserrat',sans-serif;font-size:0.8rem;color:#D4A574;font-weight:600}",
    ".kf-pp-stickybar-btn{margin-left:auto;background:#2C2C2C;color:#fff;border:none;font-family:'Montserrat',sans-serif;font-size:0.78rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:0.95rem 2rem;cursor:pointer;transition:background .25s ease;white-space:nowrap}",
    ".kf-pp-stickybar-btn:hover{background:#D4A574}",

    // Trust bar
    ".kf-pp-trust{background:#2C2C2C;color:#fff;padding:1.75rem 2rem}",
    ".kf-pp-trust-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;align-items:center}",
    ".kf-pp-trust-cell{display:flex;align-items:center;gap:0.85rem;justify-content:center;text-align:left}",
    ".kf-pp-trust-cell svg{flex-shrink:0;color:#D4A574}",
    ".kf-pp-trust-cell-text{font-family:'Montserrat',sans-serif;font-size:0.72rem;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;line-height:1.3}",

    // Section heads
    ".kf-pp-section-head{text-align:center;max-width:720px;margin:0 auto 3rem}",
    ".kf-pp-section-eyebrow{font-family:'Montserrat',sans-serif;font-size:0.72rem;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#D4A574;margin:0 0 0.75rem 0}",
    ".kf-pp-section-head h2{font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:400;color:#2C2C2C;margin:0 0 0.75rem 0;line-height:1.15}",
    ".kf-pp-section-head p{font-family:'Montserrat',sans-serif;font-size:0.95rem;line-height:1.7;color:#666;margin:0;font-weight:300}",

    // "See it in action" video band
    ".kf-pp-action{padding:5rem 2rem;background:#2C2C2C}",
    ".kf-pp-action .kf-pp-section-head h2{color:#fff}",
    ".kf-pp-action .kf-pp-section-head p{color:rgba(255,255,255,0.7)}",
    ".kf-pp-action-grid{display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;max-width:1100px;margin:0 auto}",
    ".kf-pp-action-card{position:relative;width:300px;max-width:84vw;aspect-ratio:9/16;border-radius:12px;overflow:hidden;background:#000;box-shadow:0 12px 40px rgba(0,0,0,0.35)}",
    ".kf-pp-action-card video{width:100%;height:100%;object-fit:cover;display:block}",
    ".kf-pp-action-cap{position:absolute;left:0;right:0;bottom:0;padding:1rem;background:linear-gradient(transparent,rgba(0,0,0,0.7));color:#fff;font-family:'Montserrat',sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.5px}",

    // Benefits grid
    ".kf-pp-benefits{padding:5rem 2rem;background:#FDFBF7}",
    ".kf-pp-benefit-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;max-width:1200px;margin:0 auto}",
    ".kf-pp-benefit-card{background:#fff;border:1px solid #E8E3DC;border-radius:8px;padding:2rem 1.5rem;text-align:center;transition:all 0.3s ease}",
    ".kf-pp-benefit-card:hover{border-color:#D4A574;box-shadow:0 8px 24px rgba(0,0,0,0.05);transform:translateY(-3px)}",
    ".kf-pp-benefit-icon{width:52px;height:52px;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center}",
    ".kf-pp-benefit-title{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:500;color:#2C2C2C;margin:0 0 0.5rem 0}",
    ".kf-pp-benefit-desc{font-family:'Montserrat',sans-serif;font-size:0.82rem;line-height:1.6;color:#888;margin:0;font-weight:300}",

    // How to apply
    ".kf-pp-howto{padding:5rem 2rem;background:#fff}",
    ".kf-pp-step-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;max-width:1100px;margin:0 auto}",
    ".kf-pp-step{text-align:center;position:relative}",
    ".kf-pp-step-num{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:500;color:#fff;background:#D4A574;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;position:relative;z-index:2}",
    ".kf-pp-step-img{width:100%;height:280px;background:#F5F3F0;border-radius:10px;overflow:hidden;margin-bottom:1.25rem;display:flex;align-items:center;justify-content:center}",
    ".kf-pp-step-img img{width:100%;height:100%;object-fit:cover}",
    ".kf-pp-step h3{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:500;color:#2C2C2C;margin:0 0 0.5rem 0}",
    ".kf-pp-step p{font-family:'Montserrat',sans-serif;font-size:0.85rem;line-height:1.65;color:#888;margin:0;font-weight:300;max-width:280px;margin-left:auto;margin-right:auto}",

    // Editorial lifestyle band
    ".kf-pp-editorial{padding:5rem 2rem;background:#FDFBF7}",
    ".kf-pp-editorial-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;max-width:1200px;margin:0 auto}",
    ".kf-pp-editorial-img{aspect-ratio:4/5;border-radius:10px;overflow:hidden;background:#F5F3F0}",
    ".kf-pp-editorial-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}",
    ".kf-pp-editorial-img:hover img{transform:scale(1.05)}",

    // Testimonials
    ".kf-pp-tm{padding:5rem 2rem;background:#fff}",
    ".kf-pp-tm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:1200px;margin:0 auto}",
    ".kf-pp-tm-card{background:#FDFBF7;border:1px solid #E8E3DC;border-radius:8px;padding:2.25rem 1.75rem;text-align:left;display:flex;flex-direction:column}",
    ".kf-pp-tm-mark{font-family:'Cormorant Garamond',serif;font-size:3.5rem;line-height:0.5;color:#D4A574;margin:0 0 1rem 0;height:1.5rem;display:block}",
    ".kf-pp-tm-quote{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:400;color:#2C2C2C;line-height:1.55;margin:0 0 1.5rem 0;font-style:italic;flex:1}",
    ".kf-pp-tm-author{font-family:'Montserrat',sans-serif;font-size:0.78rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#2C2C2C;margin:0 0 0.2rem 0}",
    ".kf-pp-tm-location{font-family:'Montserrat',sans-serif;font-size:0.72rem;color:#999;letter-spacing:0.5px}",

    // FAQ
    ".kf-pp-faq{padding:5rem 2rem 6rem;background:#FDFBF7}",
    ".kf-pp-faq-list{max-width:820px;margin:0 auto}",

    // Related products
    ".kf-pp-related{padding:5rem 2rem 6rem;background:#fff;border-top:1px solid #E8E3DC}",
    ".kf-pp-related-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;max-width:1200px;margin:0 auto}",
    ".kf-pp-related-card{background:#fff;border:1px solid #E8E3DC;cursor:pointer;transition:all 0.3s ease;text-decoration:none;color:inherit;display:flex;flex-direction:column}",
    ".kf-pp-related-card:hover{border-color:#D4A574;box-shadow:0 8px 24px rgba(0,0,0,0.06);transform:translateY(-3px)}",
    ".kf-pp-related-card-img{width:100%;aspect-ratio:1/1;background:#F5F3F0;overflow:hidden;display:flex;align-items:center;justify-content:center}",
    ".kf-pp-related-card-img img{max-width:100%;max-height:100%;object-fit:contain;transition:transform 0.3s ease}",
    ".kf-pp-related-card:hover .kf-pp-related-card-img img{transform:scale(1.05)}",
    ".kf-pp-related-card-info{padding:1rem 1.25rem 1.25rem;text-align:center}",
    ".kf-pp-related-card-title{font-family:'Cormorant Garamond',serif;font-size:1.15rem;font-weight:500;color:#2C2C2C;margin:0 0 0.35rem 0}",
    ".kf-pp-related-card-price{font-family:'Montserrat',sans-serif;font-size:0.85rem;font-weight:500;color:#D4A574;margin:0}",
    ".kf-pp-related-fallback{text-align:center;padding:3rem 0}",
    ".kf-pp-related-fallback a{display:inline-block;padding:0.95rem 2.25rem;border:1.5px solid #2C2C2C;font-family:'Montserrat',sans-serif;font-size:0.78rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#2C2C2C;text-decoration:none;transition:all 0.25s ease}",
    ".kf-pp-related-fallback a:hover{background:#2C2C2C;color:#fff}",

    // Responsive
    "@media(max-width:960px){.kf-pp-hero{grid-template-columns:1fr;gap:2rem;padding:1.5rem 1.5rem 3rem}.kf-pp-title{font-size:2.3rem}.kf-pp-trust-inner{grid-template-columns:repeat(2,1fr);gap:1.5rem}.kf-pp-benefit-grid{grid-template-columns:repeat(2,1fr)}.kf-pp-step-grid{grid-template-columns:1fr;gap:2.5rem}.kf-pp-tm-grid{grid-template-columns:1fr}.kf-pp-related-grid{grid-template-columns:repeat(2,1fr)}.kf-pp-section-head h2{font-size:2rem}.kf-pp-editorial-grid{grid-template-columns:1fr 1fr}.kf-pp-editorial-img:last-child{display:none}}",
    "@media(max-width:560px){.kf-pp-gallery{flex-direction:column-reverse}.kf-pp-thumbs{flex-direction:row;overflow-x:auto;width:100%}.kf-pp-thumb{flex:0 0 60px;width:60px;height:60px}.kf-pp-title{font-size:2rem}.kf-pp-benefit-grid{grid-template-columns:1fr}.kf-pp-trust-inner{grid-template-columns:1fr}.kf-pp-atc-row{flex-direction:column}.kf-pp-atc-row .product-quantity-input{flex:0 0 54px;width:100%}.kf-pp-stickybar-name{max-width:120px}.kf-pp-stickybar-btn{padding:0.85rem 1.2rem}.kf-pp-action-card{width:80vw}.kf-pp-gh-grid{grid-template-columns:repeat(2,1fr)}.kf-pp-gh-guarantee{gap:1rem}}"
  ].join("\n");
  document.head.appendChild(style);

  // SVG icons (no emoji)
  var svgIcons = {
    leaf: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>',
    sparkle: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>',
    truck: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    flag: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 22V4"/><path d="M4 4h14l-2 5 2 5H4"/></svg>',
    clock: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4A574" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>',
    drop: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4A574" stroke-width="1.4"><path d="M12 2.5s7 8 7 13a7 7 0 1 1-14 0c0-5 7-13 7-13z"/></svg>',
    leafBig: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4A574" stroke-width="1.4"><path d="M17 8C8 10 5.9 16.17 3.82 21.34"/><path d="M22 3C21 5 14 21 7 21c-2 0-5-1-5-4.5C2 14 5 9 9 7c4-1 11-1 13-4z"/></svg>',
    smile: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4A574" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    zoom: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>'
  };

  // Curated testimonials (hand-written — not from a review service)
  var testimonials = [
    { quote: "The richest, most pigmented polish I've found. One coat and I'm done — the gloss is unreal.", author: "Maya R.", location: "Atelier Client" },
    { quote: "I've finally found a polish my dermatologist approves of. Lasts almost two weeks without chipping.", author: "Eleanor B.", location: "Salon Regular" },
    { quote: "Smells nothing like traditional polish, dries beautifully, and the color stays true to the bottle.", author: "Priya S.", location: "First-time Buyer" }
  ];

  var faqs = [
    { q: "How long does the polish last?", a: "Worn with our base and top coat, K.Ferrara Color is formulated for 7–10 days of high-shine wear without chipping or fading." },
    { q: "Is it really safe? What is 21-Free?", a: "Our 21-Free formula is free from 21 of the most common toxic ingredients found in conventional polish, including formaldehyde, toluene, DBP, camphor, and parabens. Dermatologist recommended." },
    { q: "Is it vegan and cruelty-free?", a: "Yes. K.Ferrara Color is 100% vegan and never tested on animals — at any stage of development or manufacture." },
    { q: "How do I remove it?", a: "Any acetone or non-acetone polish remover works. For best nail health, we recommend a gentle non-acetone remover and a nourishing cuticle oil after." },
    { q: "Can I wear it during pregnancy?", a: "Many of our customers do. Because we are 21-Free of the chemicals most commonly avoided during pregnancy, our formula is a popular choice — but we always recommend confirming with your healthcare provider." }
  ];

  var benefits = [
    { icon: svgIcons.clock, title: "7–10 Day Wear", desc: "High-shine, chip-resistant finish that lasts almost two weeks." },
    { icon: svgIcons.drop, title: "21-Free Formula", desc: "Free of formaldehyde, toluene, DBP, and 18 other harmful chemicals." },
    { icon: svgIcons.leafBig, title: "Vegan & Cruelty-Free", desc: "No animal-derived ingredients. Never tested on animals." },
    { icon: svgIcons.smile, title: "Dermatologist Recommended", desc: "Gentle enough for sensitive skin and weakened nails." }
  ];

  var howToSteps = [
    { num: "1", title: "Prep & Prime", desc: "Apply a thin layer of our Base Coat to clean, dry nails. Let dry for 60 seconds.", img: lifestyle.cream },
    { num: "2", title: "Two Coats of Color", desc: "Apply your K.Ferrara Color shade in two thin, even coats. Allow each coat to dry fully.", img: lifestyle.coral },
    { num: "3", title: "Seal & Shine", desc: "Lock in your manicure with a glassy Top Coat. Wait 5 minutes before resuming activity.", img: lifestyle.red }
  ];

  // "See it in action" clips
  var actionClips = [
    { v: videos.paint, cap: "Two coats. One flawless finish." },
    { v: videos.giftset, cap: "A shade for every story." },
    { v: videos.sharon, cap: "Sharon — our most-loved shade." }
  ];

  // Editorial lifestyle strip
  var editorialImgs = [lifestyle.lavender, lifestyle.charcoal, lifestyle.gold];

  // ===== Helpers =====
  function escapeHtml(str) {
    if (str == null) return "";
    return String(str).replace(/[&<>"']/g, function(c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function dedupe(arr) {
    var seen = {}, out = [];
    for (var i = 0; i < arr.length; i++) { if (arr[i] && !seen[arr[i]]) { seen[arr[i]] = 1; out.push(arr[i]); } }
    return out;
  }
  function slugOf(url) {
    if (!url) return "";
    return url.replace(/[?#].*$/, "").replace(/\/$/, "").split("/").pop();
  }

  // Concurrency-limited average-color sampler (the saturated pixels = the lacquer color)
  var colorCache = {};
  var sampleQueue = [], sampleActive = 0, SAMPLE_MAX = 6;
  function sampleColor(url, cb) {
    if (!url) { cb(null); return; }
    if (colorCache[url]) { cb(colorCache[url]); return; }
    sampleQueue.push([url, cb]);
    pumpSamples();
  }
  function pumpSamples() {
    while (sampleActive < SAMPLE_MAX && sampleQueue.length) {
      var job = sampleQueue.shift();
      sampleActive++;
      (function(url, cb) {
        var img = new Image();
        img.crossOrigin = "anonymous";
        var done = false;
        var finish = function(val) { if (done) return; done = true; colorCache[url] = val; sampleActive--; cb(val); pumpSamples(); };
        var to = setTimeout(function() { finish(null); }, 8000);
        img.onload = function() {
          clearTimeout(to);
          try {
            var w = 80, h = Math.max(1, Math.round(img.naturalHeight / img.naturalWidth * 80));
            var c = document.createElement("canvas"); c.width = w; c.height = h;
            var ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0, w, h);
            var d = ctx.getImageData(0, 0, w, h).data;
            var rs = 0, gs = 0, bs = 0, n = 0;   // saturated (lacquer) pixels
            var rm = 0, gm = 0, bm = 0, m = 0;   // mid-tone fallback (non-white, non-black)
            for (var i = 0; i < d.length; i += 4) {
              var r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
              if (a < 200) continue;
              var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
              if (mx > 244 || mx < 38) continue; // skip white background + near-black cap
              rm += r; gm += g; bm += b; m++;
              var sat = mx === 0 ? 0 : (mx - mn) / mx;
              if (sat > 0.20) { rs += r; gs += g; bs += b; n++; }
            }
            // prefer the saturated lacquer average; otherwise the mid-tone average — always a real color
            if (n > 4) finish("rgb(" + Math.round(rs / n) + "," + Math.round(gs / n) + "," + Math.round(bs / n) + ")");
            else if (m > 4) finish("rgb(" + Math.round(rm / m) + "," + Math.round(gm / m) + "," + Math.round(bm / m) + ")");
            else finish(null);
          } catch (e) { finish(null); }
        };
        img.onerror = function() { clearTimeout(to); finish(null); };
        img.src = url + (url.indexOf("?") === -1 ? "?format=100w" : "");
      })(job[0], job[1]);
    }
  }

  // ===== Build =====
  function init() {
    var body = document.body;
    if (!body) return;
    if (!(body.classList.contains("view-item") && body.classList.contains("collection-type-products"))) return;
    var nativeProduct = document.querySelector(".ProductItem");
    if (!nativeProduct) return;
    if (document.querySelector(".kf-pp-wrap")) return;

    // --- Scrape native product data ---
    var titleEl = nativeProduct.querySelector(".ProductItem-details-title");
    var priceEl = nativeProduct.querySelector(".product-price");
    var galleryEl = nativeProduct.querySelector(".ProductItem-gallery");
    var atcBtn = nativeProduct.querySelector(".sqs-add-to-cart-button");
    var qtyInput = nativeProduct.querySelector(".product-quantity-input");
    var excerptEl = nativeProduct.querySelector(".ProductItem-details-excerpt");

    var title = titleEl ? titleEl.textContent.trim() : "K.Ferrara Color";
    var price = priceEl ? priceEl.textContent.trim() : "";

    var galleryImgs = galleryEl ? galleryEl.querySelectorAll("img") : [];
    var imgSrcs = [];
    for (var g = 0; g < galleryImgs.length; g++) {
      var src = galleryImgs[g].getAttribute("src") || galleryImgs[g].getAttribute("data-src");
      if (src) imgSrcs.push(src);
    }
    imgSrcs = dedupe(imgSrcs);
    var primaryImg = imgSrcs[0] || "";

    var tagline = "";
    if (excerptEl) {
      tagline = excerptEl.textContent.trim().replace(/\s+/g, " ");
      if (tagline.length > 180) tagline = tagline.slice(0, 180).replace(/\s\S*$/, "") + "…";
    }
    if (!tagline) tagline = "A luxurious, 21-Free shade with a salon-quality high-shine finish — hand-crafted to be safer, kinder, and beautifully wearable.";

    var descEl = nativeProduct.querySelector(".ProductItem-details-excerpt, .ProductItem-summary, .sqs-block-html");
    var descHTML = descEl ? descEl.innerHTML : "";
    var currentSlug = slugOf(location.pathname);

    // --- Build the gallery media list: product images + lifestyle + video ---
    var media = [];
    imgSrcs.forEach(function(s) { media.push({ type: "image", src: s }); });
    [lifestyle.coral, lifestyle.charcoal, lifestyle.gold].forEach(function(s) { media.push({ type: "image", src: s }); });
    media.push({ type: "video", src: videos.paint.src, poster: videos.paint.poster });
    var imageMedia = media.filter(function(m) { return m.type === "image"; });

    // --- Wrapper ---
    var wrap = document.createElement("div");
    wrap.className = "kf-pp-wrap";

    // Breadcrumb
    var crumb = document.createElement("nav");
    crumb.className = "kf-pp-breadcrumb";
    crumb.innerHTML = '<a href="/shoppolishcolors">Shop</a><span>/</span><a href="/shoppolishcolors">Colors</a><span>/</span>' + escapeHtml(title);

    // Hero
    var hero = document.createElement("section");
    hero.className = "kf-pp-hero";

    // Gallery
    var galleryWrap = document.createElement("div");
    galleryWrap.className = "kf-pp-gallery";
    var thumbsHTML = media.map(function(m, i) {
      var thumbImg = m.type === "video" ? m.poster : m.src;
      var cls = "kf-pp-thumb" + (i === 0 ? " active" : "") + (m.type === "video" ? " kf-pp-thumb-video" : "");
      return '<button class="' + cls + '" data-i="' + i + '"><img src="' + escapeHtml(thumbImg) + '" alt="' + escapeHtml(title) + ' view ' + (i + 1) + '"></button>';
    }).join("");
    galleryWrap.innerHTML =
      '<div class="kf-pp-thumbs">' + thumbsHTML + '</div>' +
      '<div class="kf-pp-stage">' +
        '<img class="kf-pp-main-img" src="' + escapeHtml(primaryImg) + '" alt="' + escapeHtml(title) + '">' +
        '<div class="kf-pp-stage-zoomhint">' + svgIcons.zoom + '</div>' +
      '</div>';

    // Info column
    var info = document.createElement("div");
    info.className = "kf-pp-info";
    info.innerHTML =
      '<div class="kf-pp-badge">' + svgIcons.sparkle + ' Loved by salon pros</div>' +
      '<h1 class="kf-pp-title">' + escapeHtml(title) + '</h1>' +
      '<p class="kf-pp-tagline">' + escapeHtml(tagline) + '</p>' +
      '<div class="kf-pp-price-row"><div class="kf-pp-price">' + escapeHtml(price) + '</div><div class="kf-pp-price-note">Inclusive of all taxes</div></div>' +
      '<div class="kf-pp-shades"><div class="kf-pp-shades-label">Shade — <b>' + escapeHtml(title) + '</b></div><div class="kf-pp-swatches" id="kf-pp-swatches"></div></div>' +
      '<div class="kf-pp-chips">' +
        '<span class="kf-pp-chip">21-Free</span>' +
        '<span class="kf-pp-chip">Vegan</span>' +
        '<span class="kf-pp-chip">7–10 Day Wear</span>' +
        '<span class="kf-pp-chip">Made in USA</span>' +
      '</div>' +
      '<div class="kf-pp-atc-row" id="kf-pp-atc-slot"></div>' +
      '<div class="kf-pp-ship-note">' + svgIcons.truck + ' Complimentary shipping on orders over $75</div>' +
      '<div class="kf-pp-accord" id="kf-pp-accord"></div>';

    // Left media column = gallery + an "at a glance" strip that fills the space under the image
    var leftCol = document.createElement("div");
    leftCol.className = "kf-pp-hero-media";
    leftCol.appendChild(galleryWrap);
    function ghItem(icon, label) { return '<div class="kf-pp-gh-item">' + icon + '<div class="kf-pp-gh-label">' + label + '</div></div>'; }
    var extra = document.createElement("div");
    extra.className = "kf-pp-gallery-extra";
    extra.innerHTML =
      '<div class="kf-pp-gh-grid">' +
        ghItem(svgIcons.clock, "7–10 Day Wear") +
        ghItem(svgIcons.drop, "21-Free Formula") +
        ghItem(svgIcons.leafBig, "Vegan & Cruelty-Free") +
        ghItem(svgIcons.sparkle, "High-Shine Finish") +
      '</div>' +
      '<div class="kf-pp-gh-guarantee">' +
        '<span>' + svgIcons.truck + ' Free shipping over $75</span>' +
        '<span>' + svgIcons.sparkle + ' Dermatologist recommended</span>' +
        '<span>' + svgIcons.flag + ' Made in the USA</span>' +
      '</div>';
    leftCol.appendChild(extra);
    // lifestyle image fills the remaining height so the gallery column matches the info column
    var lifeBand = document.createElement("div");
    lifeBand.className = "kf-pp-hero-lifestyle";
    lifeBand.innerHTML = '<img src="' + lifestyle.red + '" alt="K.Ferrara Color manicure"><div class="kf-pp-hero-lifestyle-cap">Salon-quality shine, at home.</div>';
    leftCol.appendChild(lifeBand);

    hero.appendChild(leftCol);
    hero.appendChild(info);

    // In-info accordion
    var accordItems = [
      { title: "Why You'll Love It", body: '<ul><li>High-shine, gel-like finish without UV curing</li><li>21-Free clean formula — safer for you and the planet</li><li>Vegan, cruelty-free, dermatologist recommended</li><li>Long-wearing color that resists chipping for 7–10 days</li></ul>' },
      { title: "How To Apply", body: '<p>Start with clean, dry nails. Apply a thin layer of K.Ferrara Base Coat. Follow with two thin coats of color, allowing each to dry. Finish with K.Ferrara Top Coat for a glassy, long-lasting finish.</p>' },
      { title: "Full Product Details", body: descHTML || "<p>Long-wearing, vegan, cruelty-free polish in a 21-Free formula. Free from formaldehyde, toluene, DBP, parabens, and 17 other commonly avoided ingredients.</p>" }
    ];
    info.querySelector("#kf-pp-accord").innerHTML = accordItems.map(function(item, i) {
      return '<div class="kf-pp-accord-item' + (i === 0 ? " open" : "") + '">' +
        '<button class="kf-pp-accord-trigger" aria-expanded="' + (i === 0 ? "true" : "false") + '"><span>' + escapeHtml(item.title) + '</span><span class="kf-pp-accord-icon">+</span></button>' +
        '<div class="kf-pp-accord-body"><div class="kf-pp-accord-body-inner">' + item.body + '</div></div></div>';
    }).join("");

    // Trust bar
    var trust = document.createElement("section");
    trust.className = "kf-pp-trust kf-pp-reveal";
    trust.innerHTML = '<div class="kf-pp-trust-inner">' +
      '<div class="kf-pp-trust-cell">' + svgIcons.truck + '<div class="kf-pp-trust-cell-text">Free shipping<br>over $75</div></div>' +
      '<div class="kf-pp-trust-cell">' + svgIcons.sparkle + '<div class="kf-pp-trust-cell-text">21-Free<br>formula</div></div>' +
      '<div class="kf-pp-trust-cell">' + svgIcons.leaf + '<div class="kf-pp-trust-cell-text">Vegan &amp;<br>cruelty-free</div></div>' +
      '<div class="kf-pp-trust-cell">' + svgIcons.flag + '<div class="kf-pp-trust-cell-text">Made<br>in USA</div></div>' +
      '</div>';

    // "See it in action" video band
    var action = document.createElement("section");
    action.className = "kf-pp-action kf-pp-reveal";
    action.innerHTML =
      '<div class="kf-pp-section-head">' +
        '<div class="kf-pp-section-eyebrow">The K.Ferrara Ritual</div>' +
        '<h2>See It In Action</h2>' +
        '<p>Real hands, real shine — a glassy, gel-like finish you can create at home.</p>' +
      '</div>' +
      '<div class="kf-pp-action-grid">' +
        actionClips.map(function(c) {
          return '<div class="kf-pp-action-card">' +
            '<video src="' + c.v.src + '" poster="' + c.v.poster + '" muted loop playsinline preload="metadata"></video>' +
            '<div class="kf-pp-action-cap">' + escapeHtml(c.cap) + '</div>' +
          '</div>';
        }).join("") +
      '</div>';

    // Benefits
    var benefitsSection = document.createElement("section");
    benefitsSection.className = "kf-pp-benefits kf-pp-reveal";
    benefitsSection.innerHTML =
      '<div class="kf-pp-section-head"><div class="kf-pp-section-eyebrow">Clean Beauty, Without Compromise</div>' +
      '<h2>Why ' + escapeHtml(title) + ' Belongs in Your Vanity</h2>' +
      '<p>Hand-blended in small batches with the safest ingredients in the industry — because a beautiful manicure should never come at the cost of your health.</p></div>' +
      '<div class="kf-pp-benefit-grid">' + benefits.map(function(b) {
        return '<div class="kf-pp-benefit-card"><div class="kf-pp-benefit-icon">' + b.icon + '</div>' +
          '<div class="kf-pp-benefit-title">' + escapeHtml(b.title) + '</div>' +
          '<div class="kf-pp-benefit-desc">' + escapeHtml(b.desc) + '</div></div>';
      }).join("") + '</div>';

    // How to apply
    var howto = document.createElement("section");
    howto.className = "kf-pp-howto kf-pp-reveal";
    howto.innerHTML =
      '<div class="kf-pp-section-head"><div class="kf-pp-section-eyebrow">The Ritual</div>' +
      '<h2>Three Steps to a Salon Manicure</h2>' +
      '<p>A simple, three-step routine for a high-shine finish that wears like a gel — without the damage.</p></div>' +
      '<div class="kf-pp-step-grid">' + howToSteps.map(function(s) {
        return '<div class="kf-pp-step"><div class="kf-pp-step-num">' + s.num + '</div>' +
          '<div class="kf-pp-step-img"><img src="' + escapeHtml(s.img) + '" alt="' + escapeHtml(s.title) + '"></div>' +
          '<h3>' + escapeHtml(s.title) + '</h3><p>' + escapeHtml(s.desc) + '</p></div>';
      }).join("") + '</div>';

    // Editorial lifestyle band
    var editorial = document.createElement("section");
    editorial.className = "kf-pp-editorial kf-pp-reveal";
    editorial.innerHTML =
      '<div class="kf-pp-section-head"><div class="kf-pp-section-eyebrow">The Spectrum</div>' +
      '<h2>A Shade for Every Story</h2></div>' +
      '<div class="kf-pp-editorial-grid">' + editorialImgs.map(function(src) {
        return '<a href="/shoppolishcolors" class="kf-pp-editorial-img"><img src="' + escapeHtml(src) + '" alt="K.Ferrara Color shade"></a>';
      }).join("") + '</div>';

    // Testimonials
    var tmSection = document.createElement("section");
    tmSection.className = "kf-pp-tm kf-pp-reveal";
    tmSection.innerHTML =
      '<div class="kf-pp-section-head"><div class="kf-pp-section-eyebrow">From the K.Ferrara Atelier</div>' +
      '<h2>Loved by Discerning Hands</h2></div>' +
      '<div class="kf-pp-tm-grid">' + testimonials.map(function(tm) {
        return '<div class="kf-pp-tm-card"><span class="kf-pp-tm-mark">“</span>' +
          '<div class="kf-pp-tm-quote">' + escapeHtml(tm.quote) + '</div>' +
          '<div class="kf-pp-tm-author">' + escapeHtml(tm.author) + '</div>' +
          '<div class="kf-pp-tm-location">' + escapeHtml(tm.location) + '</div></div>';
      }).join("") + '</div>';

    // FAQ
    var faqSection = document.createElement("section");
    faqSection.className = "kf-pp-faq kf-pp-reveal";
    faqSection.innerHTML =
      '<div class="kf-pp-section-head"><div class="kf-pp-section-eyebrow">Good to Know</div>' +
      '<h2>Frequently Asked Questions</h2></div>' +
      '<div class="kf-pp-faq-list kf-pp-accord">' + faqs.map(function(f) {
        return '<div class="kf-pp-accord-item">' +
          '<button class="kf-pp-accord-trigger" aria-expanded="false"><span>' + escapeHtml(f.q) + '</span><span class="kf-pp-accord-icon">+</span></button>' +
          '<div class="kf-pp-accord-body"><div class="kf-pp-accord-body-inner"><p>' + escapeHtml(f.a) + '</p></div></div></div>';
      }).join("") + '</div>';

    // Related
    var related = document.createElement("section");
    related.className = "kf-pp-related kf-pp-reveal";
    related.innerHTML =
      '<div class="kf-pp-section-head"><div class="kf-pp-section-eyebrow">Pair It With</div><h2>You Might Also Love</h2></div>' +
      '<div class="kf-pp-related-grid" id="kf-pp-related-grid"></div>';

    // Assemble
    wrap.appendChild(crumb);
    wrap.appendChild(hero);
    wrap.appendChild(trust);
    wrap.appendChild(action);
    wrap.appendChild(benefitsSection);
    wrap.appendChild(howto);
    wrap.appendChild(editorial);
    wrap.appendChild(tmSection);
    wrap.appendChild(faqSection);
    wrap.appendChild(related);
    nativeProduct.parentNode.insertBefore(wrap, nativeProduct);

    // --- Relocate native qty + ATC (move, not clone) + price-in-button ---
    var atcSlot = wrap.querySelector("#kf-pp-atc-slot");
    if (atcSlot) {
      if (qtyInput) atcSlot.appendChild(qtyInput);
      if (atcBtn) {
        atcSlot.appendChild(atcBtn);
        var inner = atcBtn.querySelector(".sqs-add-to-cart-button-inner") || atcBtn;
        var baseLabel = (inner.textContent || "Add to Cart").trim().replace(/\s+/g, " ");
        if (price && baseLabel.indexOf(price) === -1) inner.textContent = baseLabel + "  —  " + price;
      }
    }

    // --- Sticky add-to-cart bar ---
    var sticky = document.createElement("div");
    sticky.className = "kf-pp-stickybar";
    sticky.innerHTML =
      '<div class="kf-pp-stickybar-inner">' +
        '<div class="kf-pp-stickybar-thumb" style="background-image:url(' + escapeHtml(primaryImg) + ')"></div>' +
        '<div class="kf-pp-stickybar-meta"><div class="kf-pp-stickybar-name">' + escapeHtml(title) + '</div><div class="kf-pp-stickybar-price">' + escapeHtml(price) + '</div></div>' +
        '<button class="kf-pp-stickybar-btn" type="button">Add to Cart</button>' +
      '</div>';
    document.body.appendChild(sticky);
    sticky.querySelector(".kf-pp-stickybar-btn").addEventListener("click", function() {
      if (atcBtn) atcBtn.click();
    });

    // --- Gallery: thumb swap (image or video) + lightbox ---
    var stage = galleryWrap.querySelector(".kf-pp-stage");
    function showMedia(i) {
      var m = media[i];
      if (!m) return;
      var zoomhint = '<div class="kf-pp-stage-zoomhint">' + svgIcons.zoom + '</div>';
      if (m.type === "video") {
        stage.innerHTML = '<video src="' + m.src + '" poster="' + m.poster + '" controls autoplay muted loop playsinline></video>';
      } else {
        stage.innerHTML = '<img class="kf-pp-main-img" src="' + escapeHtml(m.src) + '" alt="' + escapeHtml(title) + '">' + zoomhint;
        var mi = stage.querySelector(".kf-pp-main-img");
        mi.style.opacity = 0;
        setTimeout(function() { mi.style.opacity = 1; }, 30);
        mi.addEventListener("click", function() { openLightbox(imageMedia.indexOf(m)); });
      }
    }
    galleryWrap.querySelectorAll(".kf-pp-thumb").forEach(function(thumb) {
      thumb.addEventListener("click", function() {
        galleryWrap.querySelectorAll(".kf-pp-thumb").forEach(function(b) { b.classList.remove("active"); });
        this.classList.add("active");
        showMedia(parseInt(this.getAttribute("data-i"), 10));
      });
    });
    // initial main image click → lightbox
    var firstMain = stage.querySelector(".kf-pp-main-img");
    if (firstMain) firstMain.addEventListener("click", function() { openLightbox(0); });

    // --- Lightbox ---
    var lb = document.createElement("div");
    lb.className = "kf-pp-lb";
    lb.innerHTML =
      '<button class="kf-pp-lb-btn kf-pp-lb-close" aria-label="Close">×</button>' +
      '<button class="kf-pp-lb-btn kf-pp-lb-prev" aria-label="Previous">‹</button>' +
      '<img class="kf-pp-lb-img" src="" alt="">' +
      '<button class="kf-pp-lb-btn kf-pp-lb-next" aria-label="Next">›</button>' +
      '<div class="kf-pp-lb-count"></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector(".kf-pp-lb-img");
    var lbCount = lb.querySelector(".kf-pp-lb-count");
    var lbIndex = 0;
    function renderLb() {
      var m = imageMedia[lbIndex];
      if (!m) return;
      lbImg.classList.remove("zoomed");
      lbImg.src = m.src;
      lbCount.textContent = (lbIndex + 1) + " / " + imageMedia.length;
    }
    function openLightbox(i) { lbIndex = (i < 0 ? 0 : i); renderLb(); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
    function closeLightbox() { lb.classList.remove("open"); document.body.style.overflow = ""; }
    function lbStep(d) { lbIndex = (lbIndex + d + imageMedia.length) % imageMedia.length; renderLb(); }
    lb.querySelector(".kf-pp-lb-close").addEventListener("click", closeLightbox);
    lb.querySelector(".kf-pp-lb-prev").addEventListener("click", function(e) { e.stopPropagation(); lbStep(-1); });
    lb.querySelector(".kf-pp-lb-next").addEventListener("click", function(e) { e.stopPropagation(); lbStep(1); });
    lbImg.addEventListener("click", function(e) { e.stopPropagation(); lbImg.classList.toggle("zoomed"); });
    lb.addEventListener("click", function(e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function(e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") lbStep(-1);
      else if (e.key === "ArrowRight") lbStep(1);
    });

    // --- Accordions ---
    wrap.querySelectorAll(".kf-pp-accord-trigger").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var item = this.parentNode;
        var isOpen = item.classList.contains("open");
        item.classList.toggle("open");
        this.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });

    // --- Scroll-reveal + sticky bar + lazy video play (IntersectionObserver) ---
    if ("IntersectionObserver" in window) {
      var revObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) { if (en.isIntersecting) { en.target.classList.add("in"); revObs.unobserve(en.target); } });
      }, { threshold: 0.12 });
      wrap.querySelectorAll(".kf-pp-reveal").forEach(function(el) { revObs.observe(el); });

      // sticky bar: show once hero is scrolled past
      var heroObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
          if (!en.isIntersecting && en.boundingClientRect.top < 0) sticky.classList.add("visible");
          else sticky.classList.remove("visible");
        });
      }, { threshold: 0 });
      heroObs.observe(hero);

      // play band videos only when visible
      var vidObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(en) {
          var v = en.target;
          if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function(){}); }
          else v.pause();
        });
      }, { threshold: 0.4 });
      action.querySelectorAll("video").forEach(function(v) { vidObs.observe(v); });
    } else {
      wrap.querySelectorAll(".kf-pp-reveal").forEach(function(el) { el.classList.add("in"); });
    }

    // --- Shade-swatch selector (fetch all shades, sample colors) ---
    var swWrap = wrap.querySelector("#kf-pp-swatches");
    fetch("/shoppolishcolors").then(function(r) { return r.text(); }).then(function(html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var els = doc.querySelectorAll("[data-product]");
      var shades = [], seen = {};
      for (var i = 0; i < els.length; i++) {
        try {
          var p = JSON.parse(els[i].getAttribute("data-product"));
          if (!p || !p.fullUrl) continue;
          var sl = slugOf(p.fullUrl);
          if (seen[sl]) continue; seen[sl] = 1;
          var imgUrl = (p.mainImage && p.mainImage.assetUrl) || (p.images && p.images[0] && p.images[0].assetUrl) || "";
          shades.push({ slug: sl, title: p.title || sl, url: p.fullUrl, img: imgUrl });
        } catch (e) {}
      }
      if (!shades.length || !swWrap) return;
      // ensure current shade is present + first
      var curIdx = -1;
      for (var j = 0; j < shades.length; j++) { if (shades[j].slug === currentSlug) { curIdx = j; break; } }
      var CAP = 22;
      var show = shades.slice(0, CAP);
      if (curIdx >= CAP) { show[CAP - 1] = shades[curIdx]; } // make sure current is shown
      show.forEach(function(s) {
        var a = document.createElement("a");
        a.className = "kf-pp-swatch" + (s.slug === currentSlug ? " active" : "");
        a.href = s.url;
        a.title = s.title;
        if (s.img) a.style.backgroundImage = "url(" + s.img + "?format=100w)"; // fallback view until sampled
        swWrap.appendChild(a);
        sampleColor(s.img, function(col) { if (col) { a.style.backgroundImage = "none"; a.style.background = col; } });
      });
      if (shades.length > show.length) {
        var more = document.createElement("a");
        more.className = "kf-pp-swatch-all";
        more.href = "/shoppolishcolors";
        more.textContent = "View all " + shades.length + " shades →";
        swWrap.appendChild(more);
      }
    }).catch(function() {
      // hide the shade block silently if the fetch fails
      var blk = wrap.querySelector(".kf-pp-shades");
      if (blk) blk.style.display = "none";
    });

    // --- Related products (fetch from /shoppolishcolors) ---
    fetch("/shoppolishcolors").then(function(r) { return r.text(); }).then(function(html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var productEls = doc.querySelectorAll("[data-product]");
      var grid = document.getElementById("kf-pp-related-grid");
      if (!grid) return;
      if (!productEls.length) { relatedFallback(grid); return; }
      var added = 0;
      for (var i = 0; i < productEls.length && added < 4; i++) {
        try {
          var prod = JSON.parse(productEls[i].getAttribute("data-product"));
          if (!prod) continue;
          if (prod.fullUrl && slugOf(prod.fullUrl) === currentSlug) continue;
          var imgUrl = (prod.mainImage && prod.mainImage.assetUrl) || (prod.images && prod.images[0] && prod.images[0].assetUrl) || "";
          var priceVal = prod.price ? parseFloat(prod.price.value || 0) : 0;
          var card = document.createElement("a");
          card.className = "kf-pp-related-card";
          card.href = prod.fullUrl || "#";
          var imgHtml = imgUrl
            ? '<img src="' + escapeHtml(imgUrl) + '?format=500w" alt="' + escapeHtml(prod.title || "") + '">'
            : '<div style="color:#D4A574;font-family:Cormorant Garamond,serif;font-size:1.3rem;">K.Ferrara</div>';
          card.innerHTML =
            '<div class="kf-pp-related-card-img">' + imgHtml + '</div>' +
            '<div class="kf-pp-related-card-info"><div class="kf-pp-related-card-title">' + escapeHtml(prod.title || "Product") + '</div>' +
            '<div class="kf-pp-related-card-price">$' + priceVal.toFixed(2) + '</div></div>';
          grid.appendChild(card);
          added++;
        } catch (e) {}
      }
      if (added === 0) relatedFallback(grid);
    }).catch(function() {
      var grid = document.getElementById("kf-pp-related-grid");
      if (grid) relatedFallback(grid);
    });
    function relatedFallback(grid) {
      grid.parentNode.innerHTML = grid.parentNode.querySelector(".kf-pp-section-head").outerHTML +
        '<div class="kf-pp-related-fallback"><a href="/shoppolishcolors">Explore More Colors</a></div>';
    }
  }

  // Robust DOM-ready with retry
  function tryInit() {
    if (document.querySelector(".ProductItem")) { init(); }
    else { setTimeout(tryInit, 200); }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() { setTimeout(tryInit, 100); });
  } else {
    setTimeout(tryInit, 100);
  }
})();
