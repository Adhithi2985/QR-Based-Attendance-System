package com.college.attendance.controller;

import com.college.attendance.model.QRCode;
import com.college.attendance.repository.QRCodeRepository;
import com.college.attendance.request.QRCodeRequest;
import com.college.attendance.util.QRCodeGenerator;
import com.google.zxing.WriterException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/qr")
@CrossOrigin(origins = "*")
public class QRCodeController {

    @Autowired
    private QRCodeRepository qrCodeRepository;

    // ✅ POST: Generate QR Code
    @PostMapping("/generate")
    public ResponseEntity<?> generateQR(@RequestBody QRCodeRequest request)
            throws WriterException, IOException {

        if (request.getLatitude() == null || request.getLongitude() == null) {
            return ResponseEntity.badRequest().body("❌ Missing latitude or longitude");
        }

        if (request.getClassName() == null || request.getClassName().isBlank() ||
                request.getSubjectName() == null || request.getSubjectName().isBlank()) {
            return ResponseEntity.badRequest().body("❌ Missing class or subject name");
        }

        LocalDateTime now = LocalDateTime.now();
        String qrValue = "QR_" + now.format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String base64QR = QRCodeGenerator.generateQRCode(qrValue, 250, 250);

        System.out.println("\n📥 QR Code Generation");
        System.out.println("➡️ Class     : " + request.getClassName());
        System.out.println("➡️ Subject   : " + request.getSubjectName());
        System.out.println("📍 Latitude  : " + request.getLatitude());
        System.out.println("📍 Longitude : " + request.getLongitude());

        QRCode qrCode = new QRCode();
        qrCode.setQrValue(qrValue);
        qrCode.setClassName(request.getClassName().trim());
        qrCode.setSubjectName(request.getSubjectName().trim());
        qrCode.setGeneratedAt(now);
        qrCode.setExpiresAt(now.plusMinutes(5));
        qrCode.setLatitude(request.getLatitude());
        qrCode.setLongitude(request.getLongitude());
        qrCodeRepository.save(qrCode);

        System.out.println("✅ QR Code saved to database: " + qrValue);

        Map<String, Object> response = new HashMap<>();
        response.put("qrValue", qrValue);
        response.put("image", base64QR);
        response.put("className", qrCode.getClassName());
        response.put("subjectName", qrCode.getSubjectName());
        response.put("expiresAt", qrCode.getExpiresAt().toString());
        response.put("latitude", qrCode.getLatitude());
        response.put("longitude", qrCode.getLongitude());

        return ResponseEntity.ok(response);
    }

    // ✅ GET: Validate QR Code
    @GetMapping("/validate")
    public ResponseEntity<String> validateQR(@RequestParam String qrValue) {
        List<QRCode> qrCodes = qrCodeRepository.findByQrValue(qrValue.trim());

        if (qrCodes == null || qrCodes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ QR code not found");
        }

        // pick latest unexpired QR
        QRCode latestValidQR = null;
        for (QRCode qr : qrCodes) {
            if (LocalDateTime.now().isBefore(qr.getExpiresAt())) {
                latestValidQR = qr;
                break;
            }
        }

        if (latestValidQR == null) {
            return ResponseEntity.status(HttpStatus.GONE).body("❌ QR code expired");
        }

        return ResponseEntity.ok("✅ QR code valid");
    }

    // ✅ GET: QR History by Class and Subject (or filter by teacher later if needed)
    @GetMapping("/history")
    public ResponseEntity<?> getQRHistory() {
        List<QRCode> qrCodes = qrCodeRepository.findAll(Sort.by(Sort.Direction.DESC, "generatedAt"));

        List<Map<String, Object>> response = new ArrayList<>();
        for (QRCode qr : qrCodes) {
            Map<String, Object> qrData = new HashMap<>();
            qrData.put("id", qr.getId());
            qrData.put("qrValue", qr.getQrValue());
            qrData.put("className", qr.getClassName());
            qrData.put("subjectName", qr.getSubjectName());
            qrData.put("generatedAt", qr.getGeneratedAt());
            qrData.put("expiresAt", qr.getExpiresAt());
            response.add(qrData);
        }

        return ResponseEntity.ok(response);
    }
}