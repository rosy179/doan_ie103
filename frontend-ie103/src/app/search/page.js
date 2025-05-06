"use client";
import { useState } from "react";
import axios from "axios";

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (mode === "all") {
      setQ("");
      return;
    }

    const params = {};
    if (mode === "topBorrowed") {
      params.sortByBorrowCount = true;
    } else if (mode === "author") {
      params.author = q;
    } else if (mode === "category") {
      params.category = q;
    } else if (mode === "publisher") {
      params.publisher = q;
    } else if (mode === "year") {
      if (/^\d{4}$/.test(q.trim())) params.year = Number(q.trim());
      else {
        alert("Nhập năm theo dạng YYYY");
        return;
      }
    } else if (mode === "title") {
      params.title = q;
    }

    // chưa kết nối được với backend
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/books/search",
        { params }
      );
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center  h-screen bg-gray-100">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow backdrop-blur-sm mt-5"
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/669888cc237b300e928dbfd847b76e4236ef4b5a?apiKey=…"
          alt="search"
          className="w-6 h-6"
        />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Nhập từ khóa..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded-full ml-2"
        >
          Tìm
        </button>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong> - {book.author} (
              {book.publishedYear})
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
};
export default SearchPage;
