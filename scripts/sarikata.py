"""DK TV: jana sari kata automatik (seperti auto-CC YouTube) untuk filem / episod baharu.

Dijalankan oleh GitHub Actions (.github/workflows/sarikata.yml):
  1. ffmpeg ambil audio video
  2. Whisper (faster-whisper) dengar audio -> sari kata bahasa asal
  3. NLLB terjemah -> Bahasa Melayu (dan bahasa lain dalam SARI_BAHASA)
  4. Simpan sub/<id>.<bahasa>.vtt + kemas kini sub/index.json, terus commit & push

Setiap video siap terus di-commit, jadi kalau masa habis, kerja yang sudah siap tidak hilang.
"""
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import time

SUB = 'sub'
INDEX = os.path.join(SUB, 'index.json')
SASARAN = [k.strip() for k in os.environ.get('SARI_BAHASA', 'ms,en').split(',') if k.strip()]
MODEL_WHISPER = os.environ.get('WHISPER_MODEL', 'small')
MODEL_TERJEMAH = 'facebook/nllb-200-distilled-600M'
HAD_SAAT = float(os.environ.get('HAD_JAM', '4.5')) * 3600   # jangan mula video baharu selepas had ini
MAKS_GAGAL = 3
MULA = time.time()

NAMA_BAHASA = {
    'ms': 'Melayu', 'en': 'English', 'id': 'Indonesia', 'zh': '中文', 'ja': '日本語',
    'ko': '한국어', 'th': 'ไทย', 'hi': 'हिन्दी', 'ta': 'தமிழ்', 'ar': 'العربية',
    'es': 'Español', 'fr': 'Français', 'de': 'Deutsch', 'tl': 'Filipino', 'vi': 'Tiếng Việt',
    'ru': 'Русский', 'pt': 'Português', 'it': 'Italiano', 'tr': 'Türkçe',
}
KOD_NLLB = {
    'ms': 'zsm_Latn', 'en': 'eng_Latn', 'id': 'ind_Latn', 'zh': 'zho_Hans', 'ja': 'jpn_Jpan',
    'ko': 'kor_Hang', 'th': 'tha_Thai', 'hi': 'hin_Deva', 'ta': 'tam_Taml', 'ar': 'arb_Arab',
    'es': 'spa_Latn', 'fr': 'fra_Latn', 'de': 'deu_Latn', 'tl': 'tgl_Latn', 'vi': 'vie_Latn',
    'ru': 'rus_Cyrl', 'pt': 'por_Latn', 'it': 'ita_Latn', 'tr': 'tur_Latn',
}


def log(*a):
    print('[sari kata]', *a, flush=True)


