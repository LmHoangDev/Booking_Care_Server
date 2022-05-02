"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.Allcode, {
        foreignKey: "type",
        targetKey: "keyMap",
        as: "postTypeData",
      });
    }
  }
  Post.init(
    {
      title: DataTypes.STRING,
      image: DataTypes.TEXT,
      descriptionMarkdown: DataTypes.TEXT,
      descriptionHTML: DataTypes.TEXT,
      isDeleted: DataTypes.BOOLEAN,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
