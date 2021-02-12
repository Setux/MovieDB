import React from "react";
import PropTypes from "prop-types";
import "./film-list.css";
import { Spin } from "antd";
import Film from "./Film";
import { GenresConsumer } from "../genres-context";

export default class FilmList extends React.Component {
  static propTypes = {
    setRating: PropTypes.func.isRequired,
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
  };

  setRate = (info) => {
    const { setRating } = this.props;
    setRating(info);
  };

  render() {
    const { movies, loading } = this.props;
    const elements = movies.map((movie) => {
      const { id, ...movieProps } = movie;
      return (
        <li className="movie-item" key={id}>
          <GenresConsumer>
            {(genresList) => (
              <Film
                {...movieProps}
                genresList={genresList}
                setRating={this.setRate}
                id={id}
              />
            )}
          </GenresConsumer>
        </li>
      );
    });
    if (loading) {
      return (
        <div className="loading-icon">
          <Spin size="large" />
        </div>
      );
    }
    return <ul className="movie-list">{elements}</ul>;
  }
}
