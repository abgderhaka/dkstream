
/* ================= DK TV: SENARAI KANDUNGAN ================= */

var PROKSI = 'https://dktv-premium.zqstore80.workers.dev/';
var CF = 'https://d25tgymtnqzu8s.cloudfront.net/';
var TV3_API = 'https://tv3-token.zqstore80.workers.dev/';

/* YouTube Live - kekalkan kawalan tersembunyi */
function ytLive(id) {
  return 'https://www.youtube.com/embed/' + id +
    '?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0';
}

/* YouTube Filem / Siri - kawalan dihidupkan */
function ytVod(id) {
  return 'https://www.youtube.com/embed/' + id +
    '?enablejsapi=1&autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=0&fs=0';
}

var BAHAGIAN = [
  { id:'tv', nama:'Siaran TV', ikon:'📺' },
  { id:'filem', nama:'Filem', ikon:'🎬' },
  { id:'siri', nama:'Siri', ikon:'🍿' }
];

/* ---------- 1. SIARAN TV ---------- */

var TV = [
  { nama:'TV1', kat:'Nasional', jenis:'m3u8', dinamik:true, halaman:'rtm-tv1-live', via:'cf', logo:'https://i.imgur.com/6KuWWMo.png', url:'main/A0jyR3/dl_1080p.m3u8' },

  { nama:'TV2', kat:'Nasional', jenis:'m3u8', dinamik:true, halaman:'tv2-live', logo:'https://i.imgur.com/1v2qGOd.png', url:'' },

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

  { nama:'Warner Bros Entertainment', kat:'Wayang', jenis:'iframe', logo:'https://i.imgur.com/aszsClS.png', url:ytLive('2FXrRwMF9LE') }
];

/* ---------- 3. FILEM ---------- */

var FILEM = [
  {
    nama:'THE OLD BODYGUARD',
    kat:'DK-ENGLISH',
    jenis:'iframe',
    logo:'https://imgur.com/bR3jsB6.jpg',
    url:ytVod('_Tu_SAqNinU')
  },

  {
    nama:'BABY DRIVER',
    kat:'DK-ENGLISH',
    jenis:'mp4',
    logo:'https://vvww.ohflix.my.id/uploads/video_thumb/18244.jpg',
    url:'https://www.dropbox.com/scl/fo/3qfhjc3i8wvsyemgdqpzw/AI3akp1OSixM8f8amxw061U/Baby%20Driver%202017-1-720.mp4?rlkey=ceuo8qya5rigckhloq5qwmnw5&raw=1'
  }
];

/* ---------- 4. SIRI ---------- */

var SIRI = [
  {
    nama:'GERAK KHAS 2.0',
    kat:'DK-MALAY',
    jenis:'mp4',
    logo:'https://vvww.ohflix.my.id/uploads/video_thumb/25407.jpg',
    episod:[
      {
        tajuk:'Episod 1',
        url:'https://ohflix3.s3.us-east-005.backblazeb2.com/Random+Drama+Malay40/Gerak+Khas+2.0/Gerak+Khas+2.0+EP01.mp4'
      },
      {
        tajuk:'Episod 2',
        url:'https://ohflix3.s3.us-east-005.backblazeb2.com/Random+Drama+Malay40/Gerak+Khas+2.0/Gerak+Khas+2.0+EP02.mp4'
      }
    ]
  }
];

/* ---------- GABUNG SEMUA BAHAGIAN ---------- */

var saluran = [];

function daftar(bhg, senarai) {
  senarai.forEach(function (s) {
    s.bahagian = bhg;
    s.vod = (bhg === 'filem' || bhg === 'siri');
    saluran.push(s);
  });
}

daftar('tv', TV);
daftar('tv', YOUTUBE);
daftar('filem', FILEM);
daftar('siri', SIRI);

function awalan(o, via) {
  if (!o.url) return;

  if (via === 'cf') {
    o.url = PROKSI + CF + o.url;
  } else if (via === 'proksi') {
    o.url = PROKSI + o.url;
  }
}

saluran.forEach(function (s) {
  awalan(s, s.via);

  (s.episod || []).forEach(function (e) {
    awalan(e, e.via || s.via);
  });
});

/* ---------- URL SIARAN DINAMIK ---------- */

function ambilUrl(s) {
  if (!s.dinamik) {
    return Promise.resolve(s.url);
  }

  var kawal = new AbortController();

  var tmr = setTimeout(function () {
    kawal.abort();
  }, 10000);

  return fetch(
    TV3_API + '?ch=' +
    encodeURIComponent(s.halaman || 'tv3-live') +
    '&t=' + Date.now(),
    {
      cache: 'no-store',
      signal: kawal.signal
    }
  )
  .then(function (r) {
    clearTimeout(tmr);

    if (!r.ok) {
      throw new Error('Worker TV3 membalas ' + r.status);
    }

    return r.json();
  })
  .then(function (j) {
    if (!j.url) {
      throw new Error('Token tidak dijumpai');
    }

    return PROKSI + j.url;
  })
  .catch(function (e) {
    clearTimeout(tmr);

    if (s.url) {
      return s.url;
    }

    throw e;
  });
}

/* ---------- KATEGORI ---------- */

var KATEGORI = [
  'Nasional',
  'Berita',
  'Hiburan',
  'Sukan',
  'Kanak-Kanak',
  'Antarabangsa',
  'Wayang',
  'Animasi',
  'Aksi',
  'Komedi',
  'Drama',
  'Seram',
  'Dokumentari',
  'DK-ENGLISH',
  'DK-MALAY'
];

/* =================================================== */
