package com.library.demo.controller;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.library.demo.DTO.SachDTO;
import com.library.demo.service.SachService;


@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class SachController {
    @Autowired
    private SachService sachService;

    @GetMapping("/search")
    public ResponseEntity<Page<SachDTO>> searchBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SachDTO> books = sachService.searchBooks(keyword, pageable);
        return ResponseEntity.ok(books);
    }

    @GetMapping
    public ResponseEntity<Page<SachDTO>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SachDTO> books = sachService.getAllBooks(pageable);
        return ResponseEntity.ok(books);
    }
    // SachController.java
@GetMapping("/image-proxy")
public ResponseEntity<byte[]> proxyImage(@RequestParam String url) throws IOException {
    HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
    connection.setRequestMethod("GET");
    InputStream inputStream = connection.getInputStream();
    byte[] imageBytes = inputStream.readAllBytes();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.IMAGE_JPEG);
    return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
}
}