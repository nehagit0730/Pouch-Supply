import dotenv from "dotenv";
dotenv.config();
import { connectMongoose, CustomPageModel } from "./mongooseDb";

async function run() {
  await connectMongoose();
  const allPages = await CustomPageModel.find({}).lean().exec();
  console.log("ALL CUSTOM PAGES IN DB:");
  console.log(JSON.stringify(allPages, null, 2));
  process.exit(0);
}
run();
