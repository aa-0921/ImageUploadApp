import React, { useState } from "react";
// import * as styles from "./style.module.sass";
// import PhotoSample from "../PhotoSample";

const PhotosUpload = ({ name, componentRef, photos, setPhotos }) => {
  const [isSameError, setIsSameError] = useState(false);
  const [isNumberError, setIsNumberError] = useState(false);
  const [isFileTypeError, setIsFileTypeError] = useState(false);

  const resetErrors = () => {
    setIsSameError(false);
    setIsNumberError(false);
    setIsFileTypeError(false);
  };

  const handleFile = async (event) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return;
    }
    const files = Object.values(event.target.files).concat();
    // 初期化することで同じファイルを連続で選択してもonChagngeが発動するように設定し、画像をキャンセルしてすぐに同じ画像を選ぶ動作に対応
    event.target.value = "";
    resetErrors();

    const pickedPhotos = files.filter((file) => {
      if (
        ![
          "image/gif",
          "image/jpeg",
          "image/png",
          "image/bmp",
          "image/svg+xml",
        ].includes(file.type)
      ) {
        setIsFileTypeError(true);
        return false;
      }

      const existsSameSize = photos.some((photo) => photo.size === file.size);
      if (existsSameSize) {
        setIsSameError(true);
        return false;
      }

      return true;
    });

    if (pickedPhotos.length === 0) {
      return;
    }
    const concatPhotos = photos.concat(pickedPhotos);
    if (concatPhotos.length >= 4) {
      setIsNumberError(true);
    }
    setPhotos(concatPhotos.slice(0, 3));
  };

  const handleCancel = (photoIndex) => {
    if (window.confirm("選択した画像を消してよろしいですか？")) {
      resetErrors();
      const modifyPhotos = photos.concat();
      modifyPhotos.splice(photoIndex, 1);
      setPhotos(modifyPhotos);
    }
  };

  return (
    <>
      <div>
        {[...Array(3)].map((_, index) =>
          index < photos.length ? (
            <button
              type="button"
              key={index}
              onClick={() => handleCancel(index)}
            >
              <img
                src={URL.createObjectURL(photos[index])}
                alt={`あなたの写真 ${index + 1}`}
              />
            </button>
          ) : (
            <label htmlFor={name} key={index}>
              {/* <PhotoSample number={index + 1} /> */}
            </label>
          )
        )}
      </div>
      {isSameError && <p>※既に選択された画像と同じものは表示されません</p>}
      {isNumberError && <p>※3枚を超えて選択された画像は表示されません</p>}
      {isFileTypeError && (
        <p>※jpeg, png, bmp, gif, svg以外のファイル形式は表示されません</p>
      )}

      <div>
        <div>
          <p>※最大3枚まで</p>
        </div>
        <label htmlFor={name}>
          <div></div>
          写真を追加
          <input
            type="file"
            name={name}
            id={name}
            ref={componentRef}
            accept="image/*"
            onChange={handleFile}
            multiple
          />
        </label>
      </div>
    </>
  );
};

export default PhotosUpload;
