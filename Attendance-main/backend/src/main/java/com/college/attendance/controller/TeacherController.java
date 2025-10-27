package com.college.attendance.controller;

import com.college.attendance.model.Teacher;
import com.college.attendance.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin
public class TeacherController {

    @Autowired
    private TeacherRepository teacherRepository;

    // Fetch teacher profile by teacherId (which is a String)
    @GetMapping("/{teacherId}")
    public ResponseEntity<?> getTeacherById(@PathVariable String teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElse(null);

        if (teacher != null) {
            return ResponseEntity.ok(teacher);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}