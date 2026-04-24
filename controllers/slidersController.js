const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSlider = async (req, res) => {
  try {
    const { title, description, link, is_active, order } = req.body;

    if (!title || typeof title !== "object" || Array.isArray(title)) {
      return res.status(400).json({
        message: "title is required and must be an object",
      });
    }

    if (
      typeof title.ar !== "string" ||
      !title.ar.trim() ||
      typeof title.en !== "string" ||
      !title.en.trim()
    ) {
      return res.status(400).json({
        message: "title.ar and title.en are required",
      });
    }

    let normalizedDescription = undefined;
    if (description !== undefined) {
      if (
        !description ||
        typeof description !== "object" ||
        Array.isArray(description)
      ) {
        return res.status(400).json({
          message: "description must be an object",
        });
      }

      normalizedDescription = {};

      if (description.ar !== undefined) {
        if (typeof description.ar !== "string") {
          return res.status(400).json({
            message: "description.ar must be a string",
          });
        }

        normalizedDescription.ar = description.ar.trim();
      }

      if (description.en !== undefined) {
        if (typeof description.en !== "string") {
          return res.status(400).json({
            message: "description.en must be a string",
          });
        }

        normalizedDescription.en = description.en.trim();
      }
    }

    let normalizedLink = undefined;
    if (link !== undefined) {
      if (link === null || link === "") {
        normalizedLink = null;
      } else {
        if (typeof link !== "string") {
          return res.status(400).json({
            message: "link must be a string",
          });
        }

        try {
          normalizedLink = new URL(link.trim()).toString();
        } catch {
          return res.status(400).json({
            message: "link must be a valid URL",
          });
        }
      }
    }

    let normalizedIsActive = true;
    if (is_active !== undefined) {
      if (typeof is_active === "boolean") {
        normalizedIsActive = is_active;
      } else if (typeof is_active === "string") {
        if (is_active.toLowerCase() === "true") normalizedIsActive = true;
        else if (is_active.toLowerCase() === "false")
          normalizedIsActive = false;
        else {
          return res.status(400).json({
            message: "is_active must be true or false",
          });
        }
      } else {
        return res.status(400).json({
          message: "is_active must be boolean",
        });
      }
    }

    let normalizedOrder = 0;
    if (order !== undefined) {
      normalizedOrder = Number(order);

      if (!Number.isInteger(normalizedOrder) || normalizedOrder < 0) {
        return res.status(400).json({
          message: "order must be a non-negative integer",
        });
      }
    }

    const slider = await prisma.Sliders.create({
      data: {
        title: {
          ar: title.ar.trim(),
          en: title.en.trim(),
        },
        description:
          normalizedDescription && Object.keys(normalizedDescription).length > 0
            ? normalizedDescription
            : null,
        link: normalizedLink,
        is_active: normalizedIsActive,
        order: normalizedOrder,
      },
    });

    res.status(201).json({
      ...slider,
      message: "slide has been created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateSlider = async (req, res) => {
  try {
    const sliderId = Number(req.params.id);

    if (!Number.isInteger(sliderId) || sliderId <= 0) {
      return res.status(400).json({
        message: "Invalid slider id",
      });
    }

    const existing = await prisma.Sliders.findUnique({
      where: { id: sliderId },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Slider not found",
      });
    }

    const { title, description, link, is_active, order } = req.body;
    const data = {};

    if (title !== undefined) {
      if (!title || typeof title !== "object" || Array.isArray(title)) {
        return res.status(400).json({
          message: "title must be an object",
        });
      }

      if (
        typeof title.ar !== "string" ||
        !title.ar.trim() ||
        typeof title.en !== "string" ||
        !title.en.trim()
      ) {
        return res.status(400).json({
          message: "title.ar and title.en are required",
        });
      }

      data.title = {
        ar: title.ar.trim(),
        en: title.en.trim(),
      };
    }

    if (description !== undefined) {
      if (description === null) {
        data.description = null;
      } else {
        if (
          !description ||
          typeof description !== "object" ||
          Array.isArray(description)
        ) {
          return res.status(400).json({
            message: "description must be an object",
          });
        }

        const normalizedDescription = {};

        if (description.ar !== undefined) {
          if (typeof description.ar !== "string") {
            return res.status(400).json({
              message: "description.ar must be a string",
            });
          }

          normalizedDescription.ar = description.ar.trim();
        }

        if (description.en !== undefined) {
          if (typeof description.en !== "string") {
            return res.status(400).json({
              message: "description.en must be a string",
            });
          }

          normalizedDescription.en = description.en.trim();
        }

        data.description =
          Object.keys(normalizedDescription).length > 0
            ? normalizedDescription
            : null;
      }
    }

    if (link !== undefined) {
      if (link === null || link === "") {
        data.link = null;
      } else {
        if (typeof link !== "string") {
          return res.status(400).json({
            message: "link must be a string",
          });
        }

        try {
          data.link = new URL(link.trim()).toString();
        } catch {
          return res.status(400).json({
            message: "link must be a valid URL",
          });
        }
      }
    }

    if (is_active !== undefined) {
      if (typeof is_active === "boolean") {
        data.is_active = is_active;
      } else if (typeof is_active === "string") {
        if (is_active.toLowerCase() === "true") data.is_active = true;
        else if (is_active.toLowerCase() === "false") data.is_active = false;
        else {
          return res.status(400).json({
            message: "is_active must be true or false",
          });
        }
      } else {
        return res.status(400).json({
          message: "is_active must be boolean",
        });
      }
    }

    if (order !== undefined) {
      const normalizedOrder = Number(order);

      if (!Number.isInteger(normalizedOrder) || normalizedOrder < 0) {
        return res.status(400).json({
          message: "order must be a non-negative integer",
        });
      }

      data.order = normalizedOrder;
    }

    if (!Object.keys(data).length) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }
    await prisma.Sliders.update({
      where: { id: sliderId },
      data,
    });
    res.json({
      massage: "slide has updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteSlider = async (req, res) => {
  try {
    const sliderId = Number(req.params.id);

    if (!Number.isInteger(sliderId) || sliderId <= 0) {
      return res.status(400).json({
        message: "Invalid slider id",
      });
    }

    const existing = await prisma.Sliders.findUnique({
      where: { id: sliderId },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Slider not found",
      });
    }

    await prisma.Sliders.delete({
      where: { id: sliderId },
    });

    res.json({
      message: "Slider deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getOneSlider = async (req, res) => {
  try {
    const sliderId = Number(req.params.id);

    if (!Number.isInteger(sliderId) || sliderId <= 0) {
      return res.status(400).json({
        message: "Invalid slider id",
      });
    }

    const slider = await prisma.Sliders.findUnique({
      where: { id: sliderId },
    });

    if (!slider) {
      return res.status(404).json({
        message: "Slider not found",
      });
    }

    const image = await prisma.Images.findFirst({
      where: {
        entity_type: "SLIDER",
        entity_id: slider.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    res.json({
      ...slider,
      image: image || null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getSliders = async (req, res) => {
  try {
    let { page = 1, limit = 10, active_only } = req.query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    const isAdmin =
      req.user?.is_super_admin === true || req.user?.user_type === "ADMIN";

    const where = isAdmin ? {} : { is_active: true };

    if (active_only !== undefined) {
      if (typeof active_only === "string") {
        if (active_only.toLowerCase() === "true") where.is_active = true;
        else if (active_only.toLowerCase() === "false") where.is_active = false;
        else {
          return res.status(400).json({
            message: "active_only must be true or false",
          });
        }
      } else {
        return res.status(400).json({
          message: "active_only must be true or false",
        });
      }
    }

    const [sliders, total] = await Promise.all([
      prisma.Sliders.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: [
          { is_active: "desc" },
          { order: "asc" },
          { created_at: "desc" },
        ],
      }),
      prisma.Sliders.count({ where }),
    ]);

    const sliderIds = sliders.map((slider) => slider.id);

    const images = await prisma.Images.findMany({
      where: {
        entity_type: "SLIDER",
        entity_id: {
          in: sliderIds,
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    const imagesMap = {};
    for (const image of images) {
      if (!imagesMap[image.entity_id]) {
        imagesMap[image.entity_id] = image;
      }
    }

    const formatted = sliders.map((slider) => ({
      ...slider,
      image: imagesMap[slider.id] || null,
    }));

    res.json({
      data: formatted,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
