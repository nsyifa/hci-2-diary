// Import necessary modules
import { NextResponse } from "next/server";
import multer from "multer";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const formData = await req.formData();
  const formDataEntryValues = Array.from(formData.values());
  const savedImageFilenames = [];

  for (const formDataEntryValue of formDataEntryValues) {
    if (
      typeof formDataEntryValue === "object" &&
      "arrayBuffer" in formDataEntryValue
    ) {
      const file = formDataEntryValue;
      const buffer = Buffer.from(await file.arrayBuffer());

      // Generate a unique filename using UUID (or use a timestamp, etc.)
      //   const uniqueFilename = `${uuidv4()}_${file.name}`;
      //   const filename = `public/${uniqueFilename}`;
      const uniqueFilename = `${uuidv4()}_${file.name}`;

      fs.writeFileSync(`public/uploads/${uniqueFilename}`, buffer);
      savedImageFilenames.push(uniqueFilename);
    }
  }
  return NextResponse.json({ success: true, filenames: savedImageFilenames });
}

// Configure multer to specify where to store the uploaded files
// const upload = multer({
//   dest: path.join(process.cwd(), "public/uploads"), // Specify the directory for saving uploaded files
// });

// export const config = {
//   api: {
//     bodyParser: false, // Disable the default body parsing
//   },
// };

// export async function POST(req) {
//   try {
//     // Use multer to handle file uploads
//     upload.single("image")(req, res, async (err) => {
//       if (err) {
//         console.error("Error uploading file:", err);
//         return NextResponse.error(err);
//       }

//       // Access the uploaded file information
//       const uploadedFile = req.file;
//       const fileName = uploadedFile.filename;

//       // Return the name of the saved image
//       return NextResponse.json({ fileName });
//     });
//   } catch (error) {
//     console.error("Error handling file upload:", error);
//     return NextResponse.error(error);
//   }
// }
