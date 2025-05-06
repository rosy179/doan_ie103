package com.library.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "SACH")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long MASACH;
    
    private String TENSACH;
    private Long MANXB;
    private String NAMXB;
    private Long TAIBAN;
    private String NGONNGU;
    private Long SOLUONG;
    private String CHUTHICH;
    private String TINHTRANG;

    // getters và setters
    public Long getMASACH() {
        return MASACH;
    }
    public void setMASACH(Long MASACH) {
        this.MASACH = MASACH;
    }
    public String getTENSACH() {
        return TENSACH;
    }
    public void setTENSACH(String TENSACH) {
        this.TENSACH = TENSACH;
    }
    public Long getMANXB() {
        return MANXB;
    }
    public void setMANXB(Long MANXB) {
        this.MANXB = MANXB;
    }
    public String getNAMXB() {
        return NAMXB;
    }
    public void setNAMXB(String NAMXB) {
        this.NAMXB = NAMXB;
    }
    public Long getTAIBAN() {
        return TAIBAN;
    }
    public void setTAIBAN(Long TAIBAN) {
        this.TAIBAN = TAIBAN;
    }
    public String getNGONNGU() {
        return NGONNGU;
    }
    public void setNGONNGU(String NGONNGU) {
        this.NGONNGU = NGONNGU;
    }
    public Long getSOLUONG() {
        return SOLUONG;
    }
    public void setSOLUONG(Long SOLUONG) {
        this.SOLUONG = SOLUONG;
    }
    public String getCHUTHICH() {
        return CHUTHICH;
    }
    public void setCHUTHICH(String CHUTHICH) {
        this.CHUTHICH = CHUTHICH;
    }
    public String getTINHTRANG() {
        return TINHTRANG;
    }
    public void setTINHTRANG(String TINHTRANG) {
        this.TINHTRANG = TINHTRANG;
    }
    
}

