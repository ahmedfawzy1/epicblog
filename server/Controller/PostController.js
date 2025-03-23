import prisma from "../DB/db.config.js";

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Number of posts per page
    const skip = (page - 1) * limit;

    // Get total count of posts
    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    // Get paginated posts
    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json({
      status: 200,
      data: posts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json({ status: 200, data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, description, content, authorId } = req.body;

    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        content,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return res.json({ status: 200, data: newPost, message: "Post created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, content, authorId, description } = req.body;

  await prisma.post.update({
    where: {
      id: Number(postId),
    },
    data: {
      title,
      content,
      authorId,
      description,
    },
  });

  return res.json({ status: 200, message: "Post updated successfully" });
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });
  return res.json({ status: 200, message: "Post deleted successfully" });
};
