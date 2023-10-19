import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises"; // Import fs module
import path from "path";

export async function GET(request) {
  try {
    const filePath = path.join(process.cwd(), "public", "data.csv");
    const csvContent = await readFile(filePath, "utf-8");
    const rows = parseCsv(csvContent);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return NextResponse.json({ error: error });
  }
}

function parseCsv(csvContent) {
  const rows = [];
  const lines = csvContent.split("\n");

  for (const line of lines) {
    let row = [];
    let inQuotes = false;
    let field = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        // Check if the next character is also a quote
        if (line[i + 1] === '"' && inQuotes) {
          field += '"';
          i++; // Skip the next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(field);
        field = "";
      } else {
        field += char;
      }
    }

    row.push(field); // Add the last field
    rows.push(row);
  }

  return rows;
}

export async function POST(request) {
  try {
    const newDataRow = await request.text(); // Get the new data from the request

    const filePath = path.join(process.cwd(), "public", "data.csv"); // Construct the absolute file path

    // Check if the file is empty
    const fileContent = await readFile(filePath, "utf-8");
    const isEmpty = fileContent.trim() === "";

    // Append the new data to the CSV file with or without a newline
    await writeFile(filePath, (isEmpty ? "" : "\n") + newDataRow, {
      flag: "a",
    });

    return NextResponse.json({ message: "New row added successfully." });
  } catch (error) {
    console.error("Error writing to CSV file:", error);
    return NextResponse.json({ error: error });
  }
}

export async function PUT(request) {
  try {
    const updatedRowData = await request.text(); // Get the updated data from the request
    const updatedRow = updatedRowData.split(","); // Split the updated data into an array

    const idToUpdate = updatedRow[0]; // Extract the ID to identify the row to update

    // Read the existing CSV data from the file
    const filePath = path.join(process.cwd(), "public", "data.csv");
    const existingCsvData = await readFile(filePath, "utf-8");
    const rows = existingCsvData.split("\n");

    // Find and update the row with the matching ID
    let updatedCsvData = "";
    for (let i = 0; i < rows.length; i++) {
      const rowData = rows[i].split(",");
      if (rowData[0] === idToUpdate) {
        // If the ID matches, update the row with the new data
        updatedCsvData += updatedRow.join(",");
      } else {
        updatedCsvData += rows[i];
      }

      // Add a newline character only if it's not the last row
      if (i < rows.length - 1) {
        updatedCsvData += "\n";
      }
    }

    // Write the updated CSV data back to the file
    await writeFile(filePath, updatedCsvData);

    return NextResponse.json({ message: "Row updated successfully." });
  } catch (error) {
    console.error("Error updating row in CSV file:", error);
    return NextResponse.json({ error: error });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = req.nextUrl;
    const idToDelete = searchParams.get("id"); // Get the ID to delete from request URL params

    const filePath = path.join(process.cwd(), "public", "data.csv"); // CSV file path
    const existingCsvData = await readFile(filePath, "utf-8");
    const rows = existingCsvData.split("\n");

    // Filter out the row with the matching ID
    const updatedCsvData = rows
      .map((row) => row.split(","))
      .filter((rowData) => rowData[0] !== idToDelete) // Remove the row with the matching ID
      .map((rowData) => rowData.join(",")); // Convert rows back to CSV format

    // Write the updated CSV data back to the file
    await writeFile(filePath, updatedCsvData.join("\n"));

    return NextResponse.json({ message: "Row deleted successfully." });
  } catch (error) {
    console.error("Error deleting row in CSV file:", error);
    return NextResponse.json({ error: error });
  }
}
