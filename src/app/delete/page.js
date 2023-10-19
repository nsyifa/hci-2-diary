"use client";
import { useDiaryContext, usePreviewContext } from "@/context/ContextProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function page() {
  const router = useRouter();
  const { diaries, setDiaries } = useDiaryContext();
  const { preview, setPreview } = usePreviewContext();
  const [csvData, setCsvData] = useState();

  useEffect(() => {
    fetch("/api/diary-data")
      .then((res) => res.json())
      .then((data) => {
        setCsvData(data);
        setDiaries([...data]);
      });
  }, []);

  function updateDiaryData() {
    fetch("/api/diary-data")
      .then((res) => res.json())
      .then((data) => {
        setCsvData(data);
        setDiaries([...data]);
      });
  }

  function getTitle(row_data) {
    const title = row_data[1] + " " + row_data[2] + " " + row_data[3];
    return title;
  }

  async function handleDelete(row_data) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (confirmed) {
      try {
        const response = await fetch(`../api/diary-data?id=${row_data[0]}`, {
          method: "DELETE",
        });

        if (response.ok) {
          console.log("Deletion success");
          updateDiaryData();
        } else {
          console.log("Request failed with status:", response.status);
        }

        const response1 = await fetch(
          `../api/image-data?filenames=${row_data[6]}`,
          {
            method: "DELETE",
          }
        );
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    } else {
    }
  }

  return (
    <div className="m-5">
      <h1 className="text-2xl">Choose a diary to delete</h1>
      <ul className="mt-4 w-max">
        {diaries?.[0]?.[0] &&
          diaries.map((row, index) => (
            <li
              className="cursor-pointer bg-slate-200 mb-3 px-3 py-2 rounded-md hover:bg-slate-300"
              key={row[0]}
              onClick={() => handleDelete(row)}
            >
              {getTitle(row)}
            </li>
          ))}
      </ul>
      <Link href="/">
        <button className="mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back
        </button>
      </Link>
    </div>
  );
}

export default page;
