package com.college.attendance.controller;

import com.college.attendance.model.ClassSession;
import com.college.attendance.repository.ClassSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin
public class ClassController {

    @Autowired
    private ClassSessionRepository classRepo;

    // ✅ Create a new class session
    @PostMapping
    public ClassSession createClass(@RequestBody ClassSession session) {
        return classRepo.save(session);
    }

    // ✅ Get all class sessions
    @GetMapping
    public List<ClassSession> getAllClasses() {
        return classRepo.findAll();
    }

    // ✅ Get class sessions for a specific teacher by teacherId
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<ClassSession>> getByTeacher(@PathVariable String teacherId) {
        List<ClassSession> sessions = classRepo.findByTeacher_TeacherId(teacherId);
        return ResponseEntity.ok(sessions);
    }
}