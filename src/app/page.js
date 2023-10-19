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

  function handleUpdate() {
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

  function handleCreate() {
    setPreview({});
    router.push("/create");
  }

  return (
    <div className="m-5">
      <h1 className="text-2xl">My Diary: John Doe</h1>
      <div className="flex justify-start gap-5 mt-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCreate}
        >
          Create
        </button>
        <Link href="/edit">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit
          </button>
        </Link>
        <button
          onClick={handleUpdate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update
        </button>
        <Link href="/delete">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
        </Link>
      </div>

      {/* Display CSV data */}
      <div className="mt-5">
        <h2 className="text-xl mb-3">Entries</h2>
        <ul className="w-max">
          {csvData?.[0]?.[0] &&
            csvData.map((row, index) => (
              <Link
                key={row[0]}
                href={{
                  pathname: "/diary",
                  query: {
                    id: row[0],
                    date: getTitle(row),
                    weather: row[4],
                    text: row[5],
                    images: row[6],
                    bgcolor: row[7],
                    tbcolor: row[8],
                    textcolor: row[9],
                  },
                }}
              >
                <li className="bg-slate-200 mb-3 px-3 py-2 rounded-md hover:bg-slate-300">
                  {getTitle(row)}
                </li>
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
}
