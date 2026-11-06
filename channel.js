/* ================= DK TV: SENARAI KANDUNGAN (4 BAHAGIAN) =================
   Dalam fail ini ada 4 senarai berasingan supaya mudah diurus:
   1. TV        : siaran TV langsung (m3u8, atau saluran bertoken dari malaysia-tv.net)
   2. YOUTUBE   : siaran langsung YouTube
   3. FILEM     : filem (mp4, m3u8 atau YouTube)
   4. SIRI      : siri dengan senarai episod
   Di laman web, TV dan YOUTUBE dipaparkan bersama dalam tab "Siaran TV" (TV dahulu, kemudian YouTube).

   Medan yang sama untuk semua:
     nama   : tajuk yang dipaparkan
     kat    : kategori (mesti ada dalam KATEGORI di bawah)
     logo   : pautan gambar (kosong = huruf awal)
     jenis  : 'm3u8' | 'mp4' | 'iframe'
     url    : pautan siaran / video
     via    : 'cf'     = awalan PROKSI + CF ditambah automatik
              'proksi' = awalan PROKSI sahaja
              (kosong) = guna pautan seperti ditulis
   Khas TV bertoken:
     dinamik:true, halaman:'nama-halaman'  (contoh 'okey' = malaysia-tv.net/okey/)
   Khas siri:
     episod:[ { tajuk:'Episod 1', url:'...' }, ... ]   (jenis dan via diwarisi daripada siri)

   Bantuan YouTube:  ytLive('ID') untuk siaran langsung,  ytVod('ID') untuk filem / siri.
   ID ialah bahagian selepas v= pada alamat YouTube.
   Saluran YouTube MESTI guna jenis:'iframe' supaya dikawal oleh yt-kawal.js.        */

var PROKSI = 'https://dktv-premium.zqstore80.workers.dev/';
var CF = 'https://d25tgymtnqzu8s.cloudfront.net/';
var TV3_API = 'https://tv3-token.zqstore80.workers.dev/';

function ytLive(id) { return 'https://www.youtube.com/embed/' + id + '?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0'; }
function ytVod(id)  { return 'https://www.youtube.com/embed/' + id + '?enablejsapi=1&autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&fs=1'; }

var BAHAGIAN = [
  { id:'tv',    nama:'Siaran TV', ikon:'📺' },
  { id:'filem', nama:'Filem',     ikon:'🎬' },
  { id:'siri',  nama:'Siri',      ikon:'🍿' }
];

/* ---------- 1. SIARAN TV ---------- */
var TV = [
  /* TV1: guna token terkini dari Worker; jika Worker gagal, guna pautan tetap (cadangan) */
  { nama:'TV1', kat:'Nasional', jenis:'m3u8', dinamik:true, halaman:'rtm-tv1-live', via:'cf', logo:'https://i.imgur.com/6KuWWMo.png', url:'main/A0jyR3/dl_1080p.m3u8' },
  { nama:'TV2', kat:'Nasional', jenis:'m3u8', via:'cf', logo:'https://i.imgur.com/1v2qGOd.png', url:'smil:tv2/chunklist_b2596000_slENG.m3u8?id=2' },
  { nama:'TV3', kat:'Nasional', jenis:'m3u8', dinamik:true, halaman:'tv3-live', logo:'https://i.imgur.com/pBcJNjT.png', url:'' },
  { nama:'TV OKEY', kat:'Nasional', jenis:'m3u8', dinamik:true, halaman:'okey', logo:'https://i.imgur.com/Byx4EaX.png', url:'' },
  { nama:'TV9', kat:'Nasional', jenis:'m3u8', dinamik:true, halaman:'tv9-malaysia', logo:'https://i.imgur.com/AixrZaH.png', url:'' },
  { nama:'DIDIK TV', kat:'Nasional', jenis:'m3u8', dinamik:true, halaman:'didik-tv-live', logo:'https://imgur.com/rhEtQlu.png', url:'' },
  { nama:'Wild Earth', kat:'Antarabangsa', jenis:'m3u8', via:'proksi', logo:'https://i.imgur.com/V9FrnD4.png', url:'https://wildearth-plex.amagi.tv/master.m3u8' }
];

