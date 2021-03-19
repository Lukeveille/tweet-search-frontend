const DataTable = props => {
  const { results, selectTweets } = props
  return <table>
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
        return <tr key={result.tweet_id} className="tweet-row" onClick={e => selectTweets(i)}>
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
