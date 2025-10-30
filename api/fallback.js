import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'cadott-wrestling-attendance', 'public', 'index.html');
    const html = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Avoid caching fallback to always reflect latest deploy
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send(html);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load index.html', details: String(err) });
  }
}
