export const Pagination = ({ productsPage, totalProducts, paginate }) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalProducts / productsPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav>
      <ul>
        {pageNumbers.map(number => (
          <li key={number}>
            <a href='!#' onClick={() => paginate(number)}>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
