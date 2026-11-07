import fs from "node:fs";
import { buildOgImages } from "./og-images.js";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // All essays live in src/posts, newest first
  let postsForImages = [];
  eleventyConfig.addCollection("posts", (api) => {
    const posts = api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date);
    postsForImages = posts.map((p) => ({ slug: p.fileSlug, title: p.data.title, category: p.data.category }));
    return posts;
  });

  // After each build, draw a share image (link preview) for every essay
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const site = JSON.parse(fs.readFileSync("src/_data/site.json", "utf-8"));
    await buildOgImages({ outputDir: dir.output, posts: postsForImages, site });
  });

  eleventyConfig.addFilter("readableDate", (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  );

  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString());

  eleventyConfig.addFilter("readingTime", (content) => {
    const words = String(content || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 230)) + " min read";
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
