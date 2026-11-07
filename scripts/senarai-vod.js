/* DK TV: baca channel.js dan senaraikan filem / episod (mp4, m3u8) yang perlukan sari kata.
   Video YouTube dilangkau (sudah ada CC YouTube). Siaran TV langsung dilangkau.
   Output: JSON [{ url, nama }] ke stdout. URL sama seperti yang digunakan index.html. */
var fs = require('fs'), vm = require('vm');

var kod = fs.readFileSync('channel.js', 'utf8');
var ctx = {
  console: console, setTimeout: setTimeout, clearTimeout: clearTimeout,
  AbortController: AbortController, encodeURIComponent: encodeURIComponent,
  Promise: Promise, Date: Date,
  fetch: function () { return Promise.reject(new Error('tiada fetch')); }
};
vm.createContext(ctx);
vm.runInContext(kod, ctx);

var YT = /youtube(-nocookie)?\.com|youtu\.be/;
var hasil = [], ada = {};
function tambah(url, nama, jenis) {
  if (!url || jenis === 'iframe' || YT.test(url) || ada[url]) return;
  ada[url] = true;
  hasil.push({ url: url, nama: nama });
}
(ctx.saluran || []).forEach(function (s) {
  if (!s.vod) return;
  if (s.episod) {
    s.episod.forEach(function (e, n) {
      tambah(e.url, s.nama + ' - ' + (e.tajuk || 'Episod ' + (n + 1)), e.jenis || s.jenis);
    });
  } else {
    tambah(s.url, s.nama, s.jenis);
  }
});
process.stdout.write(JSON.stringify(hasil, null, 2));
