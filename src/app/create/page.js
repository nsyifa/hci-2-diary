"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePreviewContext, useDiaryContext } from "@/context/ContextProvider";
import Image from "next/image";

export default function Create() {
  const router = useRouter();
  const { preview, setPreview } = usePreviewContext();
  const { diaries, setDiaries } = useDiaryContext();
  const [formData, setFormData] = useState();

  useEffect(() => {
    fetch("/api/diary-data")
      .then((res) => res.json())
      .then((data) => {
        setDiaries([...data]);
        const initialFormData = {
          id: preview.id || null,
          date: preview.date || "",
          weather: preview.weather || "",
          text: preview.text || "",
          images: preview.images?.split(";") || [],
          bgcolor: preview.bgcolor || "",
          tbcolor: preview.tbcolor || "",
          textcolor: preview.textcolor || "", // This will store the selected image file
        };
        setFormData(initialFormData);
      });
  }, []);

  const inputImages = useRef(preview.images || []);
  // const initialFormData = {
  //   id: preview.id || null,
  //   date: preview.date || "",
  //   weather: preview.weather || "",
  //   text: preview.text || "",
  //   images: preview.images?.split(";") || [], // This will store the selected image file
  // };

  // const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    // When the context preview data changes, update the form data state
    setFormData({
      id: preview.id || null,
      date: preview.date || "",
      weather: preview.weather || "",
      text: preview.text || "",
      images: preview.images?.split(";") || [],
      bgcolor: preview.bgcolor || "",
      tbcolor: preview.tbcolor || "",
      textcolor: preview.textcolor || "", // Preserve the images already selected
    });
  }, [preview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const imageFiles = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: imageFiles,
    });
  };

  const handleResetImage = () => {
    setFormData({
      ...formData,
      images: [],
    });
    if (inputImages.current) {
      inputImages.current.value = "";
      inputImages.current.type = "text";
      inputImages.current.type = "file";
    }
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      date: "",
      weather: "",
      text: "",
      images: [],
      bgcolor: "",
      tbcolor: "",
      textcolor: "",
    });
    if (inputImages.current) {
      inputImages.current.value = "";
      inputImages.current.type = "text";
      inputImages.current.type = "file";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.images[0] && !preview.images) {
      setPreview({ ...formData, images: "" });
      router.push("/preview");
    }
    let image_files = formData.images.join(";");
    let old_images = null;
    if (preview.id) {
      old_images = diaries.find((row) => row[0] == preview.id)[6].split(";");
    }
    if (
      formData.images[0] instanceof File ||
      (!formData.images[0] && preview.images)
    ) {
      if (
        preview.images &&
        (!preview.id ||
          !old_images.some((image) => preview.images.includes(image)))
      ) {
        const filenames = preview.images;
        const response1 = await fetch(
          `../api/image-data?filenames=${filenames}`,
          {
            method: "DELETE",
          }
        );
      }
      const formImageData = new FormData();
      formData.images.forEach((image, i) => {
        formImageData.append(image.name, image);
      });

      const response = await fetch("../api/image-data", {
        method: "POST",
        body: formImageData,
      });

      if (response.ok) {
        try {
          const data = await response.json(); // Parse the response as JSON
          const { filenames } = data; // Access the 'filenames' property from the parsed JSON
          image_files = filenames.join(";");
        } catch (error) {
          console.error("Error parsing JSON response:", error);
        }
      } else {
        console.error("Error uploading image");
      }
    }

    setPreview({ ...formData, images: image_files });
    router.push("/preview");
  };

  const handleBack = async () => {
    const old_images = diaries
      .find((row) => row[0] == preview.id)[6]
      .split(";");
    if (
      !old_images.some((image) => preview.images.split(";").includes(image))
    ) {
      const filenames = preview.images;
      const response = await fetch(`../api/image-data?filenames=${filenames}`, {
        method: "DELETE",
      });
      router.back();
    }
    router.back();
  };

  const handleMainMenu = async () => {
    let old_images = null;
    if (preview.id) {
      old_images = diaries.find((row) => row[0] == preview.id)[6].split(";");
    }
    if (preview.images && !preview.id) {
      const filenames = preview.images;
      const response = await fetch(`../api/image-data?filenames=${filenames}`, {
        method: "DELETE",
      });
    } else if (
      preview.id &&
      !old_images.some((image) => preview.images.split(";").includes(image))
    ) {
      const filenames = preview.images;
      const response = await fetch(`../api/image-data?filenames=${filenames}`, {
        method: "DELETE",
      });
    }
    router.replace("/");
  };

  return (
    <div className="mt-5 mx-auto w-[40%] mb-5">
      <h1 className="text-2xl mb-4 text-center">Fill in your diary</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4 w-full">
          <label className="block text-sm font-bold mb-1">Date:</label>
          <input
            type="date"
            name="date"
            value={formData?.date}
            onChange={handleInputChange}
            className="rounded-md p-2 border border-gray-300 focus:outline-none focus:border-blue-500 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Weather:</label>
          <input
            type="text"
            name="weather"
            value={formData?.weather}
            onChange={handleInputChange}
            className="rounded-md p-2 border border-gray-300 focus:outline-none focus:border-blue-500 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Text:</label>
          <textarea
            name="text"
            value={formData?.text}
            onChange={handleInputChange}
            className="rounded-md p-2 border border-gray-300 focus:outline-none focus:border-blue-500 w-full"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Images:</label>
          <input
            type="file"
            name="images"
            accept=".gif,.jpg,.jpeg,.png"
            ref={inputImages}
            onChange={handleImageChange}
            className="p-2 border border-gray-300 focus:outline-none focus:border-blue-500 w-full"
            multiple
          />
        </div>
        <button
          type="button"
          className="bg-gray-200 hover:bg-blue-400 text-black font-bold py-2 px-2 rounded"
          onClick={handleResetImage}
        >
          Reset Image
        </button>
        {/* Image previews */}
        <div className="mb-4">
          {formData?.images?.[0] &&
            formData?.images?.map((image, index) => {
              if (image instanceof File || image instanceof Blob) {
                return (
                  <div key={index}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      width="100" // Adjust the width as needed
                      height="100" // Adjust the height as needed
                    />
                    <p>{image.name}</p>
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <Image
                      src={`/uploads/${image}`}
                      alt={`Preview ${index}`}
                      width={100} // Adjust width as needed
                      height={100} // Adjust height as needed
                    />
                    <p>{image}</p>
                  </div>
                );
              }
            })}
        </div>
        <div className="flex flex-row mb-4 gap-4">
          <div className="flex flex-col border-2 p-3 h-max">
            <label className="block text-sm font-bold mb-1">
              Background color:
            </label>
            <input
              name="bgcolor"
              type="color"
              value={formData?.bgcolor || "#ffdbf4"}
              onChange={handleInputChange}
              className="self-center cursor-pointer"
            />
          </div>
          <div className="flex flex-col border-2 p-3 h-max">
            <label className="block text-sm font-bold mb-1">
              Textbox color:
            </label>
            <input
              name="tbcolor"
              type="color"
              value={formData?.tbcolor || "#ffffff"}
              onChange={handleInputChange}
              className="self-center cursor-pointer"
            />
          </div>
          <div className="flex flex-col border-2 p-3 h-max">
            <label className="block text-sm font-bold mb-1">Text color:</label>
            <input
              name="textcolor"
              type="color"
              value={formData?.textcolor || "#000000"}
              onChange={handleInputChange}
              className="self-center cursor-pointer"
            />
          </div>
          <div
            style={{
              backgroundColor: formData?.bgcolor ? formData.bgcolor : "#ffdbf4",
            }}
            className="w-40 h-48 bg-slate-400 rounded-md p-2"
          >
            <p
              style={{
                backgroundColor: formData?.tbcolor
                  ? formData.tbcolor
                  : "#ffffff",
                color: formData?.textcolor ? formData.textcolor : "000000",
              }}
              className="w-max mx-auto text-lg font-bold italic rounded-lg px-2 py-1[0.5]"
            >
              Diary
            </p>
            <div
              style={{
                backgroundColor: formData?.tbcolor
                  ? formData.tbcolor
                  : "#ffffff",
                color: formData?.textcolor ? formData.textcolor : "000000",
              }}
              className="rounded-md p-1 w-max text-xs mb-2"
            >
              text
            </div>
            <div
              style={{
                backgroundColor: formData?.tbcolor
                  ? formData.tbcolor
                  : "#ffffff",
                color: formData?.textcolor ? formData.textcolor : "000000",
              }}
              className="rounded-md p-1 w-max text-xs mb-2"
            >
              text
            </div>
            <div
              style={{
                backgroundColor: formData?.tbcolor
                  ? formData.tbcolor
                  : "#ffffff",
                color: formData?.textcolor ? formData.textcolor : "000000",
              }}
              className="rounded-md p-1 text-xs mb-2 whitespace-pre-wrap w-full h-max"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              eget dolor id augue.
            </div>
          </div>
        </div>

        <div className="flex justify-start gap-5">
          {formData?.id ? (
            <button
              onClick={handleBack}
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Back
            </button>
          ) : null}
          <button
            onClick={handleMainMenu}
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Main Menu
          </button>

          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
