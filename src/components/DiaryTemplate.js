"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
function DiaryTemplate({ data, preview }) {
  /* data = {
    date:
    weather:
    text:
    images:
    bgcolor:
    tbcolor:
    textcolor:
  } */
  const [diarydata, setDiarydata] = useState();

  useEffect(() => {
    setDiarydata(data);
  }, []);

  return (
    <div className="w-[50%] min-w-min">
      <div
        style={{
          backgroundColor: diarydata?.bgcolor ? diarydata.bgcolor : "#ffdbf4",
        }}
        className="w-full ml-auto mr-auto mt-10 flex flex-col rounded-3xl p-5 gap-4 whitespace-pre-wrap"
      >
        <h1
          style={{
            backgroundColor: diarydata?.tbcolor ? diarydata.tbcolor : "#ffffff",
            color: diarydata?.textcolor ? diarydata.textcolor : "000000",
          }}
          className="ml-auto mr-auto text-2xl font-bold italic rounded-xl px-4 py-2"
        >
          Diary
        </h1>
        <div
          style={{
            backgroundColor: diarydata?.tbcolor ? diarydata.tbcolor : "#ffffff",
            color: diarydata?.textcolor ? diarydata.textcolor : "000000",
          }}
          className="rounded-md p-2 w-max"
        >
          {diarydata?.date}
        </div>
        <div
          style={{
            backgroundColor: diarydata?.tbcolor ? diarydata.tbcolor : "#ffffff",
            color: diarydata?.textcolor ? diarydata.textcolor : "000000",
          }}
          className="rounded-md p-2 w-max"
        >
          {diarydata?.weather}
        </div>
        <div
          style={{
            backgroundColor: diarydata?.tbcolor ? diarydata.tbcolor : "#ffffff",
            color: diarydata?.textcolor ? diarydata.textcolor : "000000",
          }}
          className="rounded-md p-2 w-full"
        >
          {diarydata?.text?.replace(/\|\|\|/g, "\n")}
        </div>
        {diarydata?.images && diarydata?.images[0].length > 0 && (
          <div>
            <p>Images:</p>
            <div className="flex flex-wrap">
              {diarydata.images.map((image, index) => (
                <div key={index} className="m-2">
                  {preview ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`data ${index}`}
                      width="30%" // Adjust width as needed
                      height="30%" // Adjust height as needed
                    />
                  ) : (
                    <Image
                      src={`/uploads/${image}`}
                      alt={`data ${index}`}
                      width={200} // Adjust width as needed
                      height={200} // Adjust height as needed
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiaryTemplate;
