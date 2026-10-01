"""Cut one motif by pixel box. usage: ink-box.py <sheet> <out.png> x0 y0 x1 y1 [largest|all] [minalpha]"""
import sys, numpy as np
from PIL import Image, ImageFilter
from collections import deque
src, out = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = map(int, sys.argv[3:7]); mode = sys.argv[7] if len(sys.argv) > 7 else 'largest'
im = Image.open(src).convert('RGB').crop((x0, y0, x1, y1))
a = np.asarray(im).astype(np.int16)
alpha = np.clip((255 - a.min(axis=2)) * 1.15, 0, 255).astype(np.uint8); alpha[alpha < 18] = 0
if mode == 'largest':
    m = np.asarray(Image.fromarray((alpha > 90).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(9))) > 0
    H, W = m.shape; lab = np.zeros((H, W), np.int32); n = 0; sizes = {}
    for y in range(H):
        for x in range(W):
            if m[y, x] and not lab[y, x]:
                n += 1; q = deque([(y, x)]); lab[y, x] = n; c = 0
                while q:
                    cy, cx = q.popleft(); c += 1
                    for ny, nx in ((cy+1,cx),(cy-1,cx),(cy,cx+1),(cy,cx-1)):
                        if 0 <= ny < H and 0 <= nx < W and m[ny, nx] and not lab[ny, nx]:
                            lab[ny, nx] = n; q.append((ny, nx))
                sizes[n] = c
    best = max(sizes, key=sizes.get); alpha = np.where(lab == best, alpha, 0).astype(np.uint8)
rgba = Image.fromarray(np.dstack([a.astype(np.uint8), alpha]), 'RGBA')
rgba = rgba.crop(rgba.getbbox()); rgba.save(out); print(out, rgba.size)
