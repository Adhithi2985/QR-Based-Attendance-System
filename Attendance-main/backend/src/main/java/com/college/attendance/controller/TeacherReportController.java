package com.college.attendance.controller;

import com.college.attendance.dto.DailyClassSummaryDTO;
import com.college.attendance.dto.DailyClassDetailDTO;
import com.college.attendance.service.TeacherReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/teacher-report")
@CrossOrigin(origins = "*")
public class TeacherReportController {

    @Autowired
    private TeacherReportService teacherReportService;

    /**
     * ✅ 1. Get all classes handled by teacher for a given date
     * Example: /api/teacher-report/classes/T001?date=2025-07-18
     */
    @GetMapping("/classes/{teacherId}")
    public ResponseEntity<List<DailyClassSummaryDTO>> getClassesForDate(
            @PathVariable String teacherId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<DailyClassSummaryDTO> classes = teacherReportService.getDailyClassSummary(teacherId, date);
        return ResponseEntity.ok(classes);
    }

    /**
     * ✅ 2. Get detailed attendance for a specific timetable entry
     * Example: /api/teacher-report/details/5?date=2025-07-18
     */
    @GetMapping("/details/{timeTableId}")
    public ResponseEntity<List<DailyClassDetailDTO>> getClassDetails(
            @PathVariable Long timeTableId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<DailyClassDetailDTO> details = teacherReportService.getDailyClassDetails(timeTableId, date);
        return ResponseEntity.ok(details);
    }
}