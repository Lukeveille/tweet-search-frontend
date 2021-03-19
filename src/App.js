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
    selectedRow: 'id'
  }

  fetchTweetsPath = `${api}/tweets?_sort=${this.state.selectedRow}:ASC&_limit=`
  
  updatePaginationStates = (res, newSize) => {
    const { perPage, search } = this.state;
    const size = newSize? newSize : this.state.size;
    const leftover = size % perPage;
    const pageCount = (size - leftover) / perPage + (leftover? 1 : 0);
    const results = res.data;

    this.setState({size, leftover, pageCount, results, query: search, loading: false});
  }

  // Re-align page numbers, and update current page
  changePage = num => {
    const {
      search,
      searchField,
      pageCount,
      pageStart,
      paginationLimit,
      perPage,
    } = this.state
    
    if (pageCount > paginationLimit) {
      if (num > (pageStart - 1) + (paginationLimit - 2)) {
        this.setState({ pageStart: pageStart + 3 });
      } else if (pageStart > 1 && num < pageStart + 3) {
        this.setState({ pageStart: pageStart - 2 });
      }
    }
    
    this.setState({ loading: true, currentPage: num });
    axios.get(`${this.fetchTweetsPath}${perPage}&${searchField}_contains=${encodeURIComponent(search)}&_start=${(num - 1) * perPage}`)
    .then(this.updatePaginationStates)
  }

  // Query tweets
  searchTweets = async e => {
    e.preventDefault();
    const { search, searchField, perPage } = this.state;

    this.setState({loading: true, size: 0, results: [], currentPage: 1})
    axios.get(`${api}/tweets/count?${searchField}_contains=${encodeURIComponent(search)}`).then(res => {
      const size = res.data;
      axios.get(`${this.fetchTweetsPath}${perPage}&${searchField}_contains=${encodeURIComponent(search)}`)
      .then(res => this.updatePaginationStates(res, size));
    })
  }

  // View tweet in pop up
  selectTweets = i => {
    const { screen_name, user_name, text } = this.state.results[i]
    alert(`${user_name} (@${screen_name})\n\n${text}`)
  }

  render() {
    const {
      search,
      searchField,
      results,
      size,
      perPage,
      currentPage,
      pageStart,
      pageCount,
      paginationLimit,
      query,
      loading
    } = this.state;

    // Create array of page numbers
    let pages = [];
    for (let i = 0; i < (pageCount > paginationLimit? paginationLimit : pageCount); i++) {
      if (i + pageStart <= pageCount) pages[i] = i + pageStart;
    }

    return (
      <div className="App">
        <SearchBar
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
            <i>Showing results</i> {(currentPage - 1) * perPage + 1} <i>to</i> {((currentPage - 1) * perPage + perPage) > size? size : ((currentPage - 1) * perPage + perPage)} <i>out of</i> {size} <i>for</i> "{query}"
          </h4>
          <DataTable results={results} selectTweets={this.selectTweets}/>
        </div> : ''}

        {size > perPage?
        
        <Pagination
          size={size}
          perPage={perPage}
          pageCount={pageCount}
          paginationLimit={paginationLimit}
          currentPage={currentPage}
          pages={pages}
          changePage={this.changePage}
          firstPage={() => {
            this.changePage(1);
            this.setState({ pageStart: 1 });
          }}
          lastPage={() => {
            this.changePage(pageCount);
            this.setState({ pageStart: pageCount - (paginationLimit -1)});
          }}
        /> : ''}

      </div>
    )
  }
}

export default App;
