package com.library.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.library.demo.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
   @Query("SELECT b FROM Book b WHERE LOWER(b.TINHTRANG) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Book> searchByTinhTrang(@Param("keyword") String keyword);
}
