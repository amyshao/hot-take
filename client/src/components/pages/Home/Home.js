import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import './Home.css';

const MAX_IMAGE_SIZE = 1000000000;
const API_ENDPOINT =
    "https://9pvz8m4uj1.execute-api.ca-central-1.amazonaws.com/default/getPresignedURL";

const Home = () => {
    const [addedImages, setAddedImages] = useState([]);
    var [loading, setLoading] = useState(false);
    var uploadedImageURLs = [];
    const history = useHistory();

    useEffect(() => {
        console.log("added images: ", addedImages);
    }, [addedImages])

    const createImageFromFile = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            console.log("length: ", e.target.result.includes("data:image/jpeg"));
            if (!e.target.result.includes("data:image/jpeg")) {
                return alert("Wrong file type - JPG only.");
            }
            if (e.target.result.length > MAX_IMAGE_SIZE) {
                return alert("Image is loo large.");
            }
            setAddedImages([...addedImages, e.target.result]);
        };
        reader.readAsDataURL(file);
    };

    const onFileChange = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            createImageFromFile(files[i]);
        }
    };

    const removeAllImages = (e) => {
        console.log("Remove clicked");
        setAddedImages([]);
    };

    const uploadImages = async () => {
        console.log("Upload clicked");
        try {
            for (const addedImage of addedImages) {
                // Get the presigned URL
                const response = await axios({
                    method: "GET",
                    url: API_ENDPOINT,
                });

                let binary = atob(addedImage.split(",")[1]);
                let array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                let blobData = new Blob([new Uint8Array(array)], { type: "image/jpeg" });

                console.log("Uploading to: ", response.data.uploadURL);
                await fetch(response.data.uploadURL, {
                    method: "PUT",
                    body: blobData,
                });
                uploadedImageURLs.push(response.data.uploadURL.split("?")[0]);
            }

        } catch (error) {
            console.log(`[ERROR]    Uploading error: ${error}`);
            return "";
        }
    };

    const addImageToRoom = async (roomId, imageURL) => {
        const url = `/api/addImages/${roomId}?src=${imageURL}`;
        try {
            await axios.post(url);
            console.log(`added ${imageURL} to room ${roomId}`);
        }
        catch (error) {
            console.log(error);
        }
    };

    const createRoom = async () => {
        setLoading(true);
        const url = `/api/createRoom`;
        try {
            const response = await axios.post(url);
            console.log(`created room ${response.data["roomId"]} with response: `, response);
            await uploadImages();
            console.log("uploadedURLs: ", uploadedImageURLs);
            for (let i = 0; i < uploadedImageURLs.length; i++) {
                await addImageToRoom(response.data["roomId"], uploadedImageURLs[i]);
            }
            history.push(`/room/${response.data["roomId"]}`)
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="home">
            <h1>Upload images, then share the link to rank!</h1>
            <div className="images-container">
                {addedImages.map((image) => {
                    return (
                        <div className="image-frame">
                            <img key={image} src={image} alt={image} />
                        </div>
                    );
                })}
            </div>
            <div className="input-container">
                <input type="file" onChange={onFileChange} />
            </div>
            {addedImages.length !== 0 && (
                <div>
                    <button onClick={createRoom}>Create Room</button>
                    <button onClick={removeAllImages}>Remove All</button>
                </div>
            )}
            {loading && (
                <ClipLoader color={"#292F33"} loading={true} size={150} />
            )}
        </div>
    );
}

export default Home;
