import React from 'react';
import StarRating from "react-star-ratings";

export const ratingAverage = (product) => {
  if (product.ratings) {
    const total = product.ratings.reduce((acc, ele) => {
      acc += ele.star
      return acc;
    }, 0);
    const length = product.ratings.length;
    const average = total / length
    
    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRating
            starDimension="20px"
            starSpacing="2px"
            starRatedColor="gold"
            rating={average}
            editing={false}
          />{" "}
          ({length})
        </span>
      </div>
    );
  } 
}