"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const SearchPage = () => {
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusMap = {
    "Đầy đủ sách": {
      label: "Còn sẵn",
      icon: <CheckCircle className="text-green-500" />,
      available: true,
    },
    "Hết sách": {
      label: "Đã hết",
      icon: <XCircle className="text-red-500" />,
      available: false,
    },
    "Thiếu sách": {
      label: "Thiếu sách",
      icon: <XCircle className="text-red-500" />,
      available: false,
    },
  };

  const handleSearch = async (e, page = 0) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:8080/api/books/search",
        {
          params: {
            keyword,
            page,
            size: 10,
          },
        }
      );

      console.log("API response:", response.data);

      if (response.data && Array.isArray(response.data.content)) {
        setBooks(response.data.content);
        setTotalPages(response.data.totalPages || 0);
        setCurrentPage(page);
      } else if (Array.isArray(response.data)) {
        setBooks(response.data);
        setTotalPages(1);
        setCurrentPage(0);
      } else {
        throw new Error(
          `Dữ liệu trả về không đúng định dạng. Response: ${JSON.stringify(
            response.data
          )}`
        );
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(
        `Không thể tải danh sách sách: ${
          err.message || "Lỗi không xác định"
        }. Vui lòng kiểm tra backend.`
      );
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(null, newPage);
  };

  useEffect(() => {
    handleSearch(null); // Gọi API để lấy tất cả sách khi trang tải
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md backdrop-blur-sm mt-5 w-full max-w-lg"
      >
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Nhập tên sách, tác giả, thể loại hoặc NXB..."
          className="flex-1 outline-none bg-transparent"
        />
        <Button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded-full"
          disabled={loading}
        >
          {loading ? "Đang tìm..." : "Tìm"}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {books?.length > 0 ? (
        <div className="mt-6 w-full max-w-7xl">
          <h2 className="text-2xl font-semibold mb-4">
            {keyword ? "Kết quả tìm kiếm" : "Tất cả sách"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => {
              console.log("Book image:", book.hinhAnh);
              const { label, icon, available } = statusMap[book.tinhTrang] || {
                label: "Không xác định",
                icon: <XCircle className="text-gray-500" />,
                available: false,
              };

              return (
                <div
                  key={book.maSach}
                  className="flex flex-col p-6 bg-white rounded-xl shadow-md h-[450px] gap-4"
                >
                  <Image
                    src={
                      book.hinhAnh?.[0]
                        ? `http://localhost:8080/api/image-proxy?url=${encodeURIComponent(
                            book.hinhAnh[0]
                          )}`
                        : "/download.jpg"
                    }
                    alt={book.tenSach}
                    width={160}
                    height={224}
                    className="mx-auto rounded-lg shadow-lg object-cover"
                    placeholder="blur"
                    blurDataURL="/download.jpg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl text-center font-semibold text-blue-900">
                      {book.tenSach}
                    </h3>
                    <p className="text-gray-700 font-semibold">
                      Tác giả: {book.tenTacGias.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold">Thể loại:</span>{" "}
                      {book.tenTheLoais.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold">NXB:</span> {book.tenNXB}
                    </p>
                    <p className="flex items-center gap-2 font-semibold text-m">
                      {icon}
                      {label}
                    </p>
                    <p>
                      <span className="font-semibold">Giá:</span> {book.gia} đ
                    </p>
                    <p>
                      <span className="font-semibold">Số lượng:</span>{" "}
                      {book.soLuong}
                    </p>

                    {/*Button muon sach*/}
                    <div className="flex gap-2">
                      <Button
                        disabled={!available}
                        variant={available ? "default" : "secondary"}
                        className={
                          available
                            ? "bg-[#062D76] hover:bg-[#E6EAF1] hover:text-[#062D76] text-white justify-end"
                            : "bg-gray-300 text-gray-600 justify-end"
                        }
                      >
                        Mượn sách
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                variant="outline"
                className="mx-2"
              >
                Trang trước
              </Button>
              <span className="mx-2 self-center">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1 || loading}
                variant="outline"
                className="mx-2"
              >
                Trang sau
              </Button>
            </div>
          )}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="mt-6 text-gray-500">
            {keyword
              ? `Không tìm thấy sách với từ khóa "${keyword}". Hãy thử từ khóa khác.`
              : "Không có sách nào để hiển thị."}
          </p>
        )
      )}

      {loading && <p className="mt-6 text-gray-500">Đang tải...</p>}
    </div>
  );
};

export default SearchPage;
