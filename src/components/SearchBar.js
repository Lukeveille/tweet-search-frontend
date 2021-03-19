const SearchBar = props => {
  const {search, searchTweets, searchField, setSearchField, setSearch } = props
  return <form onSubmit={searchTweets}>
    <select value={searchField} onChange={setSearchField}>
      <option value="text">Text</option>
      <option value="user_name">User</option>
      <option value="screen_name">@</option>
      <option value="tweet_id">Tweet ID</option>
    </select>
    <input type="text" value={search} onChange={setSearch} />
    <div>
      <button type="submit" disabled={!search}>Search</button>
    </div>
  </form>
}

export default SearchBar;
