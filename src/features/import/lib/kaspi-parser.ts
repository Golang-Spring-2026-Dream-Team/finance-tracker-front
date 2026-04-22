import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface ParsedTransaction {
  date: string;        // YYYY-MM-DD
  description: string;
  amount: string;      // positive decimal string e.g. "1300.00"
  type: "income" | "expense";
  rawType: string;     // Purchases / Transfers / Replenishment
  selected: boolean;
}

// DD.MM.YY → YYYY-MM-DD
function toIsoDate(raw: string): string {
  const [d, m, y] = raw.split(".");
  return `20${y}-${m}-${d}`;
}

// "1 300,00" → "1300.00"
function toDecimal(raw: string): string {
  return raw.replace(/\s/g, "").replace(",", ".");
}

function classifyType(
  kaspiType: string,
  sign: string,
): "income" | "expense" {
  if (sign === "+") return "income";
  return "expense";
}

async function extractText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;

  const lines: string[] = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();

    // Group items by rounded Y coordinate to reconstruct visual lines
    const byY = new Map<number, { x: number; text: string }[]>();
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const y = Math.round((item as { transform: number[] }).transform[5]);
      if (!byY.has(y)) byY.set(y, []);
      byY.get(y)!.push({
        x: (item as { transform: number[] }).transform[4],
        text: (item as { str: string }).str,
      });
    }

    // Sort lines top-to-bottom (descending Y in PDF coords)
    const sortedYs = [...byY.keys()].sort((a, b) => b - a);
    for (const y of sortedYs) {
      const parts = byY.get(y)!.sort((a, b) => a.x - b.x);
      lines.push(parts.map((p) => p.text).join(" "));
    }
  }

  return lines.join("\n");
}

// Matches: 22.04.26 - 1 300,00 ₸ Transfers Bakhodir Zafar ugli M.
// ₸ may appear as a separate token or adjacent; allow optional space and both ₸/Т/T
const TX_RE =
  /(\d{2}\.\d{2}\.\d{2})\s+([+-])\s*([\d\s]+,\d{2})\s*[₸ТT]\s+(Purchases|Transfers|Replenishment|Withdrawals|Others)\s+(.+)/;

export async function parseKaspiPdf(file: File): Promise<ParsedTransaction[]> {
  const text = await extractText(file);
  const results: ParsedTransaction[] = [];

  for (const line of text.split("\n")) {
    const m = TX_RE.exec(line.trim());
    if (!m) continue;
    const [, rawDate, sign, rawAmount, kaspiType, description] = m;
    results.push({
      date: toIsoDate(rawDate),
      description: description.trim(),
      amount: toDecimal(rawAmount),
      type: classifyType(kaspiType, sign),
      rawType: kaspiType,
      selected: true,
    });
  }

  return results;
}
