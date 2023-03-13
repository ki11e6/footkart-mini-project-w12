const bannerModel = require('../models/banners');
const path = require('path');

const getBannersPage = async (req, res) => {
  try {
    // const banners = await bannerModel.findOne({}, { sort: { _id: -1 } });
    const banners = await bannerModel.findOne();
    res.render('admin/banner', { banners });
  } catch (error) {
    console.log(error);
  }
};

const saveBanner = async (req, res) => {
  try {
    const images = [];
    for (key in req.files) {
      const paths = req.files[key][0].path;
      images.push(paths.slice(7));
    }
    const banners = new bannerModel({
      image: images,
    });
    await banners.save();
    res.redirect('admin/dashhome');
  } catch (error) {
    console.log(error);
  }
};

const deleteBanner = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getBannersPage,
  saveBanner,
  deleteBanner,
};
