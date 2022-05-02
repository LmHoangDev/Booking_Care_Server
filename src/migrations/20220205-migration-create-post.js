"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("post", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.TEXT,
      },
      descriptionMarkdown: { type: Sequelize.TEXT },
      descriptionHTML: { type: Sequelize.TEXT },
      isDeleted: { type: Sequelize.BOOLEAN },
      type: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("post");
  },
};
