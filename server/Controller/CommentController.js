import prisma from "../DB/db.config.js";

export const getComments = async (req, res) => {
  const comments = await prisma.comment.findMany({
    include: {
      user: true,
      post: {
        include: {
          user: true,
        },
      },
    },
  });
  return res.json({ status: 200, data: comments });
};

export const createComment = async (req, res) => {
  const { userId, postId, comment } = req.body;

  await prisma.post.update({
    where: {
      id: Number(postId),
    },
    data: {
      comment_count: {
        increment: 1,
      },
    },
  });

  const newComment = await prisma.comment.create({
    data: {
      userId: Number(userId),
      postId: Number(postId),
      comment,
    },
  });

  return res.json({
    status: 200,
    data: newComment,
    msg: "Comment created successfully.",
  });
};

export const getComment = async (req, res) => {
  const commentId = req.params.id;
  const post = await prisma.comment.findFirst({
    where: {
      id: Number(commentId),
    },
  });

  return res.json({ status: 200, data: post });
};

export const deleteComment = async (req, res) => {
  const commentId = req.params.id;

  await prisma.post.update({
    where: {
      id: Number(postId),
    },
    data: {
      comment_count: {
        decrement: 1,
      },
    },
  });
  await prisma.comment.delete({
    where: {
      id: Number(commentId),
    },
  });

  return res.json({ status: 200, msg: "Comment deleted successfully" });
};
