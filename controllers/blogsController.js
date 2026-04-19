const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");
const { pagination } = require("../utils/pagination");

function formatBlogWithImages(blog, images = []) {
  const coverImage = images.find((image) => image.is_cover) || images[0] || null;

  return {
    ...blog,
    image: coverImage,
    images,
  };
}

exports.createBlog = async (req, res) => {
  try {
    const { title, description, json_data } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "title and description are required",
      });
    }

    const blog = await prisma.Blogs.create({
      data: {
        title,
        description,
        json_data,
      },
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blogId = Number(req.params.id);
    const { title, description, json_data } = req.body;

    const existing = await prisma.Blogs.findUnique({
      where: { id: blogId },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const updated = await prisma.Blogs.update({
      where: { id: blogId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(json_data !== undefined && { json_data }),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blogId = Number(req.params.id);

    const existing = await prisma.Blogs.findUnique({
      where: { id: blogId },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const images = await prisma.Images.findMany({
      where: {
        entity_type: "BLOG",
        entity_id: blogId,
      },
    });

    await Promise.allSettled(
      images.map((image) => cloudinary.uploader.destroy(image.public_id)),
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

    res.json({
      message: "Blog deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const { page, limit, skip } = pagination(req.query);

    const [blogs, total] = await Promise.all([
      prisma.Blogs.findMany({
        skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.Blogs.count(),
    ]);

    const blogIds = blogs.map((blog) => blog.id);

    const images = blogIds.length
      ? await prisma.Images.findMany({
          where: {
            entity_type: "BLOG",
            entity_id: { in: blogIds },
          },
          orderBy: [{ entity_id: "asc" }, { order: "asc" }],
        })
      : [];

    const imagesMap = images.reduce((acc, image) => {
      if (!acc[image.entity_id]) acc[image.entity_id] = [];
      acc[image.entity_id].push(image);
      return acc;
    }, {});

    const data = blogs.map((blog) =>
      formatBlogWithImages(blog, imagesMap[blog.id] || []),
    );

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
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getOneBlog = async (req, res) => {
  try {
    const blogId = Number(req.params.id);

    const blog = await prisma.Blogs.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const images = await prisma.Images.findMany({
      where: {
        entity_type: "BLOG",
        entity_id: blog.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    res.json(formatBlogWithImages(blog, images));
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
