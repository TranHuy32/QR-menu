'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Dishes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name_dish: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE', // Cập nhật khóa ngoại trong bảng Cars khi id trong bảng Users được cập nhật
        onDelete: 'NO ACTION', // Or 'CASCADE', 'RESTRICT', depending on your needs // Khi user bị xóa thì sẽ kh xóa được nếu còn car phụ thuộc
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Dishes');
  }
};