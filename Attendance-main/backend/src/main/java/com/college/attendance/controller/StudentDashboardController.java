package com.college.attendance.controller;

import com.college.attendance.model.*;
import com.college.attendance.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student-dashboard")
@CrossOrigin
public class StudentDashboardController {

    @Autowired private StudentRepository studentRepo;
    @Autowired private ClassSessionRepository classSessionRepo;
    @Autowired private AttendanceRepository attendanceRepo;

    // ✅ Profile data
    @GetMapping("/profile/{registerNumber}")
    public Student getProfile(@PathVariable String registerNumber) {
        return studentRepo.findByRegisterNumber(registerNumber);
    }

    // ✅ Today’s class session(s)
    @GetMapping("/today-class/{registerNumber}")
    public List<ClassSession> getTodayClasses(@PathVariable String registerNumber) {
        Student student = studentRepo.findByRegisterNumber(registerNumber);
        if (student == null) return Collections.emptyList();

        String className = student.getYear() + "-" + student.getDepartment() + "-" + student.getSection();
        LocalDate today = LocalDate.now();

        return classSessionRepo.findByClassName(className).stream()
                .filter(session -> session.getDate().equals(today))
                .collect(Collectors.toList());
    }

    // ✅ Attendance % summary
    @GetMapping("/attendance-summary/{registerNumber}")
    public Map<String, Object> getSummary(@PathVariable String registerNumber) {
        List<Attendance> list = attendanceRepo.findByStudentRegisterNumber(registerNumber);
        long total = list.size();
        long present = list.stream().filter(a -> "Present".equalsIgnoreCase(a.getStatus())).count();
        double percent = total > 0 ? ((double) present * 100 / total) : 0;

        Map<String, Object> res = new HashMap<>();
        res.put("present", present);
        res.put("total", total);
        res.put("percentage", percent);
        return res;
    }
}