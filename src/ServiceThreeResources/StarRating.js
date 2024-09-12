import React, { useState } from 'react';
import './singleItem.css'; // Ensure this CSS file is imported

const StarRating = ({ rating, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleMouseEnter = (index) => {
    setHoveredRating(index);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleClick = (index) => {
    onRatingChange(index);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((index) => (
      <label key={index} className="star-label">
        <input
          type="radio"
          name="rating"
          value={index}
          checked={index === rating}
          onChange={() => handleClick(index)}
          className="star-input"
        />
        <span
          className={`star ${index <= (hoveredRating || rating) ? 'filled' : ''}`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          &#9733;
        </span>
      </label>
    ));
  };

  return <div className="star-rating">{renderStars()}</div>;
};

export default StarRating;
