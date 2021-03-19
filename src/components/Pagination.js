const Pagination = props => {
  const {
    pageCount,
    paginationLimit,
    currentPage,
    pages,
    firstPage,
    lastPage,
    changePage
  } = props
  
  return <div>
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

  </div>
}

export default Pagination;
