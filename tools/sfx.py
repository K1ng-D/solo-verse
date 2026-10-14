import numpy as np, wave
SR = 22050

def save(path, y):
    y = np.clip(y, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y * 32000).astype('<i2').tobytes())

def t_(d): return np.linspace(0, d, int(SR * d), endpoint=False)

def metal(freq, dur, partials=((1, 1.0, 1.0), (2.76, 0.5, 0.7), (5.4, 0.25, 0.45), (8.9, 0.1, 0.3)), decay=3.0):
    t = t_(dur); y = np.zeros_like(t)
    for ratio, amp, dec in partials:
        y += amp * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t * decay * dec)
    att = np.minimum(1, t / 0.004)
    return y * att * 0.45

def tone(freq, dur, kind='sine', decay=6.0, vol=0.5):
    t = t_(dur)
    if kind == 'square': w = np.sign(np.sin(2 * np.pi * freq * t)) * 0.5
    elif kind == 'saw': w = 2 * ((freq * t) % 1) - 1
    else: w = np.sin(2 * np.pi * freq * t)
    return w * np.exp(-t * decay) * vol * np.minimum(1, t / 0.003)

def seq(parts, gap=0.0):
    out = []
    for p in parts: out.append(p); 
    return np.concatenate(out)

def build(outdir):
    base = 293.66; r = 2 ** (240 / 1200)
    notes = [base * r ** i for i in range(5)]
    for i, f in enumerate(notes):
        save(f'{outdir}/note{i+1}.wav', metal(f, 0.9, decay=3.5))
    save(f'{outdir}/gong.wav', metal(98, 2.2, ((1, 1, 0.5), (1.5, 0.6, 0.5), (2.2, 0.4, 0.8), (3.1, 0.2, 1.1)), decay=1.4))
    save(f'{outdir}/tap.wav', tone(880, 0.06, 'sine', 40, 0.4))
    save(f'{outdir}/correct.wav', seq([tone(f, 0.11, 'sine', 8) for f in (523, 659, 784)]) )
    save(f'{outdir}/wrong.wav', seq([tone(220, 0.14, 'saw', 6, 0.35), tone(165, 0.22, 'saw', 6, 0.35)]))
    save(f'{outdir}/collect.wav', seq([tone(f, 0.07, 'sine', 14) for f in (988, 1319, 1760)]))
    save(f'{outdir}/hurt.wav', tone(140, 0.25, 'saw', 9, 0.45) + 0.15 * np.random.RandomState(1).randn(int(SR * 0.25)) * np.exp(-t_(0.25) * 20))
    save(f'{outdir}/hit.wav', tone(320, 0.2, 'square', 12, 0.35) + tone(640, 0.2, 'sine', 14, 0.3))
    save(f'{outdir}/win.wav', seq([tone(f, 0.16, 'sine', 5) for f in (523, 659, 784, 1047)] + [tone(1047, 0.5, 'sine', 3)]))
    save(f'{outdir}/levelup.wav', seq([tone(f, 0.09, 'square', 9, 0.25) for f in (392, 523, 659, 784, 1047)] + [tone(1319, 0.4, 'sine', 3)]))
    save(f'{outdir}/door.wav', seq([tone(200, 0.12, 'sine', 12, 0.5), tone(150, 0.2, 'sine', 8, 0.4)]))
    save(f'{outdir}/start.wav', seq([tone(f, 0.12, 'sine', 6) for f in (392, 587, 784)]))

if __name__ == '__main__':
    import sys; build(sys.argv[1])
