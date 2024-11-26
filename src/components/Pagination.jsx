"use client";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  
  const getPageNumbers = () => {
    const pages = [];
    const numPages = Math.max(totalPages , 1);
    for (let i = 0; i < numPages; i++) {
      pages.push(i);
    }
    return pages;
  };
  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-2 rounded-sm ${
              currentPage === page ? "bg-lamaSky" : ""
            }`}
          >
            {page + 1}
          </button>
        ))}
      </div>
      <button
        disabled={currentPage === totalPages-1}
        onClick={() => onPageChange(currentPage + 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
