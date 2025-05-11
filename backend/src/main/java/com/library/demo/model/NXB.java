package com.library.demo.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "NXB")
@Data
public class NXB {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MANXB")
    private Integer maNXB;

    @Column(name = "TENNXB")
    private String tenNXB;

    @OneToMany(mappedBy = "nxb")
    private List<Sach> sachs;
}
