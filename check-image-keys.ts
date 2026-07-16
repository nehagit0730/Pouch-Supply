import dotenv from "dotenv";
dotenv.config();
import { connectMongoose, UploadedImageModel } from "./mongooseDb";

async function run() {
  await connectMongoose();
  const testIds = [
    "img-1782800795611-90799",
    "img-1782801674978-83823",
    "img-1782813595338-75959",
    "img-1784097171586-86603"
  ];
  
  for (const id of testIds) {
    const doc = await UploadedImageModel.findOne({ id }).lean().exec();
    console.log(`Image [${id}] exists:`, !!doc, doc ? `Mime: ${doc.mimeType}, size: ${doc.base64Data?.length}` : "N/A");
  }
  
  const count = await UploadedImageModel.countDocuments();
  console.log("Total uploaded_images in DB:", count);
  process.exit(0);
}
run();
