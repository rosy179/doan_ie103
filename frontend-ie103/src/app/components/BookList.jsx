import React from "react";

const BookList = ({ books }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <div key={book.maSach} className="border p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{book.tenSach}</h3>
          <p>
            <strong>Tác giả:</strong> {book.tenTacGias.join(", ")}
          </p>
          <p>
            <strong>Thể loại:</strong> {book.tenTheLoais.join(", ")}
          </p>
          <p>
            <strong>Nhà xuất bản:</strong> {book.tenNXB}
          </p>
          <p>
            <strong>Năm xuất bản:</strong> {book.namXB}
          </p>
          <p>
            <strong>Giá:</strong> {book.gia} VND
          </p>
          <p>
            <strong>Số lượng:</strong> {book.soLuong}
          </p>
          <p>
            <strong>Tình trạng:</strong> {book.tinhTrang}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BookList;
