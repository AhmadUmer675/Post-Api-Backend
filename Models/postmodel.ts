import { DataTypes, Model, Sequelize } from "sequelize";

export default function initPostModel(sequelize: Sequelize) {
  class Post extends Model {}

  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      postTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      postImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
    }
  );

  return Post;
}
