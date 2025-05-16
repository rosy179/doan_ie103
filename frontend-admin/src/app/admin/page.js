"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Edit, Trash, Plus, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Button } from "@/app/components/Button";

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
  if (Array.isArray(hinhAnh) && hinhAnh.length > 0 && hinhAnh[0]) {
    const encodedUrl = encodeURIComponent(hinhAnh[0]);
    return `http://localhost:8080/api/books/image-proxy?url=${encodedUrl}`;
  }
  return "/placeholder.jpg";
};

const Page = () => {
  const [keyword, setKeyword] = useState("");
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    tenSach: "",
    tenTacGias: "",
    tenTheLoais: "",
    tenNXB: "",
    namXB: "",
    gia: "",
    soLuong: "",
    tinhTrang: "Đầy đủ sách",
    hinhAnh: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.tenSach.trim()) errors.tenSach = "Tên sách là bắt buộc";
    if (!formData.tenTacGias.trim()) errors.tenTacGias = "Tác giả là bắt buộc";
    if (!formData.tenTheLoais.trim())
      errors.tenTheLoais = "Thể loại là bắt buộc";
    if (!formData.tenNXB.trim()) errors.tenNXB = "Nhà xuất bản là bắt buộc";
    if (formData.namXB && !/^\d{4}$/.test(formData.namXB))
      errors.namXB = "Năm xuất bản phải là số 4 chữ số";
    if (formData.gia && isNaN(formData.gia)) errors.gia = "Giá phải là số";
    if (formData.soLuong && isNaN(formData.soLuong))
      errors.soLuong = "Số lượng phải là số";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/books/upload-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.url;
    } catch (err) {
      toast.error(
        "Không thể tải ảnh: " + (err.response?.data?.error || err.message)
      );
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async (e, page = 0) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/books/search",
        {
          params: { keyword, page, size: 12 },
        }
      );
      if (response.data && Array.isArray(response.data.content)) {
        setBooks(response.data.content);
        setTotalPages(response.data.totalPages || 0);
        setCurrentPage(page);
      } else {
        throw new Error("Dữ liệu trả về không đúng định dạng");
      }
    } catch (err) {
      setError(
        `Không thể tải danh sách sách: ${
          err.response?.data?.error || err.message
        }`
      );
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(null, newPage);
  };

  const handleAddOrEditBook = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.hinhAnh;
      if (formData.hinhAnh instanceof File) {
        imageUrl = await handleImageUpload(formData.hinhAnh);
      }

      const data = {
        tenSach: formData.tenSach,
        tenTacGias: formData.tenTacGias
          ? formData.tenTacGias.split(",").map((s) => s.trim())
          : [],
        tenTheLoais: formData.tenTheLoais
          ? formData.tenTheLoais.split(",").map((s) => s.trim())
          : [],
        tenNXB: formData.tenNXB,
        namXB: formData.namXB,
        gia: parseFloat(formData.gia) || 0,
        soLuong: parseInt(formData.soLuong) || 0,
        tinhTrang: formData.tinhTrang,
        hinhAnh: imageUrl
          ? [imageUrl]
          : formData.hinhAnh
          ? [formData.hinhAnh]
          : [],
      };

      if (editingBook) {
        await axios.put(
          `http://localhost:8080/api/books/${editingBook.maSach}`,
          data
        );
        toast.success("Cập nhật sách thành công!");
      } else {
        await axios.post("http://localhost:8080/api/books", data);
        toast.success("Thêm sách thành công!");
      }

      setIsModalOpen(false);
      setEditingBook(null);
      setFormData({
        tenSach: "",
        tenTacGias: "",
        tenTheLoais: "",
        tenNXB: "",
        namXB: "",
        gia: "",
        soLuong: "",
        tinhTrang: "Đầy đủ sách",
        hinhAnh: null,
      });
      handleSearch(null, currentPage);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Lỗi không xác định";
      setError(`Không thể lưu sách: ${errorMessage}`);
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (maSach) => {
    if (!confirm("Bạn có chắc muốn xóa sách này?")) return;

    setLoading(true);
    setError(null);

    try {
      await axios.delete(`http://localhost:8080/api/books/${maSach}`);
      toast.success("Xóa sách thành công!");
      handleSearch(null, currentPage);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Lỗi không xác định";
      setError(`Không thể xóa sách: ${errorMessage}`);
      toast.error(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      tenSach: book.tenSach || "",
      tenTacGias: book.tenTacGias?.join(", ") || "",
      tenTheLoais: book.tenTheLoais?.join(", ") || "",
      tenNXB: book.tenNXB || "",
      namXB: book.namXB || "",
      gia: book.gia || "",
      soLuong: book.soLuong || "",
      tinhTrang: book.tinhTrang || "Đầy đủ sách",
      hinhAnh: book.hinhAnh?.[0] || null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    setFormData({
      tenSach: "",
      tenTacGias: "",
      tenTheLoais: "",
      tenNXB: "",
      namXB: "",
      gia: "",
      soLuong: "",
      tinhTrang: "Đầy đủ sách",
      hinhAnh: null,
    });
    setFormErrors({});
  };

  useEffect(() => {
    handleSearch(null);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-amber-50 p-6">
      {/* Header */}
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Quản Lý Thư Viện
        </h1>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md backdrop-blur-sm mt-5 w-full mb-6"
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

        {/* Add Book Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 mb-6"
        >
          <Plus className="w-5 h-5" /> Thêm sách
        </Button>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Book List */}
        {books.length > 0 ? (
          <div className="w-full max-w-6xl mb-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {keyword ? "Kết quả tìm kiếm" : "Danh sách sách"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => {
                const { label, icon } = statusMap[book.tinhTrang] || {
                  label: "Chưa rõ",
                  icon: <XCircle className="text-gray-500" />,
                };
                return (
                  <div
                    key={book.maSach}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-end">
                      <div className="flex justify-items-right bg-amber-100 rounded-full shadow-md w-fit px-4 py-2">
                        <p className="flex items-center gap-2 text-s font-semibold">
                          {icon} {label}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <Image
                        src={getImageSrc(book.hinhAnh)}
                        alt={book.tenSach}
                        width={200}
                        height={280}
                        className="mx-auto rounded-lg h-[230px] shadow-lg object-contain"
                        placeholder="blur"
                        blurDataURL="/placeholder.jpg"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          onClick={() => openEditModal(book)}
                          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteBook(book.maSach)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          disabled={loading}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 w-full p-4">
                      <div className="flex mt-3 justify-items-center justify-center h-[50px]">
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
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0 || loading}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
                >
                  Trang trước
                </Button>
                <span className="self-center">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1 || loading}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
                >
                  Trang sau
                </Button>
              </div>
            )}
          </div>
        ) : (
          !loading &&
          !error && (
            <p className="text-gray-500 mt-6">
              {keyword
                ? `Không tìm thấy sách với từ khóa "${keyword}"`
                : "Không có sách nào để hiển thị"}
            </p>
          )
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingBook ? "Chỉnh sửa sách" : "Thêm sách"}
                </h2>
                <Button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </Button>
              </div>
              <form onSubmit={handleAddOrEditBook}>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-0">
                  <label className="block text-sm font-medium text-gray-700">
                    Tên sách
                  </label>
                  <input
                    type="text"
                    value={formData.tenSach}
                    onChange={(e) =>
                      setFormData({ ...formData, tenSach: e.target.value })
                    }
                    className={`mt-1 w-full p-2 border rounded-lg ${
                      formErrors.tenSach ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.tenSach && (
                    <p className="text-red-500 text-sm">{formErrors.tenSach}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-0">
                  <label className="block items-center text-sm font-medium text-gray-700">
                    Tác giả (phân tách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={formData.tenTacGias}
                    onChange={(e) =>
                      setFormData({ ...formData, tenTacGias: e.target.value })
                    }
                    className={`mt-1 w-full p-2 border rounded-lg ${
                      formErrors.tenTacGias
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Tác giả 1, Tác giả 2"
                  />
                  {formErrors.tenTacGias && (
                    <p className="text-red-500 text-sm">
                      {formErrors.tenTacGias}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-0">
                  <label className="block text-sm font-medium text-gray-700">
                    Thể loại (phân tách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={formData.tenTheLoais}
                    onChange={(e) =>
                      setFormData({ ...formData, tenTheLoais: e.target.value })
                    }
                    className={`mt-1 w-full p-2 border rounded-lg ${
                      formErrors.tenTheLoais
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Thể loại 1, Thể loại 2"
                  />
                  {formErrors.tenTheLoais && (
                    <p className="text-red-500 text-sm">
                      {formErrors.tenTheLoais}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-0">
                  <label className="block text-sm font-medium text-gray-700">
                    Nhà xuất bản
                  </label>
                  <input
                    type="text"
                    value={formData.tenNXB}
                    onChange={(e) =>
                      setFormData({ ...formData, tenNXB: e.target.value })
                    }
                    className={`mt-1 w-full p-2 border rounded-lg ${
                      formErrors.tenNXB ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.tenNXB && (
                    <p className="text-red-500 text-sm">{formErrors.tenNXB}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-0">
                  <label className="block text-sm font-medium text-gray-700">
                    Năm xuất bản
                  </label>
                  <input
                    type="text"
                    value={formData.namXB}
                    onChange={(e) =>
                      setFormData({ ...formData, namXB: e.target.value })
                    }
                    className={`mt-1 w-full p-2 border rounded-lg ${
                      formErrors.namXB ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="VD: 2023"
                  />
                  {formErrors.namXB && (
                    <p className="text-red-500 text-sm">{formErrors.namXB}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-0">
                  <label className="block text-sm font-medium text-gray-700">
                    Giá
                  </label>
                  <input
                    type="text"
                    value={formData.gia}
                    onChange={(e) =>
                      setFormData({ ...formData, gia: e.target.value })
                    }
                    className={`mt-1 w-full p-2 border rounded-lg ${
                      formErrors.gia ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="VD: 50000"
                  />
                  {formErrors.gia && (
                    <p className="text-red-500 text-sm">{formErrors.gia}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-0">
                  <label className="block text-sm font-medium text-gray-700">
                    Số lượng
                  </label>
                  <input
                    type="text"
                    value={formData.soLuong}
                    onChange={(e) =>
                      setFormData({ ...formData, soLuong: e.target.value })
                    }
                    className={`mt-1 w-full p-2 border rounded-lg ${
                      formErrors.soLuong ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="VD: 10"
                  />
                  {formErrors.soLuong && (
                    <p className="text-red-500 text-sm">{formErrors.soLuong}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-0">
                  <label className="block text-sm font-medium text-gray-700">
                    Tình trạng
                  </label>
                  <select
                    value={formData.tinhTrang}
                    onChange={(e) =>
                      setFormData({ ...formData, tinhTrang: e.target.value })
                    }
                    className="mt-1 w-full p-2 border rounded-lg border-gray-300"
                  >
                    <option value="Đầy đủ sách">Đầy đủ sách</option>
                    <option value="Hết sách">Hết sách</option>
                    <option value="Thiếu sách">Thiếu sách</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2 mb-0">
                  <label className="block text-sm font-medium text-gray-700">
                    Hình ảnh
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, hinhAnh: e.target.files[0] })
                    }
                    className="mt-1 w-full p-2 border rounded-lg border-gray-300"
                  />
                </div>
                <div className="flex justify-end mt-6 gap-2">
                  <Button
                    type="Button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    disabled={loading || uploading}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className={`px-4 py-2 rounded-lg text-white ${
                      loading || uploading
                        ? "bg-gray-400"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={loading || uploading}
                  >
                    {loading || uploading ? "Đang xử lý..." : "Lưu"}
                  </Button>
                </div>
              </form>
              {uploading && (
                <p className="text-yellow-500 mt-2">Đang tải ảnh...</p>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
