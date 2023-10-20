"use client";
import { usePreviewContext, useDiaryContext } from "@/context/ContextProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DiaryTemplate from "@/components/DiaryTemplate";

export default function page() {
  const router = useRouter();

  const { preview, setPreview } = usePreviewContext();
  const { diaries, setDiaries } = useDiaryContext();
  const images = preview.images?.split(";");
  const [maxId, setMaxId] = useState();

  useEffect(() => {
    fetch("/api/diary-data")
      .then((res) => res.json())
      .then((data) => {
        setDiaries([...data]);
        setMaxId(
          data.reduce((max, currentRow) => {
            const currentId = parseInt(currentRow[0]);
            return currentId > max ? currentId : max;
          }, 0)
        );
      });
  }, []);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    const { date, weather, text, bgcolor, tbcolor, textcolor } = preview;
    const properDate = new Date(date);
    const year = properDate.getFullYear();
    const month = properDate.toLocaleString("default", { month: "long" });
    const day = properDate.getDate();
    let image_files = preview.images;

    if (!preview.id) {
      // if we want to create a new diary file
      const newId = parseInt(maxId) + 1;

      const dataToSave = `${newId},${year},${month},${day},"${weather}","${text.replace(
        /\n/g,
        "|||"
      )}",${image_files},${bgcolor},${tbcolor},${textcolor}`;

      try {
        // Send a POST request to the API to save the data
        const response = await fetch("../api/diary-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: dataToSave,
        });
        if (response.ok) {
          console.log("Data saved successfully!");
          router.replace("/");
        }
      } catch (error) {
        // Handle network or other errors
        console.error("Error:", error);
      }
    } else {
      const old_diary = diaries.find((row) => row[0] == preview.id);
      let filenames = old_diary[6];
      if (filenames?.length > 0) {
        const response1 = await fetch(
          `../api/image-data?filenames=${filenames}`,
          {
            method: "DELETE",
          }
        );
      }

      const dataToSave = `${
        preview.id
      },${year},${month},${day},"${weather}","${text.replace(
        /\n/g,
        "|||"
      )}",${image_files},${bgcolor},${tbcolor},${textcolor}`;

      try {
        // Send a POST request to the API to save the data
        const response2 = await fetch("../api/diary-data", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: dataToSave,
        });
        if (response2.ok) {
          console.log("Data saved successfully!");
          router.replace("/");
        }
      } catch (error) {
        // Handle network or other errors
        console.error("Error:", error);
      }
    }
  };

  return (
    <div
      suppressHydrationWarning
      className="w-full flex items-center flex-col mb-5"
    >
      {images && (images[0] instanceof File || images[0] instanceof Blob) ? (
        <DiaryTemplate
          data={{ ...preview, images: images }}
          preview={true}
        ></DiaryTemplate>
      ) : (
        <DiaryTemplate
          data={{ ...preview, images: images }}
          preview={false}
        ></DiaryTemplate>
      )}
      <div className="flex flex-row gap-4 w-[50%] justify-start">
        <div className="mt-4 p-2 rounded-md bg-slate-300 ">
          Images can take a while to load!
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5 mt-5 "
          onClick={handleSaveClick}
        >
          Save
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
          onClick={() => router.back()}
        >
          Go back
        </button>
      </div>
    </div>
  );
}
