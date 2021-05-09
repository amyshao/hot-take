import axios from "axios";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Room.css';

const Room = (props) => {
    const { roomId } = props;
    const [images, setImages] = useState([]);
    const [totalRanking, setTotalRanking] = useState([]);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getImages = async () => {
            console.log("lets get the data");
            const url = `/api/getImages/${roomId}`;
            const response = await axios.get(url);
            console.log("fetched images: ", response.data);
            for (let i = 0; i < response.data.length; i++) {
                setImages(images => [...images, response.data[i].imageURL]);
            }
            setLoading(false);
        }
        if (shouldFetch) {
            setShouldFetch(false);
        }
    }, [roomId, images, shouldFetch]);

    useEffect(() => {
        const getScore = async () => {
            const url = `/api/getScores/${roomId}`;
            try {
                const response = await axios.get(url);
                //console.log(response.data);
                const parsedResponse = response.data;
                setTotalRanking(parsedResponse);
                //console.log(parsedResponse);
                //console.log(`fetched scores ${parsedResponse} from room ${roomId}`);
            }
            catch (error) {
                console.log(error);
            }
        }
        const interval = setInterval(() => {
            getScore();
        }, 1000);
        return () => clearInterval(interval);
    });

    const addRanking = async () => {
        const url = `/api/addRanking/${roomId}?ranking=${JSON.stringify(images)}`;
        try {
            await axios.post(url);
            console.log(`added ${images} to room ${roomId}`);
        }
        catch (error) {
            console.log(error);
        }
    }

    const submit = () => {
        console.log("submit clicked");
        addRanking();
        setIsSubmitted(true);
    }

    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setImages(items);
    }

    return (
        <div className="room">
            <header>
                {!loading && images.length === 0 && (
                    <h1>Sorry, it seems this room does not exist :(</h1>
                )}
                {!loading && images.length > 0 && (
                    <h1>Room {roomId}</h1>
                )}
            </header>
            <div className="body-container">
                <section className="ranking-container">
                    {!isSubmitted && images.length !== 0 &&
                        <button onClick={submit}>Submit</button>
                    }
                    {isSubmitted &&
                        <h2>Submitted!</h2>
                    }
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="ranking">
                            {(provided) => (
                                <ul className="ranking"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {images.map((image, index) => {
                                        return (
                                            <Draggable
                                                key={image}
                                                draggableId={image}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <li ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <img className="ranking-image"
                                                            src={image} alt={image} />
                                                    </li>
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                </section>
                <section className="total-rank-container">
                    <h2>Total Score</h2>
                    {totalRanking.map((image) => {
                        return (
                            <div className="total-rank-image-container" key={`total-${image.imageURL}`}>
                                <img className="total-rank-image"
                                    src={image.imageURL}
                                    alt={image.imageURL} />
                                <p>{image.score} point{image.score !== 1 && "s"}</p>
                            </div>
                        );
                    })}
                </section>
            </div>
        </div>
    );
}

export default Room;
