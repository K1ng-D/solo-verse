"""Mini toolkit pixel-art: gambar di kanvas native kecil, lalu upscale nearest."""
from PIL import Image
import random

def hexc(h, a=255):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

def shade(c, f):
    r, g, b, a = c
    if f >= 0:
        return (int(r + (255 - r) * f), int(g + (255 - g) * f), int(b + (255 - b) * f), a)
    f = -f
    return (int(r * (1 - f)), int(g * (1 - f)), int(b * (1 - f)), a)

class Canvas:
    def __init__(self, w, h, bg=None):
        self.w, self.h = w, h
        self.im = Image.new('RGBA', (w, h), bg or (0, 0, 0, 0))
        self.p = self.im.load()

    def px(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h and c is not None:
            if c[3] == 255:
                self.p[x, y] = c
            else:
                o = self.p[x, y]
                a = c[3] / 255.0
                self.p[x, y] = (int(o[0] * (1 - a) + c[0] * a), int(o[1] * (1 - a) + c[1] * a), int(o[2] * (1 - a) + c[2] * a), max(o[3], c[3]))

    def get(self, x, y):
        if 0 <= x < self.w and 0 <= y < self.h:
            return self.p[x, y]
        return (0, 0, 0, 0)

    def rect(self, x, y, w, h, c):
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                self.px(xx, yy, c)

    def hline(self, x, y, w, c):
        self.rect(x, y, w, 1, c)

    def vline(self, x, y, h, c):
        self.rect(x, y, 1, h, c)

    def frame(self, x, y, w, h, c):
        self.hline(x, y, w, c); self.hline(x, y + h - 1, w, c)
        self.vline(x, y, h, c); self.vline(x + w - 1, y, h, c)

    def line(self, x0, y0, x1, y1, c):
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx + dy
        while True:
            self.px(x0, y0, c)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy; x0 += sx
            if e2 <= dx:
                err += dx; y0 += sy

    def ellipse(self, cx, cy, rx, ry, c):
        for y in range(int(cy - ry), int(cy + ry) + 1):
            for x in range(int(cx - rx), int(cx + rx) + 1):
                if rx == 0 or ry == 0:
                    continue
                if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.0:
                    self.px(x, y, c)

    def paste(self, other, x, y):
        for yy in range(other.h):
            for xx in range(other.w):
                c = other.p[xx, yy]
                if c[3] > 0:
                    self.px(x + xx, y + yy, c)

    def outline(self, col):
        src = self.im.copy().load()
        for y in range(self.h):
            for x in range(self.w):
                if src[x, y][3] == 0:
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < self.w and 0 <= ny < self.h and src[nx, ny][3] > 0:
                            self.p[x, y] = col
                            break

    def flip(self):
        self.im = self.im.transpose(Image.FLIP_LEFT_RIGHT)
        self.p = self.im.load()
        return self

    def save(self, path, scale=3):
        im = self.im.resize((self.w * scale, self.h * scale), Image.NEAREST) if scale != 1 else self.im
        im.save(path)

def noise_fill(cv, x, y, w, h, base, alt, density, rng):
    cv.rect(x, y, w, h, base)
    for yy in range(y, y + h):
        for xx in range(x, x + w):
            if rng.random() < density:
                cv.px(xx, yy, alt)
