import React from 'react';
import './App.css';

import axios from "axios";
import api from "./api";

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
    size: 0,
    leftover: 0,
    pageCount: 0
  }

  fetchTweetsPath = `${api}/tweets?_sort=id:ASC&_limit=`
  
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
    axios.get(`${this.fetchTweetsPath}${perPage}&${searchField}_contains=${encodeURIComponent(search)}&_start=${(num - 1) * perPage}`).then(this.updatePaginationStates)
  }

  // Query tweets
  searchTweets = async e => {
    e.preventDefault();
    const { search, searchField, perPage } = this.state;

    this.setState({loading: true, size: 0, results: [], currentPage: 1})
    axios.get(`${api}/tweets/count?${searchField}_contains=${encodeURIComponent(search)}`).then(res => {
      const size = res.data
      axios.get(`${this.fetchTweetsPath}${perPage}&${searchField}_contains=${encodeURIComponent(search)}`).then(res => this.updatePaginationStates(res, size))
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
    let pages = []
    for (let i = 0; i < (pageCount > paginationLimit? paginationLimit : pageCount); i++) {
      if (i + pageStart <= pageCount) pages[i] = i + pageStart;
    }

    return (
      <div className="App">
        
        <form onSubmit={this.searchTweets}>
          <select value={searchField} onChange={e => this.setState({ searchField: e.target.value })}>
            <option value="text">Text</option>
            <option value="user_name">User</option>
            <option value="tweet_id">ID</option>
            <option value="screen_name">@</option>
          </select>
          <input type="text" value={search} onChange={e => this.setState({ search: e.target.value })} />
          <div>
            <button type="submit" disabled={!search}>Search</button>
          </div>
        </form>

        {loading?
        
        <div className="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
        :
        results.length? <div>
          <h4><i>Showing results</i> {(currentPage - 1) * perPage + 1} <i>to</i> {((currentPage - 1) * perPage + perPage) > size? size : ((currentPage - 1) * perPage + perPage)} <i>out of</i> {size} <i>for</i> "{query}"</h4>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Text</th>
                <th>Likes</th>
                <th>Retweets</th>
                <th>Tweet ID</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, i) => {
                return <tr key={result.tweet_id} className="tweet-row" onClick={e => this.selectTweets(i)}>
                  <td>{result.user_name} (@{result.screen_name})</td>
                  <td>{result.text}</td>
                  <td>{result.favorite_count}</td>
                  <td>{result.retweet_count}</td>
                  <td>{result.tweet_id}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div> : ''}

          {size > perPage? <div>
          {pageCount > paginationLimit && currentPage > 1? <span>
            <span className="pagination-num" onClick={() => {

              this.changePage(1); this.setState({ pageStart: 1 })
            
            }}>{"<"}</span>
          </span> : ''}
          
          {pages.map(num => ( 
            <span
              key={num}
              className={`pagination-num${currentPage === num? ' selected-page' : ''}`}
              onClick={() => this.changePage(num)}
            >
              {num}
            </span>
          ))}

          {pageCount > paginationLimit && currentPage < pageCount? <span>
            <span className="pagination-num" onClick={() => {
              this.changePage(pageCount); this.setState({ pageStart: pageCount - (paginationLimit -1)})
            }}>{">"}</span>
          </span> : ''}

        </div> : ''}
      </div>
    );
  }
}

export default App;
