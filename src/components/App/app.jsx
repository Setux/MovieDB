/* eslint camelcase: 0 */
import React from "react";
import { format } from "date-fns";
import { Pagination, Alert } from "antd";
import "./app.css";
import MovieService from "../../services/moviedbapi";
import SearchBar from "../Search-bar";
import FilmList from "../Film-list";
import { GenresProvider } from "../genres-context";

const classNames = require("classnames");

export default class App extends React.Component {
  state = {
    moviesData: [],
    ratedData: [],
    buttonsData: [
      { label: "Search", isActive: true, id: 1 },
      { label: "Rated", isActive: false, id: 2 },
    ],
    loading: false,
    currentTitle: null,
    totalItems: null,
    currentPage: 1,
    guestID: null,
    genresList: null,
    isOnRated: false,
    isError: false,
    isInternet: true,
  };

  movieService = new MovieService();

  componentDidMount() {
    this.movieService.getGuestToken().then((token) => {
      this.setState({
        guestID: token,
      });
    });
    const { guestID } = this.state;
    localStorage.setItem("ID", guestID);
    this.movieService.getGenres().then((genres) => {
      this.setState({
        genresList: genres,
      });
    });
  }

  // eslint-disable-next-line no-unused-vars
  onError = (err) => {
    this.setState({
      loading: false,
      isError: true,
    });
  };

  onLoad = () => {
    const { loading } = this.state;
    this.setState({
      moviesData: [],
      loading: !loading,
      currentPage: 1,
    });
  };

  setRate = (info) => {
    const { id, rating } = info;
    const { moviesData, ratedData } = this.state;
    const index = ratedData.findIndex((element) => element.id === id);
    if (index === -1) {
      const element = moviesData.find((el) => el.id === id);
      const newItem = { ...element, rate: rating };
      const newData = [...ratedData, newItem];
      this.setState({
        ratedData: newData,
      });
    } else {
      const oldItem = ratedData[index];
      const newItem = { ...oldItem, rate: rating };
      const newData = [
        ...ratedData.slice(0, index),
        newItem,
        ...ratedData.slice(index + 1),
      ];
      this.setState({
        ratedData: newData,
      });
    }
  };

  onPageChange = (page) => {
    this.onLoad();
    const { currentTitle } = this.state;
    this.movieService.getMovies(currentTitle, page).then((res) => {
      const newData = [];
      res.results.forEach((movie) => {
        const {
          title,
          release_date,
          overview,
          vote_average,
          genre_ids,
          poster_path,
        } = movie;
        let date;
        if (release_date) {
          date = format(new Date(release_date), "MMMM d, yyyy");
        } else {
          date = "No data";
        }
        const text = `${overview.split(" ", 25).join(" ")}...`;
        const el = this.createFilmElement(
          title,
          date,
          text,
          vote_average,
          genre_ids,
          poster_path
        );
        newData.push(el);
      });
      this.setState({
        moviesData: newData,
        loading: false,
        currentPage: page,
      });
    });
  };

  findMovies = (label) => {
    if (label && navigator.onLine) {
      this.onLoad();
      const { currentPage } = this.state;
      this.movieService
        .getMovies(label, currentPage)
        .then((res) => {
          const newData = [];
          res.results.forEach((movie) => {
            const {
              title,
              release_date,
              overview,
              vote_average,
              genre_ids,
              poster_path,
              id,
            } = movie;
            let date;
            if (release_date) {
              date = format(new Date(release_date), "MMMM d, yyyy");
            } else {
              date = "No data";
            }
            const text = `${overview.split(" ", 25).join(" ")}...`;
            const el = this.createFilmElement(
              title,
              date,
              text,
              vote_average,
              genre_ids,
              poster_path,
              id
            );
            newData.push(el);
          });
          this.setState({
            moviesData: newData,
            loading: false,
            currentTitle: label,
            totalItems: res.total_results,
            currentPage: 1,
          });
        })
        .catch(this.onError);
    } else if (!label && navigator.onLine) {
      this.setState({
        moviesData: [],
        loading: false,
        currentTitle: null,
        totalItems: null,
        currentPage: 1,
      });
    } else {
      this.setState({
        isInternet: false,
      });
    }
  };

  selectTypeOfFilms = (id) => {
    this.setState(({ buttonsData }) => {
      const falseData = buttonsData.map((el) => ({ ...el, isActive: false }));
      const index = buttonsData.findIndex((el) => el.id === id);
      const oldButtonItem = buttonsData[index];
      const newButtonItem = { ...oldButtonItem, isActive: true };
      const newButtonData = [
        ...falseData.slice(0, index),
        newButtonItem,
        ...falseData.slice(index + 1),
      ];
      let isActive;
      switch (id) {
        case 1:
          isActive = false;
          break;
        case 2:
          isActive = true;
          break;
        default:
          break;
      }
      return {
        moviesData: [],
        buttonsData: newButtonData,
        isOnRated: isActive,
      };
    });
  };

  createFilmElement = (
    title,
    date,
    overview,
    voteAverage,
    genres,
    posterURL,
    id
  ) => ({
    title,
    date,
    overview,
    voteAverage,
    genres,
    posterURL,
    id,
    rate: localStorage.getItem(id),
  });

  render() {
    const {
      moviesData,
      ratedData,
      buttonsData,
      loading,
      totalItems,
      currentPage,
      isOnRated,
      genresList,
      isError,
      isInternet,
    } = this.state;
    const buttons = buttonsData.map((button) => {
      const { label, isActive, id } = button;
      const buttonClass = classNames("filter-button", { selected: isActive });
      return (
        <button
          onClick={() => this.selectTypeOfFilms(id)}
          className={buttonClass}
          type="button"
          key={id}
        >
          {label}
        </button>
      );
    });
    if (!isInternet) {
      return (
        <section className="movie-app">
          <Alert
            className="error-message"
            message="Oops... You don't have internet connection :("
            description="Please, check your internet connection and reload this page"
            type="warning"
          />
        </section>
      );
    }
    if (isError) {
      return (
        <section className="movie-app">
          <Alert
            className="error-message"
            message="Oops... Something went wrong :("
            description="We are already fixing this problem. Please, refresh the page"
            type="error"
          />
        </section>
      );
    }
    if (isOnRated) {
      return (
        <GenresProvider value={genresList}>
          <section className="movie-app">
            <div className="filter-buttons">{buttons}</div>
            <FilmList
              movies={ratedData}
              loading={loading}
              setRating={this.setRate}
            />
          </section>
        </GenresProvider>
      );
    }
    let pageBlock;
    if (moviesData.length !== 0) {
      pageBlock = (
        <div className="paginator">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={20}
            onChange={this.onPageChange}
          />
        </div>
      );
    }
    return (
      <GenresProvider value={genresList}>
        <section className="movie-app">
          <div className="filter-buttons">{buttons}</div>
          <SearchBar onSearch={this.findMovies} />
          <FilmList
            movies={moviesData}
            loading={loading}
            setRating={this.setRate}
          />
          {pageBlock}
        </section>
      </GenresProvider>
    );
  }
}
