package com.library.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.library.demo.model.Sach;

public interface SachRepository extends JpaRepository<Sach, Integer> {
    @Query("SELECT s FROM Sach s " +
           "JOIN s.theLoais tl " +
           "JOIN s.tacGias tg " +
           "JOIN s.nxb nxb " +
           "WHERE (:keyword IS NULL OR " +
           "LOWER(FUNCTION('TRANSLATE', s.tenSach, 'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ', 'aaaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd')) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(FUNCTION('TRANSLATE', tl.tenTheLoai, 'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ', 'aaaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd')) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(FUNCTION('TRANSLATE', tg.tenTG, 'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ', 'aaaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd')) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(FUNCTION('TRANSLATE', nxb.tenNXB, 'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ', 'aaaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd')) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Sach> searchBooks(@Param("keyword") String keyword, Pageable pageable);
}