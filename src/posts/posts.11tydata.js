// Essays dated in the future stay hidden until a build runs on or after their date/time.
const isFuture = (data) => data.page && data.page.date && data.page.date.getTime() > Date.now();

export default {
  layout: "post.njk",
  eleventyComputed: {
    permalink: (data) => (isFuture(data) ? false : `/essays/${data.page.fileSlug}/`),
    eleventyExcludeFromCollections: (data) => isFuture(data),
  },
};
