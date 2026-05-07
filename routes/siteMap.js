const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 🔥 خليها env عشان بعدين
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

router.get("/sitemap.xml", async (req, res) => {
  try {
    const blogs = await prisma.Blogs.findMany({
      where: {
        is_published: true,
      },
      select: {
        slug: true,
        updated_at: true,
      },
    });

    const urls = blogs
      .map((blog) => {
        return `
  <url>
    <loc>${BASE_URL}/blog/${blog.slug}</loc>
    <lastmod>${blog.updated_at.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;
