import { Request, Response } from "express";
import Post from "../Models/index";

export const createPost = async (req: Request, res: Response) => {
  const { postTitle, postDescription, postImage } = req.body;

  try {
    const post = await Post.create({
      postTitle,
      postDescription,
      postImage,
      userId: req.user.id,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: "Failed to create post" });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  const posts = await Post.findAll();
  res.json(posts);
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { postTitle, postDescription, postImage } = req.body;

  const post = await Post.findByPk(id);

  if (!post || post.userId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  post.postTitle = postTitle;
  post.postDescription = postDescription;
  post.postImage = postImage;

  await post.save();
  res.json(post);
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  const post = await Post.findByPk(id);

  if (!post || post.userId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await post.destroy();
  res.json({ message: "Post deleted" });
};
