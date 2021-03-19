const DataTable = props => {
  const {
    results,
    selectTweet,
    selectedRow,
    sortDirection,
    changeHeaderSort
  } = props

  const headers = {
    user_name: 'User',
    text: 'Text',
    favorite_count: 'Likes',
    retweet_count: 'Retweets',
    tweet_id: 'Tweet ID'
  }

  return <table>
    <thead>
      <tr>

        {Object.keys(headers).map(header => (
          <th
            key={header}
            className="sort-header"
            onClick={() => changeHeaderSort(header)}
          >
            {headers[header]} {selectedRow === header? sortDirection === 'ASC'? '^' : <small>v</small> : ''}
          </th>
        ))}

      </tr>
    </thead>
    <tbody>
      {results.map((result, i) => {
        return <tr key={result.tweet_id} className="tweet-row" onClick={e => selectTweet(i)}>
          <td>{result.user_name} (@{result.screen_name})</td>
          <td>{result.text}</td>
          <td>{result.favorite_count}</td>
          <td>{result.retweet_count}</td>
          <td>{result.tweet_id}</td>
        </tr>
      })}
    </tbody>
  </table>
}

export default DataTable;
