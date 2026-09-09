# الخطوط المحلية — Local fonts

The style guide (الأسلوب الثاني) specifies:

| Role | Font | File expected here |
| --- | --- | --- |
| العناوين الرئيسية (display) | **Lifta Swash** | `LiftaSwash.woff2` (or `LiftaSwash.ttf`) |
| العناوين الفرعية والإبراز | **Al Qabas** | `AlQabas-Bold.woff2` / `AlQabas-Regular.woff2` (or `.ttf`) |
| المتن والبيانات | **Cairo** | loaded automatically from Google Fonts via `next/font` |

Drop the licensed font files into this folder using the file names above.
The `@font-face` rules live in `src/app/globals.css`. Until the files are present,
the site silently falls back to Google Fonts (Noto Kufi Arabic for Lifta, Noto Sans Arabic for Al Qabas),
so nothing breaks — the browser will only log a 404 for the missing font files.

If your files have different names, edit the `src:` URLs in `src/app/globals.css`.
