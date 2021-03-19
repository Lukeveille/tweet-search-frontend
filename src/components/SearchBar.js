const SearchBar = props => {
  const {search, searchTweets, searchField, setSearchField, setSearch, loading } = props
  return <form onSubmit={searchTweets}>
    <select value={searchField} onChange={setSearchField} disabled={loading}>
      <option value="text">Text</option>
      <option value="user_name">User</option>
      <option value="screen_name">@</option>
      <option value="tweet_id">Tweet ID</option>
    </select>
    <input type="text" value={search} onChange={setSearch} disabled={loading} />
    <div>
      <button type="submit" disabled={!search || loading}>Search</button>
    </div>
  </form>
}

export default SearchBar;
