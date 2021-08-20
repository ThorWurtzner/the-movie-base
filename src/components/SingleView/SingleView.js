import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./SingleView.scss";
import Spinner from "../Spinner/Spinner";
import { Link } from "@reach/router";
import { openDB } from 'idb';

export default function Singleview(props) {

    var [ data, setData ] = useState();
    var [ ratingState, setRatingState ] = useState();
    var [ commentState, setCommentState ] = useState();
    var [ inputValue, setInputValue ] = useState();
    
    useEffect(() => {
        var options = {
            method: 'GET',
            url: 'https://movie-database-imdb-alternative.p.rapidapi.com/',
            params: {i: props.id, r: 'json'},
            headers: {
                'x-rapidapi-key': 'cbf0eada93mshda4348a7166d51bp13e11bjsna5929dc3ff1a',
                'x-rapidapi-host': 'movie-database-imdb-alternative.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            setData(response.data)
        }).catch(function (error) {
            console.error(error);
        }); 
    }, [props.id])

    useEffect(() => {
        ratingDB();
        commentDB();
    }, [])

    async function ratingDB(rating) {
        if (!('indexedDB' in window)) {
            console.log('This browser doesn\'t support IndexedDB');
            return;
        }

        const db = await openDB('Movies', 1, {
            upgrade(db) {
                // Create a store of objects
                const store = db.createObjectStore('movies', {
                    keyPath: "movieID"
                });
            }
        });

        // Only add an item to DB if the rating parameter is sent with the function call
        if (rating) {
            await db.add('movies', {
                rating: rating,
                movieID: props.id
            });
        }

        if (itemDelete === true) {
            await db.delete('movies', props.id)
            itemDelete = false;
        }

        var ratingOutput = await db.get('movies', props.id)
        setRatingState(ratingOutput?.rating);
    }



    async function commentDB(event, comment) {
        if (event) {
            event.preventDefault();
        }

        const db = await openDB('Comments', 1, {
            upgrade(db) {
                const store = db.createObjectStore('comments', {
                    keyPath: "movieID"
                });
            }
        });

        if (comment) {
            await db.add('comments', {
                comment: comment,
                movieID: props.id
            });
        }

        if (itemDelete === true) {
            await db.delete('comments', props.id)
            itemDelete = false;
        }

        var commentOutput = await db.get('comments', props.id)
        setCommentState(commentOutput?.comment);
    }

    var itemDelete = false;
    return (
        <>
            <div className="singleView">
               {
                data === undefined ? <Spinner /> : 
                <>
                    <h1 className="singleView__title">{data?.Title}</h1>
                    <p className="singleView__releaseDate">{data?.Released}</p>
                    <p className="singleView__genre">{data?.Genre}</p>
                    <div className="singleView__scores">
                        {data?.Metascore === "N/A" ? null : <div className="singleView__scores__metascore">{data?.Metascore}</div>}
                        {data?.imdbRating === "N/A" ? null : <p className="singleView__scores__imdb">{data?.imdbRating}</p>}
                    </div>
                    <div>
                        { ratingState === undefined 
                            ?
                            <div className="ratings">
                                <div onClick={() => {ratingDB(5)}}>★</div>
                                <div onClick={() => {ratingDB(4)}}>★</div>
                                <div onClick={() => {ratingDB(3)}}>★</div>
                                <div onClick={() => {ratingDB(2)}}>★</div>
                                <div onClick={() => {ratingDB(1)}}>★</div>
                            </div>
                            :
                            <>
                            <div className="ratingShow">
                                {
                                    [...Array(ratingState)].map(() => {
                                        return(
                                            <div>★</div>
                                        )
                                    })
                                }
                                {/* MAKE BUTTON REMOVE MOVIE FROM DATABASE AS WELL AS EMPTY STATE LIKE SO */}
                                <button className="resetBtn" onClick={() => {
                                    setRatingState(undefined);
                                    itemDelete = true;
                                    ratingDB();
                                }}
                                >↺</button>
                            </div>
                            </>
                        }
                    </div>

                    <div>
                        { commentState === undefined
                            ?
                            <form className="reviewForm" onSubmit={event => commentDB(event, inputValue)}>
                                <textarea onChange={event => setInputValue(event.target.value)} id="comment" placeholder="Write review here..." maxLength="150" />
                                <button type="submit">Submit Review</button>
                            </form>
                            :
                            <div className="commentShow">
                                <p>{commentState}</p>
                                <button className="resetBtn" onClick={() => {
                                    setCommentState(undefined);
                                    itemDelete = true;
                                    commentDB();
                                }}
                                >↺</button>
                            </div>
                        }
                    </div>

                    <div className="singleView__wrapper">
                        <img src={data?.Poster === "N/A" ? "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=6&m=1147544807&s=612x612&w=0&h=8CXEtGfDlt7oFx7UyEZClHojvDjZR91U-mAU8UlFF4Y=" : data?.Poster} alt="" />
                        <div className="singleView__content">
                            <p className="singleView__runtime">{data?.Runtime}</p>
                            <p className="singleView__plot">{data?.Plot}</p>

                            <div className="singleView__creators">
                                <p>{data?.Actors}</p>
                                <p>{data?.Director}</p>
                                <p>{data?.Writer}</p>
                            </div>
                        </div>
                    </div>
                    <Link className="linkBack" to="/">⇦</Link>
                </>
                }
            </div>
        </>
    )
}
