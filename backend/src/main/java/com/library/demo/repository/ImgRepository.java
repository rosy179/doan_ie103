package com.library.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.demo.model.IMGS;

public interface ImgRepository extends JpaRepository<IMGS, Integer> {
    List<IMGS> findByMaSach(int maSach);
}
