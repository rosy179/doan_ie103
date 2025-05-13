"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/app/components/Button";
import Image from "next/image";

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

  const getImageSrc = (hinhAnh) => {
    {
      /*if (hinhAnh?.length > 0 && hinhAnh[0]) {*/
    }
    console.log("hinhAnh raw data:", hinhAnh); // Log dữ liệu thô
    if (Array.isArray(hinhAnh) && hinhAnh.length > 0 && hinhAnh[0]) {
      const encodedUrl = encodeURIComponent(hinhAnh[0]);
      const proxyUrl = `http://localhost:8080/api/books/image-proxy?url=${encodedUrl}`;
      console.log("Generated proxy URL:", proxyUrl); // Log URL proxy
      return proxyUrl;
    }
    console.log("Falling back to default image");
    return "/download.jpg";
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
            size: 12,
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
      const errorMessage = err.response?.data
        ? `Lỗi từ server: ${err.response.data}`
        : `Không thể tải danh sách sách: ${
            err.message || "Lỗi không xác định"
          }. Vui lòng kiểm tra backend.`;
      setError(errorMessage);
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
    <div className="flex flex-col items-center min-h-screen bg-amber-50 p-4">
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
          className="bg-pink-300 hover:bg-pink-500 text-white px-4 py-1 rounded-full"
          disabled={loading}
        >
          {loading ? "Đang tìm..." : "Tìm"}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {books?.length > 0 ? (
        <div className="mt-4 w-full max-w-6xl mb-4">
          <h2 className="text-2xl font-semibold mb-4 bg-pink-300 text-white w-fit border-2 border-pink-300 rounded-full px-4 py-2 shadow-md">
            {keyword ? "Kết quả tìm kiếm" : "Tất cả sách"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => {
              const { label, icon, available } = statusMap[book.tinhTrang] || {
                label: "Còn sẵn",
                icon: <CheckCircle className="text-green-500" />,
                available: true,
              };
              console.log("Book image:", book.hinhAnh);
              console.log(
                "Rendering image for book",
                book.maSach,
                "hinhAnh:",
                book.hinhAnh
              );

              return (
                <div
                  key={book.maSach}
                  className="flex flex-col p-6 bg-white rounded-xl shadow-lg gap-4"
                >
                  <div className="flex justify-end">
                    <div className="flex justify-items-right bg-amber-100 rounded-full shadow-md w-fit px-4 py-2">
                      <p className="flex items-center gap-2 text-s font-semibold">
                        {icon} {label}
                      </p>
                    </div>
                  </div>
                  <Image
                    src={getImageSrc(book.hinhAnh)}
                    alt={book.tenSach || "Sách không rõ tiêu đề"}
                    width={160}
                    height={224}
                    className="mx-auto rounded-lg h-[230px] shadow-lg object-contain"
                    placeholder="blur"
                    blurDataURL="/download.jpg"
                    onError={() =>
                      console.error(
                        "Failed to load image for book",
                        book.maSach
                      )
                    }
                  />
                  <div className="flex-1 ">
                    <div className="flex mb-2 justify-items-center justify-center h-[55px]">
                      <h3 className="text-xl text-center font-semibold text-blue-900 line-clamp-2">
                        {book.tenSach || "Không rõ tiêu đề"}
                      </h3>
                    </div>
                    <p className="text-gray-700 font-semibold">
                      Tác giả: {book.tenTacGias?.join(", ") || "Không rõ"}
                    </p>
                    <p>
                      <span className="font-semibold">Thể loại:</span>{" "}
                      {book.tenTheLoais?.join(", ") || "Không rõ"}
                    </p>
                    <p>
                      <span className="font-semibold">NXB:</span>{" "}
                      {book.tenNXB || "Không rõ"}
                    </p>

                    <p>
                      <span className="font-semibold">Giá:</span>{" "}
                      {book.gia || 0} đ
                    </p>
                    <p>
                      <span className="font-semibold">Số lượng:</span>{" "}
                      {book.soLuong || 0}
                    </p>
                    <div className="flex justify-end mt-0">
                      <Button
                        disabled={!available}
                        variant={available ? "default" : "secondary"}
                        className={
                          available
                            ? "bg-blue-300 hover:bg-blue-400 hover:text-[#062D76] text-white"
                            : "bg-gray-300 text-gray-600"
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
