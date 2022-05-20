import postService from "../services/postService";
let getAllPost = async (req, res) => {
  try {
    let response = await postService.getAllPostService();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
let createNewPost = async (req, res) => {
  try {
    let response = await postService.postCreateNewPostService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
let deletePostById = async (req, res) => {
  try {
    let message = await postService.postDeletePostService(+req.body.id);
    return res.status(200).json({ message });
  } catch (error) {
    console.log(error);
  }
};
let updatePostById = async (req, res) => {
  try {
    let response = await postService.updatePostService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

let getDetailPostById = async (req, res) => {
  try {
    let response = await postService.getDetailPostByIdService(+req.query.id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getAllPost,
  createNewPost,
  deletePostById,
  updatePostById,
  getDetailPostById,
};
