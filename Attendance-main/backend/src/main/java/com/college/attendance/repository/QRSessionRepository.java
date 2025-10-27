package com.college.attendance.repository;

import com.college.attendance.model.QRSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QRSessionRepository extends JpaRepository<QRSession, Long> {}