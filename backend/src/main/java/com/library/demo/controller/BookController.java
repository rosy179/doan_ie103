package com.library.demo.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.library.demo.model.Book;
import com.library.demo.repository.BookRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // cho phép frontend truy cập
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/books/search")
    public List<Book> searchBooks(@RequestParam String keyword) {
        return bookRepository.searchByTinhTrang(keyword);
    }
}