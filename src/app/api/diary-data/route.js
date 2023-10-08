import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises"; // Import fs module
import path from "path";

export async function GET(request) {
  try {
    const filePath = path.join(process.cwd(), "public", "data.csv"); // Construct the absolute file path
    const csvContent = await readFile(filePath, "utf-8"); // Use readFile from fs.promises
    const rows = csvContent.split("\n").map((row) => row.split(","));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return NextResponse.json({ error: error });
  }
}

export async function POST(request) {
  try {
    const newDataRow = await request.text(); // Get the new data from the request

    const filePath = path.join(process.cwd(), "public", "data.csv"); // Construct the absolute file path
    await writeFile(filePath, "\n" + newDataRow, { flag: "a" }); // Append the new data to the CSV file

    return NextResponse.json({ message: "New row added successfully." });
  } catch (error) {
    console.error("Error writing to CSV file:", error);
    return NextResponse.json({ error: error });
  }
}
