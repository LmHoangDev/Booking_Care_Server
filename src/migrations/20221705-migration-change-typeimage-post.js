module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          "Posts",
          "image",
          {
            type: Sequelize.BLOB("long"),
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          "Posts",
          "image",
          {
            type: Sequelize.BLOB("long"),
          },
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
