/* ================= SENARAI SALURAN =================
   Tambah saluran baru dengan menambah satu baris di sini.
   jenis : 'm3u8' atau 'iframe'
   kat   : Nasional / Berita / Hiburan / Sukan / Kanak-Kanak / Antarabangsa
   logo  : laluan fail dalam repo GitHub, atau pautan gambar penuh. Kosong = huruf awal.   */
var PROKSI = 'https://dktv-premium.zqstore80.workers.dev/';
var CF = 'https://d25tgymtnqzu8s.cloudfront.net/';

var saluran = [
  { nama:'TV1', kat:'Nasional', jenis:'m3u8', logo:'https://imgur.com/6KuWWMo.png', url: PROKSI + CF + 'main/A0jyR3/dl_1080p.m3u8' },
  { nama:'TV2', kat:'Nasional', jenis:'m3u8', logo:'https://i.imgur.com/1v2qGOd.png', url: PROKSI + CF + 'smil:tv2/chunklist_b2596000_slENG.m3u8?id=2' },
  { nama:'Awani', kat:'Berita', jenis:'iframe', logo:'https://imgur.com/RzNTkWo.png', url:'https://www.youtube.com/embed/mkVyNaGee8A?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' },
    { nama:'Makkah Live', kat:'Antarabangsa', jenis:'iframe', logo:'https://imgur.com/49Hodhz.png', url:'https://www.youtube.com/embed/D6UqW6TuY74?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' },
  { nama:'Wild Earth', kat:'Antarabangsa', jenis:'m3u8', logo:'https://imgur.com/V9FrnD4.png', url: PROKSI + 'https://wildearth-plex.amagi.tv/master.m3u8' },
    { nama:'Tom & Jerry', kat:'Kanak-Kanak', jenis:'iframe', logo:'https://imgur.com/k25OHIf.png', url:'https://www.youtube.com/embed/rEKifG2XUZg?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' },
   { nama:'Pops Anime', kat:'Kanak-Kanak', jenis:'iframe', logo:'https://imgur.com/7TU6z4o.png', url:'https://www.youtube.com/embed/o4iYsW2E6FY?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' }
];
var KATEGORI = ['Nasional','Berita','Hiburan','Sukan','Kanak-Kanak','Antarabangsa'];
/* =================================================== */
