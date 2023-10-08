"use client";
import { usePreviewContext, useDiaryContext } from "@/context/ContextProvider";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  const { preview, setPreview } = usePreviewContext();
  const { diaries, setDiaries } = useDiaryContext();
  const maxId = diaries.reduce((max, currentRow) => {
    const currentId = parseInt(currentRow[0]);
    return currentId > max ? currentId : max;
  }, 0);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    const newId = parseInt(maxId) + 1;
    const { date, weather, text } = preview;
    const properDate = new Date(date);
    const year = properDate.getFullYear();
    const month = properDate.toLocaleString("default", { month: "long" });
    const day = properDate.getDate();
    let image_files = "";

    const formData = new FormData();
    preview.images.forEach((image, i) => {
      formData.append(image.name, image);
    });

    const response = await fetch("../api/image-data", {
      method: "POST",
      body: formData,
    });

    console.log(response);

    if (response.ok) {
      try {
        const data = await response.json(); // Parse the response as JSON
        const { filenames } = data; // Access the 'filenames' property from the parsed JSON
        console.log("Saved image filenames:", filenames);
        image_files = filenames.join(";");
      } catch (error) {
        console.error("Error parsing JSON response:", error);
      }
    } else {
      console.error("Error uploading image");
    }

    const dataToSave = `${newId}, ${year}, ${month}, ${day}, "${weather}", "${text}", ${image_files},`;

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
  };

  return (
    <div>
      <div className="w-[50%] ml-auto mr-auto mt-10 bg-pink-200 flex flex-col rounded-md p-5 gap-4">
        <h1 className="ml-auto mr-auto text-2xl">Diary</h1>
        <div className="bg-white rounded-md p-2 w-max">{preview.date}</div>
        <div className="bg-white rounded-md p-2 w-max">{preview.weather}</div>
        <div className="bg-white rounded-md p-2 w-max">{preview.text}</div>
        {preview.images && preview.images.length > 0 && (
          <div>
            <p>Images:</p>
            <div className="flex flex-wrap">
              {preview.images.map((image, index) => (
                <div key={index} className="m-2">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    width="40%"
                    height="40%"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
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
  );
}
