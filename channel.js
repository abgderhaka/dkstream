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
  { nama:'Awani', kat:'Berita', jenis:'iframe', logo:'logo/awani.png', url:'https://www.youtube.com/embed/mkVyNaGee8A?enablejsapi=1&autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0' },
  { nama:'Makkah Live', kat:'Antarabangsa', jenis:'m3u8', logo:'logo/makkah.png', url: PROKSI + 'https://quranes-edge.itworks.video/playlist.m3u8' },
  { nama:'Wild Earth', kat:'Antarabangsa', jenis:'m3u8', logo:'logo/wildearth.png', url: PROKSI + 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
];
var KATEGORI = ['Nasional','Berita','Hiburan','Sukan','Kanak-Kanak','Antarabangsa'];
/* =================================================== */
