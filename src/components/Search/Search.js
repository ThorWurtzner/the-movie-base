import React, { useState, useContext, useEffect, useRef } from 'react';
import "./Search.scss";
import axios from "axios";
import Card from "../Card/Card";
import Spinner from "../Spinner/Spinner";
import dataContext from "../../Context";

export default function Search({pageState, searchState}) {
    var [ spin, setSpin ] = useState();

    var page = pageState.page;
    var setPage = pageState.setPage;

    var searchInput = searchState.searchInput;
    var setSearchInput = searchState.setSearchInput;
    
    var dataArray = useContext(dataContext);

    // console.log(page);
    // console.log(dataArray[0]);

    function handleSubmit(event) {
        setSpin(true);
        if (event) {
            event.preventDefault();
            setPage(1);
        }

        // console.log(page);

        var options = {
            method: 'GET',
            url: 'https://movie-database-imdb-alternative.p.rapidapi.com/',
            params: {s: !searchInput === undefined && searchInput.charAt(searchInput.length - 1) === " " ? searchInput.slice(0, -1) : searchInput, page: page, r: 'json'},
            headers: {
                'x-rapidapi-key': 'cbf0eada93mshda4348a7166d51bp13e11bjsna5929dc3ff1a',
                'x-rapidapi-host': 'movie-database-imdb-alternative.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            // dataArray[1](undefined);
            console.log(response);
            dataArray[1](response.data.Search)
            setSpin(false);
        }).catch(function (error) {
            console.error(error);
        });
    }

    const isMounted = useRef(false);
    
    useEffect(() => {
        if (isMounted.current) {
            handleSubmit();
        } else {
            isMounted.current = true;
        }
    }, [page])

    Notification.requestPermission(function(status) {
        // console.log("Notification permission status:", status);
    })
    
    function displayNotification() {
        if (Notification.permission === "granted") {
            navigator.serviceWorker.getRegistration()
            .then(function(reg) {
                var options = {
                vibrate: [200, 100, 500, 100, 200, 100, 800, 100, 500]
                }
                reg.showNotification("Hello world", options);
            });
        }
    }

    return (
        <div className="frontpage">
            <div style={{display: "flex", alignItems: "center"}}>
                <button className="notificationBtn" onClick={displayNotification}></button>
                <p style={{color: "#fff", fontFamily: "VT323", fontSize: "20px", marginLeft: "10px"}}>⇦ Notification</p>
            </div>
            <h1 className="siteHeading" onClick={() => {
                setSearchInput("");
                setPage(1);
                dataArray[1]([]);
                // handleSubmit();
            }}>The Movie Base</h1>
            <div className="searchWrapper">
                <form onSubmit={event => handleSubmit(event)}>
                    <input onChange={event => setSearchInput(event.target.value)} type="text" />
                    <button type="submit">&#x1F50D;</button>
                </form>
            </div>

            { dataArray[0] === undefined || dataArray[0].length < 1 ? null : 
                <div style={{marginBottom: "30px"}}>
                    <p style={{color: "#fff", fontFamily: "VT323", fontSize: "30px", display: "flex", justifyContent: "center", margin: "30px 0"}}>page {page}</p>
                    <button className="prevBtn" onClick={() => { 
                        if (page > 1) {
                            setPage(page - 1)
                            // handleSubmit();
                        }
                    }}>⇦</button> 
                    
                    <button className="nextBtn" onClick={() => { 
                        if (page < 10) {
                            setPage(page + 1);
                            // handleSubmit();
                        }
                    }}>⇨</button>
                </div>
            }


            <div className="cards">
                { dataArray[0] === undefined || dataArray[0].length < 1 ? <img className="cards__bg" src="./icon.png" alt="" /> : dataArray[0].slice(0, -1) ?.map((result, i) => {
                    return (
                        spin === true ? <Spinner key={i} /> :
                        <Card key={i} title={result.Title} image={result.Poster} year={result.Year} id={result.imdbID} />
                    )
                })}
            </div>

        </div>
    )
}
