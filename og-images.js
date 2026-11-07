// Builds a 1200x630 share image (link preview) for each essay and one default image.
import fs from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const font = (p) => fs.readFile(path.join("node_modules", p));

const COLORS = { ink: "#17302A", ground: "#F6F5F0", accent: "#E8A33D", soft: "#B9C6C1" };

const h = (type, style, children) => ({ type, props: { style, children } });

function card({ eyebrow, title, author, domain, logo }) {
  const size = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;
  return h(
    "div",
    {
      width: "1040px", height: "486px", display: "flex", flexDirection: "column", justifyContent: "space-between",
      backgroundColor: COLORS.ink, color: COLORS.ground, padding: "72px 80px", fontFamily: "Sora",
    },
    [
      h("div", { display: "flex", alignItems: "center", gap: "18px" }, [
        h("div", { width: "18px", height: "18px", borderRadius: "9px", backgroundColor: COLORS.accent }, []),
        h("div", { fontSize: "26px", fontWeight: 600, letterSpacing: "4px", color: COLORS.accent, textTransform: "uppercase" }, eyebrow),
      ]),
      h("div", { display: "flex", fontSize: `${size}px`, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-1px", maxWidth: "1000px" }, title),
      h("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
        h("div", { display: "flex", alignItems: "center", gap: "18px" }, [
          { type: "img", props: { src: logo, width: 72, height: 72, style: { borderRadius: "14px" } } },
          h("div", { fontSize: "30px", fontWeight: 600 }, author),
        ]),
        h("div", { fontSize: "26px", color: COLORS.soft, fontFamily: "Source Serif" }, domain),
      ]),
    ]
  );
}

export async function buildOgImages({ outputDir, posts, site }) {
  const fonts = [
    { name: "Sora", data: await font("@fontsource/sora/files/sora-latin-600-normal.woff"), weight: 600, style: "normal" },
    { name: "Sora", data: await font("@fontsource/sora/files/sora-latin-700-normal.woff"), weight: 700, style: "normal" },
    { name: "Source Serif", data: await font("@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff"), weight: 400, style: "normal" },
  ];
  const domain = site.url.replace(/^https?:\/\//, "");
  const tile = await fs.readFile("src/img/logo-tile.svg", "utf-8");
  const logoPng = new Resvg(tile, { fitTo: { mode: "width", value: 144 } }).render().asPng();
  const logo = "data:image/png;base64," + Buffer.from(logoPng).toString("base64");
  const dir = path.join(outputDir, "og");
  await fs.mkdir(dir, { recursive: true });

  const jobs = [
    { file: "default.png", eyebrow: "Essays", title: site.tagline || site.title },
    ...posts.map((p) => ({ file: `${p.slug}.png`, eyebrow: p.category ? `Essay · ${p.category}` : "Essay", title: p.title })),
  ];

  for (const job of jobs) {
    const svg = await satori(
      card({ eyebrow: job.eyebrow, title: job.title, author: site.author, domain, logo }),
      { width: 1200, height: 630, fonts }
    );
    const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
    await fs.writeFile(path.join(dir, job.file), png);
  }
}
