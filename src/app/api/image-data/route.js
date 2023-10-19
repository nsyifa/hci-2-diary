// Import necessary modules
import { NextResponse } from "next/server";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Function to upload images to public folder
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

      // Generate a unique filename using UUID
      const uniqueFilename = `${uuidv4()}_${file.name}`;

      fs.writeFileSync(`public/uploads/${uniqueFilename}`, buffer);
      savedImageFilenames.push(uniqueFilename);
    }
  }
  return NextResponse.json({ success: true, filenames: savedImageFilenames });
}

// Function to delete images in the public folder
export async function DELETE(req) {
  const { searchParams } = req.nextUrl;
  const filenames = searchParams.get("filenames");

  //Split the string into an array of filenames
  const filenamesArray = filenames.split(";");

  const deletedImageFilenames = [];

  for (const filename of filenamesArray) {
    const imagePath = path.join("public/uploads", filename);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      deletedImageFilenames.push(filename);
    }
  }

  if (deletedImageFilenames.length > 0) {
    return NextResponse.json({
      success: true,
      deletedFilenames: deletedImageFilenames,
    });
  } else {
    return NextResponse.json({
      success: false,
      message: "No files were deleted.",
    });
  }
}
