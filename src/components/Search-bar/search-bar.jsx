import React from "react";
import PropTypes from "prop-types";
import "./search-bar.css";

const lod = require("lodash");

export default class SearchBar extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
  };

  onLabelChange = lod.debounce((event) => {
    const { onSearch } = this.props;
    onSearch(event.target.value);
  }, 1000);

  render() {
    return (
      <form className="search-form">
        <input
          required
          className="search-bar"
          placeholder="Type to search..."
          onChange={this.onLabelChange}
        />
      </form>
    );
  }
}