/* ---------- 2. YOUTUBE LIVE ---------- */
var YOUTUBE = [
  { nama:'Awani', kat:'Berita', jenis:'iframe', logo:'https://i.imgur.com/RzNTkWo.png', url:ytLive('mkVyNaGee8A') },
  { nama:'Makkah Live', kat:'Antarabangsa', jenis:'iframe', logo:'https://i.imgur.com/49Hodhz.png', url:ytLive('D6UqW6TuY74') },
  { nama:'Tom & Jerry', kat:'Kanak-Kanak', jenis:'iframe', logo:'https://i.imgur.com/k25OHIf.png', url:ytLive('rEKifG2XUZg') },
  { nama:'Pops Anime', kat:'Kanak-Kanak', jenis:'iframe', logo:'https://i.imgur.com/7TU6z4o.png', url:ytLive('o4iYsW2E6FY') },
  { nama:'Marvel HQ', kat:'Kanak-Kanak', jenis:'iframe', logo:'https://i.imgur.com/F04jnsF.png', url:ytLive('YbQwgoMoztA') },
  { nama:'Warner Bros Entertainment', kat:'Wayang', jenis:'iframe', logo:'https://i.imgur.com/aszsClS.png', url:ytLive('G43NInZfoPE') }
];

/* ---------- 3. FILEM ----------
   Contoh di bawah ialah filem terbuka Blender untuk menguji pemain. Padam dan ganti dengan filem anda.
   Contoh lain:
   { nama:'Tajuk', kat:'Aksi', jenis:'m3u8', via:'proksi', logo:'', url:'https://contoh.com/filem/master.m3u8' },
   { nama:'Tajuk', kat:'Komedi', jenis:'iframe', logo:'', url:ytVod('ID_VIDEO') },                          */
var FILEM = [
  { nama:'Big Buck Bunny (contoh)', kat:'Animasi', jenis:'mp4', logo:'', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }
];

/* ---------- 4. SIRI ----------
   Setiap siri ada senarai episod. Pemain memaparkan butang episod di bawah video. */
var SIRI = [
  { nama:'Siri Contoh', kat:'Animasi', jenis:'mp4', logo:'', episod:[
      { tajuk:'Episod 1', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      { tajuk:'Episod 2', url:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' }
  ] }
];

/* ---------- Gabung semua bahagian (jangan ubah bahagian di bawah) ---------- */
var saluran = [];
function daftar(bhg, senarai) {
  senarai.forEach(function (s) { s.bahagian = bhg; s.vod = (bhg === 'filem' || bhg === 'siri'); saluran.push(s); });
}
daftar('tv', TV); daftar('tv', YOUTUBE);   /* YouTube Live dipaparkan dalam tab Siaran TV */
daftar('filem', FILEM); daftar('siri', SIRI);

function awalan(o, via) {
  if (!o.url) return;
  if (via === 'cf') o.url = PROKSI + CF + o.url;
  else if (via === 'proksi') o.url = PROKSI + o.url;
}
saluran.forEach(function (s) {
  awalan(s, s.via);
  (s.episod || []).forEach(function (e) { awalan(e, e.via || s.via); });
});

/* Pulangkan URL sebenar untuk dimainkan (Promise).
   Saluran biasa: terus pulangkan s.url.
   Saluran dinamik (TV bertoken): minta token baharu daripada Worker, kemudian lalukan melalui PROKSI. */
function ambilUrl(s) {
  if (!s.dinamik) return Promise.resolve(s.url);
  var kawal = new AbortController();
  var tmr = setTimeout(function () { kawal.abort(); }, 10000);   /* jangan tunggu lebih 10 saat */
  return fetch(TV3_API + '?ch=' + encodeURIComponent(s.halaman || 'tv3-live') + '&t=' + Date.now(), { cache: 'no-store', signal: kawal.signal })
    .then(function (r) {
      clearTimeout(tmr);
      if (!r.ok) throw new Error('Worker TV3 membalas ' + r.status);
      return r.json();
    })
    .then(function (j) {
      if (!j.url) throw new Error('Token tidak dijumpai');
      return PROKSI + j.url;
    })
    .catch(function (e) {
      clearTimeout(tmr);
      if (s.url) return s.url;   /* ada pautan cadangan (contoh TV1): guna itu */
      throw e;
    });
}

var KATEGORI = ['Nasional','Berita','Hiburan','Sukan','Kanak-Kanak','Antarabangsa','Wayang','Animasi','Aksi','Komedi','Drama','Seram','Dokumentari'];
/* =================================================== */