def baca_index():
    try:
        with open(INDEX, encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def tulis_index(idx):
    os.makedirs(SUB, exist_ok=True)
    with open(INDEX, 'w', encoding='utf-8') as f:
        json.dump(idx, f, ensure_ascii=False, indent=1)


def git(*arg, semak=True):
    return subprocess.run(['git', *arg], check=semak)


def simpan_git(mesej):
    git('add', SUB)
    if subprocess.run(['git', 'diff', '--cached', '--quiet']).returncode == 0:
        return
    git('commit', '-m', mesej)
    for cubaan in range(4):
        git('pull', '--rebase', '--autostash', semak=False)
        if subprocess.run(['git', 'push']).returncode == 0:
            return
        time.sleep(5 * (cubaan + 1))
    log('AMARAN: push gagal')


def masa_vtt(t):
    t = max(0.0, t)
    j = int(t // 3600)
    m = int(t % 3600 // 60)
    s = t % 60
    return f'{j:02d}:{m:02d}:{s:06.3f}'


def tulis_vtt(laluan, segmen):
    baris = ['WEBVTT', '']
    for n, (a, b, teks) in enumerate(segmen, 1):
        baris += [str(n), f'{masa_vtt(a)} --> {masa_vtt(b)}', teks, '']
    with open(laluan, 'w', encoding='utf-8') as f:
        f.write('\n'.join(baris))


def ambil_audio(url, wav):
    """ffmpeg sokong mp4 dan m3u8 terus dari URL."""
    subprocess.run([
        'ffmpeg', '-nostdin', '-loglevel', 'error', '-y',
        '-user_agent', 'Mozilla/5.0',
        '-i', url, '-vn', '-ac', '1', '-ar', '16000', '-f', 'wav', wav,
    ], check=True, timeout=3 * 3600)


_whisper = None


def dengar(wav):
    global _whisper
    from faster_whisper import WhisperModel
    if _whisper is None:
        log('memuat model Whisper', MODEL_WHISPER)
        _whisper = WhisperModel(MODEL_WHISPER, device='cpu', compute_type='int8')
    segmen, info = _whisper.transcribe(wav, vad_filter=True, beam_size=1)
    hasil = []
    for s in segmen:
        teks = s.text.strip()
        if teks:
            hasil.append((s.start, s.end, teks))
    return hasil, info.language


_terjemah = None


def terjemah(teks, dari, ke):
    global _terjemah
    import torch
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    if _terjemah is None:
        log('memuat model terjemahan', MODEL_TERJEMAH)
        tok = AutoTokenizer.from_pretrained(MODEL_TERJEMAH)
        mod = AutoModelForSeq2SeqLM.from_pretrained(MODEL_TERJEMAH)
        mod.eval()
        _terjemah = (tok, mod)
    tok, mod = _terjemah
    tok.src_lang = KOD_NLLB[dari]
    bos = tok.convert_tokens_to_ids(KOD_NLLB[ke])
    hasil = []
    with torch.inference_mode():
        for i in range(0, len(teks), 16):
            kumpulan = teks[i:i + 16]
            enc = tok(kumpulan, return_tensors='pt', padding=True, truncation=True, max_length=256)
            out = mod.generate(**enc, forced_bos_token_id=bos, max_new_tokens=256, num_beams=1)
            hasil += tok.batch_decode(out, skip_special_tokens=True)
    return hasil


def proses(url, nama, idx):
    vid = hashlib.sha1(url.encode('utf-8')).hexdigest()[:12]
    log('mula:', nama, '| id', vid)
    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, 'audio.wav')
        ambil_audio(url, wav)
        segmen, asal = dengar(wav)
    if not segmen:
        raise RuntimeError('tiada pertuturan dikesan')
    log('bahasa asal:', asal, '|', len(segmen), 'baris')

    os.makedirs(SUB, exist_ok=True)
    bahasa = []
    teks_asal = [t for _, _, t in segmen]
    for ke in SASARAN:
        if ke == asal:
            continue
        if asal not in KOD_NLLB or ke not in KOD_NLLB:
            log('langkau terjemahan', asal, '->', ke, '(bahasa tidak disokong)')
            continue
        log('terjemah', asal, '->', ke)
        hasil = terjemah(teks_asal, asal, ke)
        fail = f'{vid}.{ke}.vtt'
        tulis_vtt(os.path.join(SUB, fail), [(a, b, t) for (a, b, _), t in zip(segmen, hasil)])
        bahasa.append({'kod': ke, 'nama': NAMA_BAHASA.get(ke, ke), 'fail': fail, 'auto': True})

    fail = f'{vid}.{asal}.vtt'
    tulis_vtt(os.path.join(SUB, fail), segmen)
    bahasa.append({'kod': asal, 'nama': NAMA_BAHASA.get(asal, asal), 'fail': fail, 'auto': True})

    idx[url] = {'id': vid, 'nama': nama, 'bahasa': bahasa}
    tulis_index(idx)
    simpan_git(f'Sari kata auto: {nama}')
    log('siap:', nama)


def main():
    with open(sys.argv[1], encoding='utf-8') as f:
        senarai = json.load(f)
    git('config', 'user.name', 'DK TV Sari Kata')
    git('config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com')

    idx = baca_index()
    baki = [v for v in senarai
            if not idx.get(v['url'], {}).get('bahasa')
            and idx.get(v['url'], {}).get('gagal', 0) < MAKS_GAGAL]
    log(len(baki), 'video perlukan sari kata')

    for v in baki:
        if time.time() - MULA > HAD_SAAT:
            log('had masa dicapai; baki akan diproses pada larian seterusnya')
            break
        try:
            proses(v['url'], v['nama'], idx)
        except Exception as e:  # satu video gagal tidak menghentikan yang lain
            log('GAGAL:', v['nama'], '|', e)
            rekod = idx.get(v['url'], {})
            idx[v['url']] = {'nama': v['nama'], 'gagal': rekod.get('gagal', 0) + 1, 'ralat': str(e)[:200]}
            tulis_index(idx)
            simpan_git(f'Sari kata gagal: {v["nama"]}')


if __name__ == '__main__':
    main()
