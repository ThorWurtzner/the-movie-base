
import React from 'react';
import "./Card.scss";
import { Link } from "@reach/router";

export default function Card({ title, image, year, id }) {
    
    return (
        <>
            <Link to={"/single-view/" + id}>
                <div className="card">
                        <img src={image === "N/A" ? "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=6&m=1147544807&s=612x612&w=0&h=8CXEtGfDlt7oFx7UyEZClHojvDjZR91U-mAU8UlFF4Y=" : image} alt="" />
                    <div>
                        <p>{title}</p>
                        <p>{year}</p>
                    </div>
                </div>
            </Link>
        </>
    )
}
