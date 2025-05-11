package com.library.demo.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "SACH")
@Data
public class Sach {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MASACH")
    private Integer maSach;

    @Column(name = "TENSACH")
    private String tenSach;

    @Column(name = "GIA")
    private Integer gia;

    @Column(name = "NAMXB")
    private Integer namXB;

    @Column(name = "SOLUONG")
    private Integer soLuong;

    @Column(name = "TINHTRANG")
    private String tinhTrang;

    @ManyToOne
    @JoinColumn(name = "MANXB")
    private NXB nxb;

    @ManyToMany
    @JoinTable(
        name = "THELOAI_SACH",
        joinColumns = @JoinColumn(name = "MASACH"),
        inverseJoinColumns = @JoinColumn(name = "MATL")
    )
    private List<TheLoai> theLoais;

    @ManyToMany
    @JoinTable(
        name = "TACGIA_SACH",
        joinColumns = @JoinColumn(name = "MASACH"),
        inverseJoinColumns = @JoinColumn(name = "MATG")
    )
    private List<TacGia> tacGias;
}