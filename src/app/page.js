"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDiaryContext, usePreviewContext } from "@/context/ContextProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [csvData, setCsvData] = useState();
  const { diaries, setDiaries } = useDiaryContext();
  const { preview, setPreview } = usePreviewContext();

  useEffect(() => {
    fetch("/api/diary-data")
      .then((res) => res.json())
      .then((data) => {
        setCsvData(data);
        setDiaries([...data]);
      });
  }, []);

  function getTitle(row_data) {
    const title = row_data[1] + " " + row_data[2] + row_data[3];
    return title;
  }

  function handleCreate() {
    setPreview({});
    router.push("/create");
  }

  return (
    <div className="m-5">
      <h1 className="text-2xl">My Diary: John Doe</h1>
      <div className="flex justify-start gap-5 mt-5">
        <Link href="/create">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreate}
          >
            Create
          </button>
        </Link>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Edit
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Update
        </button>
      </div>

      {/* Display CSV data */}
      <div className="mt-5">
        <h2 className="text-xl">CSV Data</h2>
        <ul>
          {csvData &&
            csvData.map((row, index) => (
              <Link href="/diary">
                <li key={index}>{getTitle(row)}</li>
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
}
