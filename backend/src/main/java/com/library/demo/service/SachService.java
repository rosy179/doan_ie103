package com.library.demo.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ibm.icu.text.Transliterator;
import com.library.demo.DTO.SachDTO;
import com.library.demo.model.IMGS;
import com.library.demo.model.Sach;
import com.library.demo.model.TacGia;
import com.library.demo.model.TheLoai;
import com.library.demo.repository.ImgRepository;
import com.library.demo.repository.SachRepository;


@Service
public class SachService {
    @Autowired
    private GoogleBooksService googleBooksService;

    @Autowired
    private SachRepository sachRepository;

    @Autowired
    private ImgRepository imgRepository;

    public Page<SachDTO> searchBooks(String keyword, Pageable pageable) {
        // Chuẩn hóa từ khóa (bỏ dấu)
        String normalizedKeyword = normalizeKeyword(keyword);
        Page<Sach> sachPage = sachRepository.searchBooks(normalizedKeyword, pageable);
        return sachPage.map(this::convertToDTO);
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return null;
        }
        // Bỏ dấu tiếng Việt
        Transliterator transliterator = Transliterator.getInstance("NFD; [:Nonspacing Mark:] Remove; NFC");
        String normalized = transliterator.transliterate(keyword);
        return normalized.trim();
    }

    // public Page<SachDTO> searchBooks(String keyword, Pageable pageable) {
    //     if (keyword == null || keyword.trim().isEmpty()) {
    //         return sachRepository.findAll(pageable).map(this::convertToDTO);
    //     }
    //     return sachRepository
    //             .findByTenSachContainingIgnoreCaseOrTacGias_TenTacGiaContainingIgnoreCase(
    //                     keyword, keyword, pageable)
    //             .map(this::convertToDTO);
    // }

    public Page<SachDTO> getAllBooks(Pageable pageable) {
        return sachRepository.findAll(pageable).map(this::convertToDTO);
    }

    private SachDTO convertToDTO(Sach sach) {
        SachDTO dto = new SachDTO();
        dto.setMaSach(sach.getMaSach());
        dto.setTenSach(sach.getTenSach());
        dto.setTenTacGias(sach.getTacGias().stream()
                .map(TacGia::getTenTG)
                .collect(Collectors.toList()));
        dto.setTenTheLoais(sach.getTheLoais().stream()
                .map(TheLoai::getTenTheLoai)
                .collect(Collectors.toList()));
        dto.setTenNXB(sach.getNxb().getTenNXB());
        dto.setTinhTrang(sach.getTinhTrang());
        dto.setGia(sach.getGia());
        dto.setSoLuong(sach.getSoLuong());

        // // Lấy hình ảnh từ Google Books API
        // String author = sach.getTacGias().isEmpty() ? "" : sach.getTacGias().get(0).getTenTG();
        // String imageUrl = googleBooksService.getBookCoverUrl(sach.getTenSach(), author);
        // dto.setHinhAnh(imageUrl != null ? Collections.singletonList(imageUrl) : Collections.emptyList());
        // Kiểm tra bảng IMGS
    List<String> hinhAnh = imgRepository.findByMaSach(sach.getMaSach())
            .stream()
            .map(IMGS::getImg)
            .collect(Collectors.toList());

    // Nếu không có hình ảnh trong IMGS, gọi Google Books API
    if (hinhAnh.isEmpty()) {
        String author = sach.getTacGias().isEmpty() ? "" : sach.getTacGias().get(0).getTenTG();
        String imageUrl = googleBooksService.getBookCoverUrl(sach.getTenSach(), author);
        if (imageUrl != null) {
            hinhAnh = Collections.singletonList(imageUrl);
            // Lưu vào bảng IMGS
            IMGS img = new IMGS();
            img.setMaSach(sach.getMaSach());
            img.setImg(imageUrl);
            imgRepository.save(img);
        }
    }

    dto.setHinhAnh(hinhAnh);
    return dto;

    }
}