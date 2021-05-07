import "./App.css";
import axios from "axios";
import React, { useState } from "react";

const MAX_IMAGE_SIZE = 1000000;
const API_ENDPOINT =
  "https://9pvz8m4uj1.execute-api.ca-central-1.amazonaws.com/default/getPresignedURL";

function App() {
  const [uploadURL, setUploadURL] = useState("");
  const [imageToUpload, setImageToUpload] = useState("");

  const uploadImage = async (event) => {
    console.log("Upload clicked");
    // Get the presigned URL
    const response = await axios({
      method: "GET",
      url: API_ENDPOINT,
    });
    console.log("Response: ", response);
    console.log("Uploading: ", imageToUpload);
    let binary = atob(imageToUpload.split(",")[1]);
    let array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    let blobData = new Blob([new Uint8Array(array)], { type: "image/jpeg" });
    console.log("Uploading to: ", response.data.uploadURL);
    const result = await fetch(response.data.uploadURL, {
      method: "PUT",
      body: blobData,
    });
    console.log("Result: ", result);
    // Final URL for the user doesn't need the query string params
    setUploadURL(response.data.uploadURL.split("?")[0]);
  };

  const createImage = (file) => {
    // var image = new Image()
    let reader = new FileReader();
    reader.onload = (e) => {
      console.log("length: ", e.target.result.includes("data:image/jpeg"));
      if (!e.target.result.includes("data:image/jpeg")) {
        return alert("Wrong file type - JPG only.");
      }
      if (e.target.result.length > MAX_IMAGE_SIZE) {
        return alert("Image is loo large.");
      }
      setImageToUpload(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    createImage(files[0]);
  };

  const removeImage = (e) => {
    console.log("Remove clicked");
    setImageToUpload("");
  };

  return (
    <div className="App">
      <header className="App-header">
        {imageToUpload && (
          <div>
            <img src={imageToUpload} alt="uploaded" />
            <button onClick={uploadImage}>upload image</button>
            <button onClick={removeImage}>change image</button>
          </div>
        )}
        {!imageToUpload && (
          <div>
            <p>Select image here</p>
            <input type="file" onChange={onFileChange} />
          </div>
        )}
        {uploadURL && <p>successful upload!</p>}
      </header>
    </div>
  );
}

export default App;
