/* ================= DK TV: KAWALAN YOUTUBE (IFrame Player API) =================
   Fail ini membolehkan butang pemain DK TV (bisu, skrin penuh, main/jeda) mengawal
   saluran YouTube, sama seperti saluran m3u8.

   Cara pasang (index.html), letak dalam <head> selepas hls.js:
     <script src="yt-kawal.js"></script>

   Cara guna ringkas:
     var yt = YTKawal.mainkan(bekasVideo, s.url, {
       onSedia: function () {},                       // pemain sudah sedia
       onMain:  function () {},                       // mula bermain
       onJeda:  function () {},                       // dijeda
       onTamat: function (mesej) {},                  // siaran / video tamat
       onRalat: function (mesej, kekal) {}            // kekal = true: jangan cuba semula
     });
     yt.togolBisu();       // pulangkan true jika kini bisu
     yt.togolMain();
     yt.kelantangan(50);   // 0 hingga 100
     yt.skrinPenuh();      // skrin penuh pada bekasVideo (butang & logo DK TV kekal kelihatan)
     yt.musnah();          // WAJIB dipanggil sebelum menukar saluran

   Saluran ytLive() (controls=0) dikira siaran langsung; ytVod() (controls=1) dikira video biasa.
   ============================================================================== */

var YTKawal = (function () {
  var janjiApi = null;

  var MESEJ_RALAT = {
    2:   'ID video YouTube tidak sah. Semak ID dalam channel.js.',
    5:   'Pelayar ini tidak dapat memainkan video YouTube ini.',
    100: 'Video tidak dijumpai, telah dipadam atau dijadikan peribadi.',
    101: 'Pemilik video tidak membenarkan ia dimainkan di laman lain.',
    150: 'Pemilik video tidak membenarkan ia dimainkan di laman lain.'
  };
  var RALAT_KEKAL = { 2: true, 100: true, 101: true, 150: true };

  /* Muat API YouTube sekali sahaja */
  function muatApi() {
    if (janjiApi) return janjiApi;
    janjiApi = new Promise(function (ok, gagal) {
      if (window.YT && window.YT.Player) { ok(window.YT); return; }
      var lama = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (typeof lama === 'function') lama();
        ok(window.YT);
      };
      var skrip = document.createElement('script');
      skrip.src = 'https://www.youtube.com/iframe_api';
      skrip.async = true;
      skrip.onerror = function () {
        janjiApi = null;
        gagal(new Error('API YouTube gagal dimuatkan. Semak sambungan internet atau penyekat iklan.'));
      };
      document.head.appendChild(skrip);
    });
    return janjiApi;
  }

  function idVideo(url) {
    var m = String(url || '').match(/(?:embed\/|[?&]v=|youtu\.be\/|live\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  /* Salin parameter daripada ytLive()/ytVod() supaya tetapan sedia ada dikekalkan */
  function parameter(url) {
    var hasil = {};
    var q = String(url || '').split('?')[1];
    if (q) {
      q.split('&').forEach(function (kv) {
        var p = kv.split('=');
        if (!p[0] || p[1] === undefined) return;
        var nilai = decodeURIComponent(p[1]);
        hasil[decodeURIComponent(p[0])] = /^\d+$/.test(nilai) ? Number(nilai) : nilai;
      });
    }
    hasil.enablejsapi = 1;
    hasil.origin = location.origin;
    return hasil;
  }

  function pasangGaya() {
    if (document.getElementById('yt-kawal-gaya')) return;
    var g = document.createElement('style');
    g.id = 'yt-kawal-gaya';
    g.textContent =
      '.yt-slot{position:absolute;top:0;left:0;width:100%;height:100%;z-index:0}' +
      '.yt-slot iframe{width:100%;height:100%;border:0;display:block}' +
      '.yt-penuh-css{position:fixed!important;top:0;left:0;width:100vw!important;height:100vh!important;z-index:99999;background:#000}';
    document.head.appendChild(g);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      Array.prototype.forEach.call(document.querySelectorAll('.yt-penuh-css'), function (el) { el.classList.remove('yt-penuh-css'); });
    });
  }

  function skrinPenuh(el) {
    pasangGaya();
    var d = document;
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      return false;
    }
    if (el.classList.contains('yt-penuh-css')) {
      el.classList.remove('yt-penuh-css');
      return false;
    }
    var minta = el.requestFullscreen || el.webkitRequestFullscreen;
    if (minta) {
      try { minta.call(el); return true; } catch (e) { /* jatuh ke cara CSS */ }
    }
    /* iPhone Safari tidak sokong skrin penuh untuk div: guna CSS */
    el.classList.add('yt-penuh-css');
    return true;
  }

  function mainkan(bekas, url, pilihan) {
    pilihan = pilihan || {};
    pasangGaya();

    var id = idVideo(url);
    var vars = parameter(url);
    var langsung = pilihan.langsung !== undefined ? pilihan.langsung : vars.controls === 0;
    var pemain = null, sedia = false, dimusnah = false;
    var bisu = vars.mute === 1;
    var tmrTersekat = null;

    function panggil(nama, a, b) {
      if (!dimusnah && typeof pilihan[nama] === 'function') pilihan[nama](a, b);
    }

    if (getComputedStyle(bekas).position === 'static') bekas.style.position = 'relative';
    var slot = document.createElement('div');
    slot.className = 'yt-slot';
    var sasaran = document.createElement('div');
    slot.appendChild(sasaran);
    bekas.insertBefore(slot, bekas.firstChild);   /* di bawah butang kawalan sedia ada */

    if (!id) {
      setTimeout(function () { panggil('onRalat', 'Pautan YouTube tidak sah.', true); }, 0);
    } else {
      muatApi().then(function (YT) {
        if (dimusnah) return;
        pemain = new YT.Player(sasaran, {
          videoId: id,
          width: '100%',
          height: '100%',
          playerVars: vars,
          events: {
            onReady: function (e) {
              if (dimusnah) return;
              sedia = true;
              if (bisu) e.target.mute(); else e.target.unMute();
              e.target.playVideo();
              panggil('onSedia');
              /* Pelayar sekat autoplay berbunyi: senyapkan dan main semula */
              if (!bisu) setTimeout(function () {
                if (dimusnah || !sedia) return;
                var k = pemain.getPlayerState();
                if (k !== YT.PlayerState.PLAYING && k !== YT.PlayerState.BUFFERING) {
                  bisu = true; pemain.mute(); pemain.playVideo();
                  panggil('onBisuPaksa');
                }
              }, 2500);
            },
            onStateChange: function (e) {
              var S = YT.PlayerState;
              clearTimeout(tmrTersekat);
              if (e.data === S.PLAYING) {
                /* YouTube kadang-kadang senyapkan sendiri: selaraskan ikon bunyi */
                if (pemain.isMuted && pemain.isMuted() && !bisu) { bisu = true; panggil('onBisuPaksa'); }
                panggil('onMain');
              } else if (e.data === S.PAUSED) {
                panggil('onJeda');
              } else if (e.data === S.BUFFERING) {
                tmrTersekat = setTimeout(function () {
                  panggil('onRalat', 'Siaran tersekat terlalu lama.', false);
                }, 20000);
              } else if (e.data === S.ENDED) {
                panggil('onTamat', langsung ? 'Siaran langsung telah tamat.' : 'Video telah tamat.');
              }
            },
            onError: function (e) {
              clearTimeout(tmrTersekat);
              panggil('onRalat', MESEJ_RALAT[e.data] || ('Ralat YouTube (kod ' + e.data + ').'), !!RALAT_KEKAL[e.data]);
            }
          }
        });
      }).catch(function (err) {
        panggil('onRalat', err.message, false);
      });
    }

    var kawalan = {
      langsung: langsung,
      main: function () { if (sedia) pemain.playVideo(); },
      jeda: function () { if (sedia) pemain.pauseVideo(); },
      togolMain: function () {
        if (!sedia) return;
        if (pemain.getPlayerState() === window.YT.PlayerState.PLAYING) pemain.pauseVideo();
        else pemain.playVideo();
      },
      bisu: function (ya) {
        bisu = ya !== false;
        if (sedia) { if (bisu) pemain.mute(); else pemain.unMute(); }
        return bisu;
      },
      togolBisu: function () { return kawalan.bisu(!bisu); },
      masa: function () { return sedia && pemain.getCurrentTime ? pemain.getCurrentTime() || 0 : 0; },
      tempoh: function () { return sedia && pemain.getDuration ? pemain.getDuration() || 0 : 0; },
      lompat: function (saat) { if (sedia) pemain.seekTo(Math.max(0, saat), true); },
      sedangMain: function () { return sedia && pemain.getPlayerState() === window.YT.PlayerState.PLAYING; },
      adakahBisu: function () { return bisu; },
      kelantangan: function (n) {
        if (!sedia) return;
        pemain.setVolume(Math.max(0, Math.min(100, n)));
        kawalan.bisu(n <= 0);
      },
      skrinPenuh: function (el) { return skrinPenuh(el || bekas); },
      musnah: function () {
        dimusnah = true;
        clearTimeout(tmrTersekat);
        try { if (pemain && pemain.destroy) pemain.destroy(); } catch (e) {}
        if (slot.parentNode) slot.parentNode.removeChild(slot);
        bekas.classList.remove('yt-penuh-css');
        pemain = null; sedia = false;
      }
    };
    return kawalan;
  }

  return {
    mainkan: mainkan,
    adakahYouTube: function (url) { return /youtube(-nocookie)?\.com|youtu\.be/.test(String(url || '')); },
    skrinPenuh: skrinPenuh
  };
})();
