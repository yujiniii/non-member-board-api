const { Post } = require("../../models/index");
const crypto = require("crypto");

/**
 * 모든 게시글을 정렬해서 찾아줌
 */
const allPostsWithOrdering = async () => {
  const all = await Post.findAll({
    attributes: ["title", "content", "created_at"],
    order: [["created_at", "DESC"]],
  }).catch((err) => {
    throw new Error(err);
  });
  return all;
};

const findWeather = async (userId) => {
  const userLocation = await Post.findOne({ userId: userId }).catch((err) => {
    throw new Error(err);
  });
  const location = userLocation.dataValues.location;
  // 날씨 찾아오기
  return weatherState;
};

const userAuth = async (postId, hashPassword) => {
  const findPostPassword = await Post.findOne({
    postId: postId,
  });
  if (findPostPassword.dataValues.password === hashPassword) {
    return true;
  } else {
    return false;
  }
};

const newPasswordAuth = (password) => {
  if (password.length > 6 && (isNaN(password))){
    return true;
  } else {
    return false;
  }
};

const postPosted = async (title, content, password, userId, weather) => {
  const hashPassword = await crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");
  const create = await Post.create({
    title: title,
    content: content,
    password: hashPassword,
    userId: userId,
    weather: weather,
  }).catch((err) => {
    throw new Error(err);
  });
  return create;
};

const postUpdeted = async (
  postId,
  title,
  content,
  password,
  userId,
  weather
) => {
  const hashPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64");
  const isPasswordTrue = await userAuth(userId, hashPassword);
  if (isPasswordTrue) {
    const update = await Post.update(
      {
        title: title,
        content: content,
        weather: weather,
      },
      {
        where: {
          postId: postId,
        },
      }
    ).catch((err) => {
      throw new Error(err);
    });
    return update;
  } else {
    throw new Error("올바른 비밀번호를 입력해 주세요.");
  }
};


module.exports = {
  postDeleted,
  postPosted,
  postUpdeted,
  findWeather,
  newPasswordAuth,
  allPostsWithOrdering,
};
