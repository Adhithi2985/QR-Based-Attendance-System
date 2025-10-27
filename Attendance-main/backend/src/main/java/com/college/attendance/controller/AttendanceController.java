package com.college.attendance.controller;

import com.college.attendance.model.Attendance;
import com.college.attendance.model.QRCode;
import com.college.attendance.model.Student;
import com.college.attendance.repository.AttendanceRepository;
import com.college.attendance.repository.QRCodeRepository;
import com.college.attendance.repository.StudentRepository;
import com.college.attendance.request.AttendanceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private QRCodeRepository qrCodeRepository;

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; // convert to meters
    }

    @PostMapping("/mark")
    public ResponseEntity<String> markAttendance(@RequestBody AttendanceRequest request) {
        System.out.println("📥 Incoming request:");
        System.out.println("➡️ Register Number: " + request.getRegisterNumber());
        System.out.println("➡️ QR Value: " + request.getQrValue());
        System.out.println("➡️ Student Location: (" + request.getLatitude() + ", " + request.getLongitude() + ")");

        // Step 1: Validate student
        Student student = studentRepository.findTopByRegisterNumber(request.getRegisterNumber().trim());
        if (student == null) {
            System.out.println("❌ Student not found");
            return ResponseEntity.badRequest().body("❌ Invalid student register number");
        }

        // Step 2: Fetch matching QR codes
        List<QRCode> qrCodes = qrCodeRepository.findByQrValue(request.getQrValue().trim());
        if (qrCodes == null || qrCodes.isEmpty()) {
            System.out.println("❌ QR Code not found");
            return ResponseEntity.badRequest().body("❌ Invalid QR code");
        }

        // Find latest unexpired QR
        QRCode validQr = null;
        for (QRCode qr : qrCodes) {
            if (LocalDateTime.now().isBefore(qr.getExpiresAt())) {
                validQr = qr;
                break;
            }
        }

        if (validQr == null) {
            return ResponseEntity.status(HttpStatus.GONE).body("❌ QR code has expired");
        }

        // Step 3: Geofencing
        Double classLat = validQr.getLatitude();
        Double classLon = validQr.getLongitude();
        Double studentLat = request.getLatitude();
        Double studentLon = request.getLongitude();

        if (classLat == null || classLon == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ QR code missing classroom coordinates");
        }

        if (studentLat == null || studentLon == null) {
            return ResponseEntity.badRequest().body("❌ Student GPS location missing");
        }

        double distance = calculateDistance(studentLat, studentLon, classLat, classLon);
        System.out.printf("📏 Distance from class: %.2f meters%n", distance);

        final double maxDistanceMeters = 10.0;

        if (distance > maxDistanceMeters) {
            return ResponseEntity.badRequest()
                    .body("❌ You are outside the classroom (" + Math.round(distance) + " m away)");
        }

        // Step 4: Check for duplicates using list
        List<Attendance> existing = attendanceRepository.findByStudentAndQrCode(student, validQr);
        if (!existing.isEmpty()) {
            return ResponseEntity.ok("✅ Attendance already marked");
        }

        // Step 5: Save attendance
        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setQrCode(validQr);
        attendance.setRegisterNumber(student.getRegisterNumber());
        attendance.setStatus("Present");
        attendance.setMarkedAt(LocalDateTime.now());
        attendanceRepository.save(attendance);

        System.out.println("✅ Attendance marked successfully for: " + student.getRegisterNumber());
        return ResponseEntity.ok("✅ Attendance marked successfully");
    }

    @GetMapping("/report/{qrCodeId}")
    public ResponseEntity<?> getAttendanceReport(@PathVariable Long qrCodeId) {
        List<Attendance> attendanceList = attendanceRepository.findByQrCodeId(qrCodeId);

        List<Map<String, Object>> report = new ArrayList<>();
        for (Attendance att : attendanceList) {
            Map<String, Object> data = new HashMap<>();
            data.put("registerNumber", att.getStudent().getRegisterNumber());
            data.put("status", "Present");
            data.put("markedAt", att.getTimestamp());
            report.add(data);
        }

        return ResponseEntity.ok(report);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllAttendance(
            @RequestParam(required = false) String className,
            @RequestParam(required = false) String subjectName,
            @RequestParam(required = false) String date
    ) {
        List<Attendance> all = attendanceRepository.findAll();

        List<Map<String, Object>> response = new ArrayList<>();

        for (Attendance att : all) {
            if (att.getStudent() == null || att.getQrCode() == null) continue;

            QRCode qr = att.getQrCode();

            // Filters
            if (className != null && !qr.getClassName().equalsIgnoreCase(className)) continue;
            if (subjectName != null && !qr.getSubjectName().equalsIgnoreCase(subjectName)) continue;

            if (date != null) {
                LocalDate target = LocalDate.parse(date);
                LocalDate markedDate = att.getMarkedAt().toLocalDate();
                if (!markedDate.equals(target)) continue;
            }

            Map<String, Object> data = new HashMap<>();
            data.put("registerNumber", att.getStudent().getRegisterNumber());
            data.put("className", qr.getClassName());
            data.put("subjectName", qr.getSubjectName());
            data.put("qrValue", qr.getQrValue());
            data.put("markedAt", att.getMarkedAt());
            data.put("status", "Present");

            response.add(data);
        }

        return ResponseEntity.ok(response);
    }
}