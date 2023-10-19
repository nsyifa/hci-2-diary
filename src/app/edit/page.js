"use client";

import { useDiaryContext, usePreviewContext } from "@/context/ContextProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  const { diaries, setDiaries } = useDiaryContext();
  const { preview, setPreview } = usePreviewContext();

  function getTitle(row_data) {
    const title = row_data[1] + " " + row_data[2] + " " + row_data[3];
    return title;
  }

  function getDate(row_data) {
    const date = row_data[2] + " " + row_data[3] + ", " + row_data[1];
    return date;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleEdit(row_data) {
    let image_files = row_data[6];
    let date = formatDate(getDate(row_data));
    const data = {
      id: row_data[0],
      date: date,
      weather: row_data[4],
      text: row_data[5].replace(/\|\|\|/g, "\n"),
      images: image_files,
      bgcolor: row_data[7],
      tbcolor: row_data[8],
      textcolor: row_data[9],
    };
    setPreview(data);
    router.push("/create");
  }

  return (
    <div className="m-5">
      <h1 className="text-2xl">Choose a diary to edit</h1>
      <ul className="mt-4 w-max">
        {diaries?.[0]?.[0] &&
          diaries.map((row, index) => (
            <li
              className="cursor-pointer bg-slate-200 mb-3 px-3 py-2 rounded-md hover:bg-slate-300"
              key={row[0]}
              onClick={() => handleEdit(row)}
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
