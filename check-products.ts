import dotenv from "dotenv";
dotenv.config();
import { connectMongoose, ProductModel, CustomPageModel, CollectionModel } from "./mongooseDb";

async function run() {
  await connectMongoose();
  const products = await ProductModel.find({}).lean().exec();
  console.log("Current Products Count in DB:", products.length);
  if (products.length > 0) {
    console.log("Sample 3 products:", products.slice(0, 3).map(p => ({ id: p.id, title: p.title })));
  }

  const collections = await CollectionModel.find({}).lean().exec();
  console.log("Current Collections Count in DB:", collections.length);
  
  const customPages = await CustomPageModel.find({}).lean().exec();
  console.log("Current Custom Pages Count in DB:", customPages.length);
  if (customPages.length > 0) {
    console.log("Custom pages:", customPages.map(p => ({ id: p.id, title: p.title, sectionsCount: p.sections?.length })));
  }
  process.exit(0);
}
run();
