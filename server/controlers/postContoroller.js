import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Post from '../model/Post.js';
import User from '../model/User.js';
import { existsSync, mkdir, mkdirSync, unlink, unlinkSync } from 'fs';

export const createPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, text, userName, galleryWays, mainImage } = req.body;

    const newPost = new Post({
      userName,
      title,
      text,
      gallery: galleryWays,
      mainImage,
      author: userId,
    });

    if (!existsSync('uploads')) {
      mkdirSync(`./uploads`);
    }

    if (existsSync('uploads')) {
      mkdirSync(`./uploads/${newPost.id.toString()}`, { recursive: true });
    }
    mkdirSync(`./uploads/${newPost.id}/gallery`, { recursive: true });

    if (req.files) {
      const __dirname = dirname(fileURLToPath(import.meta.url));

      const fileArray = Object.values(req.files);

      if (galleryWays) {
        fileArray.forEach((element) => {
          if (element.name !== mainImage) {
            element.mv(path.join(__dirname, '..', `./uploads/${newPost.id}/gallery`, element.name));
          }
        });
      }

      if (mainImage) {
        const mainImageFile = fileArray.find((item) => item.name === mainImage);
        mainImageFile.mv(
          path.join(
            __dirname,
            '..',
            `./uploads/${newPost.id.toString()}`,
            'main-' + mainImageFile.name,
          ),
        );
      }
    }

    await newPost.save();

    await User.findByIdAndUpdate(userId, {
      $push: { posts: newPost },
    });
    return res.status(201).json({ message: 'Success', postId: newPost.id });
  } catch (error) {
    return res.status(500).json({ message: 'Somesing were wrong' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json({ posts, message: 'Success' });
  } catch (error) {
    return res.status(500).json({ message: 'Somesing were wrong' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ message: 'Not found this post' });
    }
    await Post.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    });
    post.views++;

    return res.status(200).json({ post, message: 'Success' });
  } catch (error) {
    return res.status(500).json({ message: 'Somesing were wrong' });
  }
};

export const deletePostById = async (req, res) => {
  try {
    const { id: postId } = req.params;
    console.log(req.params);

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    return res.status(500).json({ message: 'Somesing were wrong' });
  }
};

export const editPostById = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { title, text, deleteMainImage, deleteArraysGalleryImage, mainImage, galleryWays } =
      req.body;

    console.log(req.files);

    const __dirname = dirname(fileURLToPath(import.meta.url));

    const thisPost = await Post.findById(postId);

    console.log('1');
    if (deleteMainImage) {
      unlinkSync(`./uploads/${postId}/main-${deleteMainImage}`);
    }

    if (deleteArraysGalleryImage) {
      console.log('4');

      const parceDeleteArraysGalleryImage = JSON.parse(deleteArraysGalleryImage);

      await thisPost.updateOne({
        gallery: thisPost.gallery.filter((item) => {
          if (parceDeleteArraysGalleryImage.every((element) => element !== item)) {
            return item;
          }
        }),
      });
      console.log('5');

      parceDeleteArraysGalleryImage.forEach((element) => {
        unlinkSync(`./uploads/${postId}/gallery/${element}`);
      });
      console.log('5 after');
    }

    await Post.findByIdAndUpdate(postId, { title, text });

    if (!req.files) {
      return res.status(200).json({ message: 'Success' });
    }

    const fileArray = Object.values(req.files) || [];
    if (mainImage && fileArray.length > 0) {
      console.log('2');
      await thisPost.updateOne({ mainImage: mainImage });

      const mainImageFile = fileArray.find((item) => item.name === mainImage);
      mainImageFile.mv(path.join(__dirname, '..', `./uploads/${postId}`, 'main-' + mainImage));
      console.log('3');
    }

    console.log(galleryWays, fileArray.length > 0);

    if (galleryWays && fileArray.length > 0) {
      console.log('6');

      const parceGalleryWays = JSON.parse(galleryWays);
      console.log('3', parceGalleryWays);
      await thisPost.updateOne({ gallery: [...thisPost.gallery, ...parceGalleryWays] });
      fileArray.forEach((element) => {
        if (parceGalleryWays.some((item) => item === element.name)) {
          element.mv(path.join(__dirname, '..', `./uploads/${postId}/gallery`, element.name));
        }
      });
      console.log('6 after');
    }

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    return res.status(500).json({ message: 'Somesing were wrong' });
  }
};

export const getMyPosts = async (req, res) => {
  console.log('>>>>>>>>>>>>>>');
  try {
    const { userId } = req.user;
    console.log('userId', userId);

    const myPosts = await Post.find({ author: userId });
    console.log(myPosts);
    return res.status(200).json({ posts: myPosts, message: 'Success' });
  } catch (error) {
    return res.status(500).json({ message: 'Somesing were wrong' });
  }
};

export const getPostBySearch = async (req, res) => {
  try {
    const { searchValue } = req.params;

    const searchPostArr = await Post.find({ title: { $regex: '.*' + searchValue + '.*' } });

    res.status(200).json({ posts: searchPostArr, message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: 'Somesing were wrong' });
  }
};

export const getMyPostBySearch = async (req, res) => {
  try {
    const { searchValue } = req.params;
    console.log(searchValue);
    const { userId } = req.user;
    const searchArr = await Post.find({
      author: userId,
      title: { $regex: '.*' + searchValue + '.*' },
    });

    res.status(200).json({ posts: searchArr, message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: 'Somesing were wrong' });
  }
};
