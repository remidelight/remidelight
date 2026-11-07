// Lists essays whose publish date is still in the future, for the "Coming up" section.
import fs from "node:fs";
import path from "node:path";

const dir = "src/posts";

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"');
  }
  return data;
}

export default function () {
  const now = Date.now();
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => frontMatter(fs.readFileSync(path.join(dir, f), "utf-8")))
    .filter((d) => d.title && d.date && new Date(d.date).getTime() > now)
    .map((d) => {
      const when = new Date(d.date);
      const day = when.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "Africa/Lagos" });
      const time = when.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Africa/Lagos" });
      return { title: d.title, category: d.category || "", sort: when.getTime(), when: `${day} · ${time} (Lagos)` };
    })
    .sort((a, b) => a.sort - b.sort);
}
