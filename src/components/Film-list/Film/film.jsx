import React from "react";
import PropTypes from "prop-types";
import "./film.css";
import "antd/dist/antd.css";
import { Rate } from "antd";
import { nanoid } from "nanoid";
import noDataIcon from "./no_data.png";

const classNames = require("classnames");

const Film = (props) => {
  const {
    title,
    date,
    overview,
    rate,
    voteAverage,
    posterURL,
    genresList,
    genres,
    id,
    setRating,
  } = props;
  let rateClass;
  let pathToPoster;
  if (voteAverage <= 3) {
    rateClass = classNames("movie-rate", "bad-rate");
  } else if (voteAverage > 3 && voteAverage <= 5) {
    rateClass = classNames("movie-rate", "not-bad-rate");
  } else if (voteAverage > 5 && voteAverage <= 7) {
    rateClass = classNames("movie-rate", "normal-rate");
  } else {
    rateClass = classNames("movie-rate", "good-rate");
  }
  if (posterURL) {
    pathToPoster = `https://image.tmdb.org/t/p/w185${posterURL}`;
  } else {
    pathToPoster = noDataIcon;
  }
  const elements = genres.map((genre) => {
    const genreEl = genresList.find((el) => el.id === genre);
    const genreTitle = genreEl.name;
    return (
      <span key={nanoid(8)} className="movie-genre">
        {genreTitle}
      </span>
    );
  });
  return (
    <section className="movie">
      <img
        alt={`Poster of "${title}"`}
        className="movie-poster"
        src={pathToPoster}
      />
      <section className="movie-info">
        <h1 className="movie-title">{title}</h1>
        <span className={rateClass}>{voteAverage}</span>
        <p className="movie-release">{date}</p>
        <div className="movie-genres">{elements}</div>
        <p className="movie-overview">{overview}</p>
        <Rate
          onChange={(rating) => setRating({ id, rating })}
          defaultValue={rate}
          className="movie-set-rate"
          count={10}
          allowHalf
          allowClear
        />
      </section>
    </section>
  );
};

Film.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  overview: PropTypes.string,
  rate: PropTypes.number,
  voteAverage: PropTypes.number.isRequired,
  posterURL: PropTypes.string,
  genresList: PropTypes.arrayOf(PropTypes.object).isRequired,
  genres: PropTypes.arrayOf(PropTypes.number),
  id: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
};
Film.defaultProps = {
  overview: "No data",
  rate: 0,
  posterURL: "",
  genres: "No data",
};

export default Film;
