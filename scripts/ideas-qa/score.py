#!/usr/bin/env python3
"""Score a page's content ("context") against George's verified facts, and optionally run Lighthouse.

Usage:
  python3 scripts/ideas-qa/score.py content <file.html> [<file.html> ...]
  python3 scripts/ideas-qa/score.py lighthouse <url> [<url> ...]

content: checks that every must-have fact appears (case-insensitive) and that no known-wrong claim appears.
lighthouse: runs the locally cached Lighthouse 12 (headless Chrome) and prints the four category scores.
Exit code 1 if any content check fails or any Lighthouse category is below 90.
"""
import html, json, re, subprocess, sys, tempfile, os

# (label, regex) — each must match the page's visible text or markup.
MUST = [
    ("name", r"George Michoulis"),
    ("greek name (JSON-LD)", r"Γεώργιος Μιχούλης"),
    ("Thessaloniki", r"Thessaloniki"),
    ("email", r"gmixoulis@gmail\.com"),
    ("ORCID", r"0000-0002-5139-448X"),
    ("Scholar link", r"scholar\.google\.com/citations\?user=nk0lq8YAAAAJ"),
    ("GitHub link", r"github\.com/gmixoulis"),
    ("LinkedIn link", r"linkedin\.com/in/george-michoulis"),
    ("Cyberscope role", r"Cyberscope"),
    ("Sidroco 2024–2026", r"Sidroco"),
    ("Derby / Mediterranean College", r"Mediterranean College"),
    ("University of Nicosia", r"Nicosia"),
    ("freelance WordPress", r"WordPress"),
    ("MKI Hellas volunteer", r"MKI Hellas"),
    ("MSc Data and Web Science", r"Data and Web Science"),
    ("MSc thesis drug-target", r"[Dd]rug.[Tt]arget"),
    ("BSc Applied Informatics", r"Applied Informatics"),
    ("DeepMind scholarship", r"DeepMind"),
    ("Infinitech 3rd place", r"Infinitech"),
    ("Basic Research 1st place", r"1st place[^<]{0,80}Basic Research|Basic Research[^<]{0,80}1st place"),
    ("DCOSS-IoT 2026 paper", r"DCOSS-IoT"),
    ("34-citation paper", r"\b34\b"),
    ("56 total citations", r"\b56\b"),
    ("English C2 / ECPE", r"C2|ECPE"),
    ("TOEIC 860", r"860"),
    ("soft skills section", r"[Ss]oft skills|How I work"),
    ("activities: theatre", r"[Tt]heatre|[Tt]heater"),
    ("activities: anime", r"[Aa]nime"),
    ("LinkedIn posts embed", r"widgets\.sociablekit\.com/linkedin-profile-posts/iframe/97069"),
    ("Play button → /play/", r"/play/"),
    ("Garden link → /garden/", r"/garden/"),
    ("JSON-LD", r"application/ld\+json"),
    ("Person @id", r"george-michoulis\.com/#person"),
    ("canonical", r'rel="canonical"'),
    ("og:image", r'property="og:image"'),
    ("CSP meta", r'http-equiv="Content-Security-Policy"'),
    ("draft noindex", r'name="robots" content="noindex'),
    ("dark+light", r"prefers-color-scheme"),
]
# (label, regex) — must NOT appear anywhere.
BANNED = [
    ("unverified fraud-detection thesis", r"fraud detection"),
    ("wrong degree name", r"Computer Science"),
    ("filename artefact", r"1Bachelor|1Master"),
    ("stale 32-citation count", r"\b32 citations\b"),
    ("current-job pill above name", r"New ·|New\s*&middot;"),
    ("clip-art activity images", r"img/gallery/"),
    ("unsafe-eval", r"unsafe-eval"),
]


def content(paths):
    ok_all = True
    for p in paths:
        src = open(p, encoding="utf-8").read()
        text = html.unescape(src)
        passed = [lbl for lbl, rx in MUST if re.search(rx, text)]
        missing = [lbl for lbl, rx in MUST if not re.search(rx, text)]
        # Banned claims are checked outside file paths (src/href/srcset hold real filenames like 1Bachelor-…jpg).
        claims = re.sub(r'(src|href|srcset|data-src)="[^"]*"', '', text)
        hits = [lbl for lbl, rx in BANNED if re.search(rx, claims)]
        score = round(100 * len(passed) / len(MUST))
        ok = not missing and not hits
        ok_all &= ok
        print(json.dumps({"file": p, "content_score": score, "must_passed": f"{len(passed)}/{len(MUST)}",
                          "missing": missing, "banned_found": hits, "ok": ok}, ensure_ascii=False))
    return ok_all


def lighthouse(urls):
    cli = os.path.expanduser("~/.npm/_npx/8003d8991b0d346b/node_modules/lighthouse/cli/index.js")
    chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    ok_all = True
    for u in urls:
        out = tempfile.mktemp(suffix=".json")
        subprocess.run(["node", cli, u, "--quiet", "--output=json", f"--output-path={out}",
                        "--only-categories=performance,accessibility,best-practices,seo",
                        "--chrome-flags=--headless=new --ignore-gpu-blocklist --use-angle=swiftshader --enable-unsafe-swiftshader"],
                       env={**os.environ, "CHROME_PATH": chrome}, check=False)
        r = json.load(open(out))
        scores = {k: round((v["score"] or 0) * 100) for k, v in r["categories"].items()}
        fails = [a["title"] for a in r["audits"].values() if a.get("score") == 0 and a.get("scoreDisplayMode") == "binary"][:12]
        ok = all(s >= 90 for s in scores.values())
        ok_all &= ok
        print(json.dumps({"url": u, **scores, "failed_audits": fails, "ok": ok}, ensure_ascii=False))
        os.remove(out)
    return ok_all


if __name__ == "__main__":
    if len(sys.argv) < 3 or sys.argv[1] not in ("content", "lighthouse"):
        print(__doc__); sys.exit(2)
    ok = content(sys.argv[2:]) if sys.argv[1] == "content" else lighthouse(sys.argv[2:])
    sys.exit(0 if ok else 1)
