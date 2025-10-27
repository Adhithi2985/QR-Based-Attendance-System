package com.college.attendance.controller;

import com.college.attendance.model.ClassSession;
import com.college.attendance.model.QRSession;
import com.college.attendance.repository.ClassSessionRepository;
import com.college.attendance.repository.QRSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/qr")
@CrossOrigin
public class QRSessionController {

    @Autowired
    private QRSessionRepository qrRepo;

    @Autowired
    private ClassSessionRepository classRepo;

    @PostMapping("/generate/{classId}")
    public QRSession generateQR(@PathVariable Long classId) {
        Optional<ClassSession> classSessionOpt = classRepo.findById(classId);
        if (classSessionOpt.isPresent()) {
            QRSession qr = new QRSession();
            qr.setClassSession(classSessionOpt.get());
            qr.setQrData(UUID.randomUUID().toString());
            qr.setGeneratedAt(LocalDateTime.now());
            return qrRepo.save(qr);
        }
        throw new RuntimeException("Class not found");
    }
}