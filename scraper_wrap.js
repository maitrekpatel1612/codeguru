import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input HTML saved locally
const HTML_FILE = path.join(__dirname, 'Practice Problems _ Code With Aryan _ codeWithAryan.html');
// Output JSON
const OUTPUT_FILE = path.join(__dirname, 'questions_by_difficulty.json');

const html = fs.readFileSync(HTML_FILE, 'utf8');

// Extract all questions by difficulty
function extractAllByDifficulty() {
  const rowsRe = /<tr[\s\S]*?>[\s\S]*?<\/tr>/gi;
  const result = { easy: [], medium: [], hard: [] };

  let m;
  while ((m = rowsRe.exec(html)) !== null) {
    const row = m[0];

    // Only consider rows with a problem cell
    if (!/class="[^"]*truncate[^"]*"/i.test(row)) continue;

    // Title
    const titleMatch = /<td[^>]*class="[^"]*truncate[^"]*"[^>]*>[\s\S]*?<span[^>]*class="[^"]*mr-2[^"]*"[^>]*>([\s\S]*?)<\/span>/i.exec(row);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : null;

    // Link
    const hrefMatch = /href="([^"]*\/questions\/[^"]*)"/i.exec(row);
    let link = hrefMatch ? hrefMatch[1] : null;

    // Format link to LeetCode domain
    if (link) {
      link = link.replace('https://codewitharyan.com/questions/', 'https://leetcode.com/problems/');
    }

    // Difficulty
    const diffMatch = />\s*(Easy|Medium|Hard)\s*<\/div>/i.exec(row);
    const diff = diffMatch ? diffMatch[1].toLowerCase() : null;

    if (title && link && (diff === 'easy' || diff === 'medium' || diff === 'hard')) {
      result[diff].push({ title, link });
    }
  }
  return result;
}

const result = extractAllByDifficulty();

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
console.log('Wrote', OUTPUT_FILE);
