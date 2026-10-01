"""Cut a white-background sumi sheet into transparent PNG parts.
usage: python3 scripts/ink-cut.py <sheet> <prefix> [--gap N] [--min N]
Alpha = darkness / saturation from white; components grouped after dilating by --gap px.
"""
import sys, numpy as np
from PIL import Image, ImageFilter, ImageDraw
from collections import deque

src, prefix = sys.argv[1], sys.argv[2]
args = dict(zip(sys.argv[3::2], sys.argv[4::2]))
GAP = int(args.get('--gap', 14)); MIN = int(args.get('--min', 1200))

im = Image.open(src).convert('RGB')
a = np.asarray(im).astype(np.int16)
# distance from white: max channel deficit + saturation (keeps vermilion opaque)
deficit = 255 - a.min(axis=2)
alpha = np.clip(deficit * 1.15, 0, 255).astype(np.uint8)
alpha[alpha < 18] = 0  # kill paper noise / faint watermark
rgba = np.dstack([a.astype(np.uint8), alpha])
out = Image.fromarray(rgba, 'RGBA')

# component mask with dilation so spatter joins its stroke
mask = Image.fromarray((alpha > 90).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(GAP * 2 + 1))
m = np.asarray(mask) > 0
H, W = m.shape
lab = np.zeros((H, W), np.int32); n = 0; boxes = []
for y in range(H):
    for x in range(W):
        if m[y, x] and not lab[y, x]:
            n += 1; q = deque([(y, x)]); lab[y, x] = n
            x0 = x1 = x; y0 = y1 = y; cnt = 0
            while q:
                cy, cx = q.popleft(); cnt += 1
                x0 = min(x0, cx); x1 = max(x1, cx); y0 = min(y0, cy); y1 = max(y1, cy)
                for ny, nx in ((cy+1,cx),(cy-1,cx),(cy,cx+1),(cy,cx-1)):
                    if 0 <= ny < H and 0 <= nx < W and m[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = n; q.append((ny, nx))
            boxes.append((n, x0, y0, x1, y1, cnt))

parts = []
for n, x0, y0, x1, y1, cnt in boxes:
    if cnt < MIN: continue
    crop = out.crop((x0, y0, x1 + 1, y1 + 1))
    # keep only this component's pixels
    sub = (lab[y0:y1+1, x0:x1+1] == n)
    ca = np.asarray(crop).copy(); ca[..., 3] = np.where(sub, ca[..., 3], 0)
    crop = Image.fromarray(ca, 'RGBA')
    bb = crop.getbbox()
    if not bb: continue
    crop = crop.crop(bb)
    i = len(parts); name = f'{prefix}-{i:02d}.png'
    crop.save(f'public/img/ink/parts/{name}')
    parts.append((name, crop))

# contact sheet with indices
cols = 6; cell = 180; rows = (len(parts) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cell, rows * cell), 'white'); d = ImageDraw.Draw(sheet)
for i, (name, crop) in enumerate(parts):
    t = crop.copy(); t.thumbnail((cell - 20, cell - 30))
    x = (i % cols) * cell + 10; y = (i // cols) * cell + 10
    sheet.paste(t, (x, y), t); d.text((x, y + cell - 26), name, fill='red')
sheet.save(f'public/img/ink/parts/_{prefix}-sheet.png')
print(len(parts), 'parts')
