#!/usr/bin/env python3
"""Rewrite the sha256 hashes in a page's CSP `script-src` so they match its inline <script> blocks.
Run after every edit to a page that uses a hash-based CSP meta tag.
Usage: python3 csp-hash.py <page.html> [--check]   (--check: exit 1 if the hashes are stale, change nothing)"""
import base64, hashlib, re, sys

path, check = sys.argv[1], '--check' in sys.argv
html = open(path, encoding='utf-8').read()
bodies = re.findall(r'<script(?![^>]*\ssrc=)[^>]*>(.*?)</script>', html, re.S)
hashes = ["'sha256-%s'" % base64.b64encode(hashlib.sha256(b.encode('utf-8')).digest()).decode() for b in bodies]

def fix(m):
    kept = [t for t in m.group(1).split() if not t.startswith("'sha256-")]
    return 'script-src ' + ' '.join(kept + hashes)

new, n = re.subn(r"script-src ([^;\"]*)", fix, html, count=1)
assert n == 1, 'no script-src directive found'
if check:
    print('ok' if new == html else 'STALE'); sys.exit(new != html)
open(path, 'w', encoding='utf-8').write(new)
print(len(hashes), 'inline scripts hashed:', *hashes, sep='\n  ')
