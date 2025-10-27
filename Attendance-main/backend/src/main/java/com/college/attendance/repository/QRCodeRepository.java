package com.college.attendance.repository;

import com.college.attendance.model.QRCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface QRCodeRepository extends JpaRepository<QRCode, Long> {
    List<QRCode> findByQrValue(String qrValue);
}
