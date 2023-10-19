"use client";
import DiaryTemplate from "@/components/DiaryTemplate";
import { usePreviewContext } from "@/context/ContextProvider";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Diary() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { preview, setPreview } = usePreviewContext();

  let image_files = searchParams.get("images").split(";");
  const data = {
    id: searchParams.get("id"),
    date: searchParams.get("date"),
    weather: searchParams.get("weather"),
    text: searchParams.get("text"),
    images: image_files,
    bgcolor: searchParams.get("bgcolor"),
    tbcolor: searchParams.get("tbcolor"),
    textcolor: searchParams.get("textcolor"),
  };

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function handleEdit(row_data) {
    let image_files = row_data.images.join(";");
    let date = formatDate(row_data.date);
    const data = {
      id: row_data.id,
      date: date,
      weather: row_data.weather,
      text: row_data.text.replace(/\|\|\|/g, "\n"),
      images: image_files,
      bgcolor: row_data.bgcolor,
      tbcolor: row_data.tbcolor,
      textcolor: row_data.textcolor,
    };
    setPreview(data);
    router.push("/create");
  }

  return (
    <div className="flex flex-row justify-center w-full gap-8">
      <div className="flex flex-col">
        <Link href="/">
          <button className="mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Back
          </button>
        </Link>
        <button
          onClick={() => handleEdit(data)}
          className="mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-max"
        >
          Edit
        </button>
      </div>

      <DiaryTemplate data={data} preview={false}></DiaryTemplate>
    </div>
  );
}
