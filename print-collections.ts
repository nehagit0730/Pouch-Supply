import dotenv from "dotenv";
dotenv.config();
import { connectMongoose, CollectionModel } from "./mongooseDb";

async function run() {
  await connectMongoose();
  const collections = await CollectionModel.find({}).lean().exec();
  console.log("ALL COLLECTIONS IN DB:");
  console.log(JSON.stringify(collections, null, 2));
  process.exit(0);
}
run();
