import dotenv from "dotenv";
dotenv.config();
import { connectMongoose, ProductModel } from "./mongooseDb";

async function run() {
  await connectMongoose();
  const products = await ProductModel.find({}).lean().exec();
  console.log("Total Products in DB:", products.length);
  if (products.length > 0) {
    console.log("Keys of first product:", Object.keys(products[0]));
    console.log("First 3 products detailed:", JSON.stringify(products.slice(0, 3), null, 2));
  }
  process.exit(0);
}
run();
