import dotenv from "dotenv";
import { Sequelize } from "sequelize";

import initUserModel from "./authmodel";
import initPostModel from "./postmodel";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    define: {
      timestamps: true,
    },
    logging: false,
  }
);

// Initialize all models
const User = initUserModel(sequelize);
const Post = initPostModel(sequelize);

// Setup associations
User.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "userId" });


export async function syncDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Failed to synchronize database:", error);
    process.exit(1);
  }
}

export { sequelize, User, Post};
export default sequelize;
