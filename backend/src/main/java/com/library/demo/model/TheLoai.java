package com.library.demo.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "THELOAI")
@Data
public class TheLoai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MATL")
    private Integer maTL;

    @Column(name = "TENTHELOAI")
    private String tenTheLoai;

    @ManyToMany(mappedBy = "theLoais")
    private List<Sach> sachs;
}
