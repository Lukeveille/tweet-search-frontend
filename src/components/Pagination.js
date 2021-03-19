const Pagination = props => {
  const {
    size,
    results,
    pageCount,
    paginationLimit,
    currentPage,
    pages,
    perPage,
    setPageSize,
    changePage,
    firstPage,
    lastPage
  } = props
  
  return <div>
    {size > perPage? <div>
      
      {pageCount > paginationLimit && currentPage > 1? <span>
        <span className="pagination-num" onClick={firstPage}>{"<"}</span>
      </span> : ''}
      
      {pages.map(num => ( 
        <span
          key={num}
          className={`pagination-num${currentPage === num? ' selected-page' : ''}`}
          onClick={() => changePage(num)}
        >
          {num}
        </span>
      ))}

      {pageCount > paginationLimit && currentPage < pageCount? <span>
        <span className="pagination-num" onClick={lastPage}>{">"}</span>
      </span> : ''}

    </div> : ''}

    {results? <div>
      <small>results per page </small>
      <select className="page-size" value={perPage} onChange={setPageSize}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div> : ''}

  </div>
}

export default Pagination;
