const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");
const { pagination } = require("../utils/pagination");
const slugify = require("slugify");

// =============================
// Helper: Resolve Images inside blocks
// =============================
const resolveContentImages = (content, imageMap) => {
  if (!content) return [];

  return content.map((block) => {
    if (block.type === "image") {
      return {
        ...block,
        image: imageMap[block.image_id] || null,
      };
    }
    return block;
  });
};

const trackBlogView = async ({ blogId, userId, ip }) => {
  // ===== 1. views (always increment)
  await prisma.Blogs.update({
    where: { id: blogId },
    data: {
      views_count: { increment: 1 },
    },
  });

  // ===== 2. reach (unique per user/ip)
  try {
    await prisma.BlogReach.create({
      data: {
        blog_id: blogId,
        user_id: userId || null,
        ip_address: userId ? null : ip,
      },
    });

    // لو أول مرة → زوّد reach
    await prisma.Blogs.update({
      where: { id: blogId },
      data: {
        reach_count: { increment: 1 },
      },
    });
  } catch (err) {
    // duplicate → خلاص الشخص ده counted قبل كده
  }
};

// =============================
// CREATE BLOG
// =============================
exports.createBlog = async (req, res) => {
  try {
    const {
      title_en,
      title_ar,
      description_en,
      description_ar,
      content_en,
      content_ar,
      meta_title_en,
      meta_title_ar,
      meta_desc_en,
      meta_desc_ar,
      tags,
    } = req.body;

    if (!title_en || !description_en) {
      return res.status(400).json({
        message: "English content is required",
      });
    }

    let slug = slugify(title_en, { lower: true, strict: true });

    const exists = await prisma.Blogs.findFirst({ where: { slug } });

    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await prisma.Blogs.create({
      data: {
        slug,
        title_en,
        title_ar,

        description_en,
        description_ar,

        meta_title_en,
        meta_title_ar,

        meta_desc_en,
        meta_desc_ar,

        tags,

        author_id: req.user?.id || null,
        is_published: false,
      },
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// UPDATE BLOG
// =============================
exports.updateBlog = async (req, res) => {
  try {
    const blogId = Number(req.params.id);

    const {
      title_en,
      title_ar,
      description_en,
      description_ar,
      content_en,
      content_ar,
      meta_title_en,
      meta_title_ar,
      meta_desc_en,
      meta_desc_ar,
      tags,
      is_published,
    } = req.body;

    const existing = await prisma.Blogs.findUnique({
      where: { id: blogId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const reading_time = content_en
      ? Math.ceil(JSON.stringify(content_en).split(" ").length / 200)
      : undefined;

    const updated = await prisma.Blogs.update({
      where: { id: blogId },
      data: {
        ...(title_en && { title_en }),
        ...(title_ar && { title_ar }),

        ...(description_en && { description_en }),
        ...(description_ar && { description_ar }),

        ...(content_en && { content_en }),
        ...(content_ar && { content_ar }),

        ...(meta_title_en && { meta_title_en }),
        ...(meta_title_ar && { meta_title_ar }),

        ...(meta_desc_en && { meta_desc_en }),
        ...(meta_desc_ar && { meta_desc_ar }),

        ...(tags && { tags }),

        ...(reading_time && { reading_time }),

        ...(is_published !== undefined && {
          is_published,
          published_at: is_published ? new Date() : null,
        }),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// DELETE BLOG
// =============================
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = Number(req.params.id);

    const existing = await prisma.Blogs.findUnique({
      where: { id: blogId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const images = await prisma.Images.findMany({
      where: {
        entity_type: "BLOG",
        entity_id: blogId,
      },
    });

    await Promise.allSettled(
      images.map((img) => cloudinary.uploader.destroy(img.public_id)),
    );

    await prisma.Images.deleteMany({
      where: {
        entity_type: "BLOG",
        entity_id: blogId,
      },
    });

    await prisma.Blogs.delete({
      where: { id: blogId },
    });

    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// GET ALL BLOGS
// =============================
exports.getBlogs = async (req, res) => {
  try {
    const { page, limit, skip } = pagination(req.query);

    const isAdmin = req.user?.user_type === "ADMIN";

    const where = isAdmin
      ? {}
      : {
          is_published: true,
        };

    const [blogs, total] = await Promise.all([
      prisma.Blogs.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          slug: true,

          title_en: true,
          title_ar: true,

          description_en: true,
          description_ar: true,

          created_at: true,
          is_published: true,

          author: {
            select: {
              id: true,
              full_name: true,
            },
          },
          views_count: true,
          reach_count: true,
          reading_time: true,
        },
      }),
      prisma.Blogs.count({ where }),
    ]);

    const blogIds = blogs.map((b) => b.id);

    const images = await prisma.Images.findMany({
      where: {
        entity_type: "BLOG",
        entity_id: { in: blogIds },
      },
    });

    const imageMap = {};
    const coverMap = {};

    images.forEach((img) => {
      if (!imageMap[img.entity_id]) imageMap[img.entity_id] = [];
      imageMap[img.entity_id].push(img);

      if (img.is_cover) {
        coverMap[img.entity_id] = img;
      }
    });

    const data = blogs.map((blog) => ({
      ...blog,
      image: coverMap[blog.id] || null,
    }));

    res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// GET ONE BLOG
// =============================
exports.getOneBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    const isAdmin = req.user?.user_type === "ADMIN";

    const blog = await prisma.Blogs.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!isAdmin && !blog.is_published) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // ✅ track views + reach
    await trackBlogView({
      blogId: blog.id,
      userId: req.user?.id,
      ip: req.ip,
    });

    // ===== images logic =====
    const images = await prisma.Images.findMany({
      where: {
        entity_type: "BLOG",
        entity_id: blog.id,
      },
      orderBy: { order: "asc" },
    });

    const imageMap = {};
    let cover = null;

    images.forEach((img) => {
      imageMap[img.id] = img;
      if (img.is_cover) cover = img;
    });

    const content_en = resolveContentImages(blog.content_en, imageMap);
    const content_ar = resolveContentImages(blog.content_ar, imageMap);

    res.json({
      ...blog,
      cover,
      content_en,
      content_ar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
