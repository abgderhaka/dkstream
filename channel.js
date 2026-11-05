/* ================= SENARAI SALURAN =================
   Tambah saluran baru dengan menambah satu baris di sini.
   jenis : 'm3u8' atau 'iframe'
   via   : 'cf'     = awalan PROKSI + CF ditambah automatik (tulis URL pendek sahaja)
           'proksi' = awalan PROKSI sahaja ditambah automatik
           (kosong) = URL digunakan seperti yang ditulis
   kat   : Nasional / Berita / Hiburan / Sukan / Kanak-Kanak / Antarabangsa / Wayang
   logo  : laluan fail dalam repo GitHub, atau pautan gambar penuh. Kosong = huruf awal.   */
var PROKSI = 'https://dktv-premium.zqstore80.workers.dev/';
var CF = 'https://d25tgymtnqzu8s.cloudfront.net/';

var saluran = [
  { nama:'TV1', kat:'Nasional', jenis:'m3u8', via:'cf', logo:'https://i.imgur.com/6KuWWMo.png', url:'main/A0jyR3/dl_1080p.m3u8' },
  { nama:'TV2', kat:'Nasional', jenis:'m3u8', via:'cf', logo:'https://i.imgur.com/1v2qGOd.png', url:'smil:tv2/chunklist_b2596000_slENG.m3u8?id=2' },

  /* TV3: halaman web, bukan stream m3u8. Jika tidak boleh dipaparkan dalam iframe,
     buang baris ini atau guna sumber m3u8 lain. */
  { nama:'TV3', kat:'Nasional', jenis:'m3u8', via:'proksi', logo:'https://i.imgur.com/pBcJNjT.png', url:'https://2bfd741e.b-cdn.net/streamer/6zRGXhNeg6eCQHs8DgaZt3fjRDsA86kjs8mp9ptqVtit.m3u8?expires=1793878560&token=68kieISa5uLq1zNABd9UlOrwkChIYK85g37hw_pGEew' },

  { nama:'TV OKEY', kat:'Nasional', jenis:'m3u8', via:'cf', logo:'https://i.imgur.com/Byx4EaX.png', url:'smil:tv6/chunklist_b2596000_slENG.m3u8?id=6' },

  { nama:'Awani', kat:'Berita', jenis:'iframe', logo:'https://i.imgur.com/RzNTkWo.png', url:'https://www.youtube.com/embed/mkVyNaGee8A?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' },
  { nama:'Makkah Live', kat:'Antarabangsa', jenis:'iframe', logo:'https://i.imgur.com/49Hodhz.png', url:'https://www.youtube.com/embed/D6UqW6TuY74?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' },
  { nama:'Wild Earth', kat:'Antarabangsa', jenis:'m3u8', via:'proksi', logo:'https://i.imgur.com/V9FrnD4.png', url:'https://wildearth-plex.amagi.tv/master.m3u8' },
  { nama:'Tom & Jerry', kat:'Kanak-Kanak', jenis:'iframe', logo:'https://i.imgur.com/k25OHIf.png', url:'https://www.youtube.com/embed/rEKifG2XUZg?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' },
  { nama:'Pops Anime', kat:'Kanak-Kanak', jenis:'iframe', logo:'https://i.imgur.com/7TU6z4o.png', url:'https://www.youtube.com/embed/o4iYsW2E6FY?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' },
  { nama:'Marvel HQ', kat:'Kanak-Kanak', jenis:'iframe', logo:'https://i.imgur.com/F04jnsF.png', url:'https://www.youtube.com/embed/YbQwgoMoztA?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' },
  { nama:'Warner Bros Entertainment', kat:'Wayang', jenis:'iframe', logo:'https://i.imgur.com/aszsClS.png', url:'https://www.youtube.com/embed/G43NInZfoPE?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' }
];

/* Sambung awalan proksi secara automatik ikut medan 'via'.
   Jangan padam bahagian ini. */
saluran.forEach(function (s) {
  if (s.via === 'cf') s.url = PROKSI + CF + s.url;
  else if (s.via === 'proksi') s.url = PROKSI + s.url;
});

var KATEGORI = ['Nasional','Berita','Hiburan','Sukan','Kanak-Kanak','Antarabangsa','Wayang'];
/* =================================================== */
