package com.college.attendance.repository;

import com.college.attendance.model.Attendance;
import com.college.attendance.model.Student;
import com.college.attendance.model.QRCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentAndQrCode(Student student, QRCode qrCode);
    List<Attendance> findByQrCodeId(Long qrCodeId);
    List<Attendance> findByStudentRegisterNumber(String registerNumber);
}