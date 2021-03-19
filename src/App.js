import React from 'react';
import axios from "axios";
import api from "./helpers/api";
import LoadingGraphic from "./components/LoadingGraphic"
import SearchBar from "./components/SearchBar"
import DataTable from "./components/DataTable"
import Pagination from "./components/Pagination"

import './App.css';

class App extends React.Component {
  state = {
    loading: false,
    search: '',
    searchField: 'text',
    query: '',
    results: [],

    //pagination states
    perPage: 5,
    paginationLimit: 10,
    pageStart: 1,
    currentPage: 1,
    size: null,
    leftover: 0,
    pageCount: 0,
    selectedRow: 'text',
    sortDirection: 'ASC'
  }
  
  updatePaginationStates = (res, newSize) => {
    const { perPage } = this.state;
    const size = newSize? newSize : this.state.size;
    const leftover = size % perPage;
    const pageCount = (size - leftover) / perPage + (leftover? 1 : 0);
    const results = res.data;

    this.setState({size, leftover, pageCount, results, loading: false});
  }

  // Re-align page numbers, and update current page
  changePage = num => {
    const {
      query,
      searchField,
      pageCount,
      pageStart,
      paginationLimit,
      perPage,
      selectedRow,
      sortDirection
    } = this.state
    
    if (pageCount > paginationLimit) {
      if (num > (pageStart - 1) + (paginationLimit - 2)) {
        this.setState({ pageStart: pageStart + 3 });
      } else if (pageStart > 1 && num < pageStart + 3) {
        this.setState({ pageStart: pageStart - 2 });
      }
    }
    
    this.setState({ loading: true, currentPage: num });
    axios.get(`${api}/tweets?_sort=${selectedRow}:${sortDirection}&_limit=${perPage}&${searchField}_contains=${encodeURIComponent(query)}&_start=${(num - 1) * perPage}`)
    .then(this.updatePaginationStates)
  }
  
  setPageSize = e => {
    const { query, searchField, selectedRow, sortDirection } = this.state
    this.setState({ loading: true, perPage: e.target.value, currentPage: 1, pageStart: 1 });
    axios.get(`${api}/tweets?_sort=${selectedRow}:${sortDirection}&_limit=${e.target.value}&${searchField}_contains=${encodeURIComponent(query)}&_start=${(0) * e.target.value}`)
    .then(this.updatePaginationStates)
  }

  // adjust sorting key and direction when table header is clicked
  changeHeaderSort = selection => {
    const { selectedRow, query, perPage, sortDirection, searchField } = this.state
    let newSortDirection = sortDirection
    let newSelectedRow = selectedRow

    if (selection === selectedRow) {
      newSortDirection = sortDirection === 'ASC'? 'DESC' : 'ASC'
    } else {
      newSelectedRow = selection
    }

    this.setState({ loading: true, sortDirection: newSortDirection, selectedRow: newSelectedRow });
    axios.get(`${api}/tweets?_sort=${newSelectedRow}:${newSortDirection}&_limit=${perPage}&${searchField}_contains=${encodeURIComponent(query)}&_start=${(0) * perPage}`)
    .then(this.updatePaginationStates)
  }

  // Query tweets
  searchTweets = async e => {
    e.preventDefault();
    const { search, searchField, perPage, selectedRow, sortDirection } = this.state;

    this.setState({loading: true, size: 0, results: [], currentPage: 1, query: search, selectedRow: searchField === "screen_name"? "user_name" : searchField })

    // first, fetch total query size, then fetch a page worth of data
    axios.get(`${api}/tweets/count?${searchField}_contains=${encodeURIComponent(search)}`).then(res => {
      const size = res.data;
      axios.get(`${api}/tweets?_sort=${selectedRow}:${sortDirection}&_limit=${perPage}&${searchField}_contains=${encodeURIComponent(search)}`)
      .then(res => this.updatePaginationStates(res, size));
    })
  }

  // View tweet in pop up
  selectTweet = i => {
    const { screen_name, user_name, text } = this.state.results[i]
    alert(`${user_name} (@${screen_name})\n\n${text}`)
  }

  render() {
    const {
      search,
      searchField,
      results,
      size,
      selectedRow,
      sortDirection,
      perPage,
      currentPage,
      pageStart,
      pageCount,
      paginationLimit,
      query,
      loading,
    } = this.state;

    // Create array of page numbers
    let pages = [];
    for (let i = 0; i < (pageCount > paginationLimit? paginationLimit : pageCount); i++) {
      if (i + pageStart <= pageCount) pages[i] = i + pageStart;
    }

    return (
      <div className="App">
        <h1>Tweet Search</h1>
        <SearchBar
          loading={loading}
          search={search}
          searchTweets={this.searchTweets}
          searchField={searchField}
          setSearch={e => this.setState({ search: e.target.value })}
          setSearchField={e => this.setState({ searchField: e.target.value })}
        />

        {loading? <LoadingGraphic />
        :
        size === 0? <h4>Your search returned 0 results</h4>
        :
        results.length? <div>
          <h4>
            <i>Showing results</i>&nbsp;
            {(parseInt(currentPage) - 1) * parseInt(perPage) + 1}&nbsp;
            <i>to</i>&nbsp;
            {((parseInt(currentPage) - 1) * parseInt(perPage) + parseInt(perPage)) > size
            ?
            size
            :
            ((parseInt(currentPage) - 1) * parseInt(perPage) + parseInt(perPage))}&nbsp;
            <i>out of</i> {size} <i>for</i> "{query}"
          </h4>
          <DataTable
            results={results}
            selectTweet={this.selectTweet}
            selectedRow={selectedRow}
            sortDirection={sortDirection}
            changeHeaderSort={this.changeHeaderSort}
          />
        </div> : ''}

        <Pagination
          results={results.length}
          size={size}
          perPage={perPage}
          pageCount={pageCount}
          paginationLimit={paginationLimit}
          currentPage={currentPage}
          pages={pages}
          setPageSize={this.setPageSize}
          changePage={this.changePage}
          firstPage={() => {
            this.changePage(1);
            this.setState({ pageStart: 1 });
          }}
          lastPage={() => {
            this.changePage(pageCount);
            this.setState({ pageStart: pageCount - (paginationLimit -1)});
          }}
        />

        <footer />
      </div>
    )
  }
}

export default App;
