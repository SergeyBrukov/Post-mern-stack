import User from '../model/User.js';
import Post from '../model/Post.js';
import Comment from '../model/Comment.js';

export const addCommentByPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { postId } = req.params;
    const { text } = req.body;

    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    console.log({
      postId: postId,
      author: {
        userId: userId,
        userName: user.name,
      },
      text: text,
    });

    const comment = new Comment({
      postId: postId,
      author: {
        userId: userId,
        userName: user.name,
      },
      text: text,
    });

    await comment.save();

    await post.update({
      $push: { comments: comment },
    });

    res.status(201).json({
      message: 'Success',
      comment: {
        _id: comment.id,
        author: comment.author,
        text: comment.text,
        disLike: comment.disLike,
        like: comment.like,
        createDate: Date.now(),
      },
    });
  } catch (error) {
    return res.status(500).json({ messge: 'Somesing were wrong' });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Promise.all(
      post.comments.map((comment) => {
        return Comment.findById(comment);
      }),
    );

    if (comments.length === 0) {
      return res.status(200).json({ message: 'Comment list by project - empty' });
    }

    return res.status(200).json({ message: 'Success', comments });
  } catch (error) {
    return res.status(500).json({ message: 'Somesing were wrong' });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { commentId, postId } = req.params;
    console.log(commentId);
    await Comment.findByIdAndDelete(commentId);

    const post = await Post.findById(postId);

    console.log(post.comments.filter((item) => item !== commentId));

    await post.update({
      $pull: { comments: commentId },
    });

    res.status(200).json({ message: 'Success', commentId });
  } catch (error) {
    res.status(500).json({ message: 'Somesing were wrong' });
  }
};

export const addLikeOrDisLikeFetch = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { type, authorId } = req.body;
    const thisComment = await Comment.findById(commentId);

    console.log(1);

    if (!thisComment) {
      return res.status(500).json({ message: 'Comment was not found' });
    }

    if (thisComment[type].userLikesId.includes(authorId)) {
      console.log(thisComment[type].userLikesId.filter((item) => item.toString() !== authorId));

      await Comment.findByIdAndUpdate(commentId, {
        [type]: {
          count: thisComment[type].count - 1,
          userLikesId: thisComment[type].userLikesId.filter((item) => item.toString() !== authorId),
        },
      });
      res.status(200).json({ message: 'Success', type, commentId, authorId, typeCount: false });
    } else {
      await Comment.findByIdAndUpdate(commentId, {
        [type]: {
          count: thisComment[type].count + 1,
          userLikesId: [...thisComment[type].userLikesId, authorId],
        },
      });
      res.status(200).json({ message: 'Success', type, commentId, authorId, typeCount: true });
    }
    // typeCount
  } catch (error) {
    res.status(500).json({ message: 'Somesing were wrong' });
  }
};
