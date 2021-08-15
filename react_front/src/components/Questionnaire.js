import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { navigate } from "gatsby";
import axios from "axios";
import imageCompression from "browser-image-compression";
import PhotosUpload from "./PhotosUpload";

const Questionnaire = () => {
  const { register, errors, handleSubmit } = useForm({
    mode: "onBlur",
  });
  const [photos, setPhotos] = useState([]);

  const onSubmit = async (data) => {
    const { email, phone } = data;
    if (email === "" && phone === "" && photos.length === 0) {
      // アンケートフォームが空の場合はPOSTしない
      return;
    }

    // 画像を送信できるようにFormDataに変換する
    const formData = new FormData();
    formData.append("email", email);
    formData.append("phone", phone);

    const compressOptions = {
      // 3MB以下に圧縮する
      maxSizeMB: 3,
    };
    const compressedPhotoData = await Promise.all(
      photos.map(async (photo) => {
        return {
          blob: await imageCompression(photo, compressOptions),
          name: photo.name,
        };
      })
    );
    compressedPhotoData.forEach((photoData) => {
      formData.append("photo", photoData.blob, photoData.name);
    });

    axios({
      url: "/api/register",
      method: "post",
      data: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then(() => {
        // navigate("/complete");
        alert("成功しました。");
      })
      .catch((error) => {
        alert("エラーが発生しました。");
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className={styles.dataContainer}> */}
      <div>
        <input
          // name="email"
          {...register("email", { required: true })}
          // error={errors.email !== undefined}
        />
        <input
          // name="phone"
          {...register("phone", { required: true })}
          // error={errors.phone !== undefined}
        />
      </div>
      {/* <div className={styles.photoUpload}> */}
      <div>
        <PhotosUpload name="photos" photos={photos} setPhotos={setPhotos} />
      </div>
      {/* <div className={styles.button}>
            <button　disabled={ />
          </div> */}
    </form>
  );
};

export default Questionnaire;
