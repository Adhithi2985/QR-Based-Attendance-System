package com.college.attendance.controller;

import com.college.attendance.model.TimeTable;
import com.college.attendance.service.TimeTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*")
public class TimeTableController {

    @Autowired
    private TimeTableService timeTableService;

    // 🔹 Get full timetable for student
    @GetMapping("/student/{regNo}")
    public ResponseEntity<List<TimeTable>> getTimeTableForStudent(@PathVariable String regNo) {
        List<TimeTable> timetable = timeTableService.getTimeTableForStudent(regNo);
        return ResponseEntity.ok(timetable);
    }

    // 🔹 Get today's classes for student
    @GetMapping("/student/{regNo}/today")
    public ResponseEntity<List<TimeTable>> getTodayTimeTableForStudent(@PathVariable String regNo) {
        String today = LocalDate.now().getDayOfWeek().toString(); // MONDAY, TUESDAY etc.
        today = today.charAt(0) + today.substring(1).toLowerCase(); // "Monday", "Tuesday", etc.

        List<TimeTable> todayClasses = timeTableService.getTodayTimeTableForStudent(regNo, today);
        return ResponseEntity.ok(todayClasses);
    }
}