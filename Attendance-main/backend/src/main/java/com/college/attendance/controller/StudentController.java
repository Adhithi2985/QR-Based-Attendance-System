package com.college.attendance.controller;

import com.college.attendance.model.Student;
import com.college.attendance.repository.StudentRepository;
import com.college.attendance.dto.SubjectAttendanceDTO;
import com.college.attendance.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")  // DIFFERENT base path to avoid conflict
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{regNo}")
    public ResponseEntity<Student> getStudentByRegNo(@PathVariable String regNo) {
        Student student = studentRepository.findTopByRegisterNumber(regNo);
        if (student != null) {
            return ResponseEntity.ok(student);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/class")
    public List<Student> getStudentsByClass(
            @RequestParam String year,
            @RequestParam String department,
            @RequestParam String section
    ) {
        return studentRepository.findByYearAndDepartmentAndSection(
                year.trim(), department.trim(), section.trim());
    }

    @Autowired
    private StudentService studentService;

    @GetMapping("/{regNo}/subject-attendance-summary")
    public ResponseEntity<List<SubjectAttendanceDTO>> getSubjectAttendanceSummary(@PathVariable String regNo) {
        List<SubjectAttendanceDTO> summary = studentService.getSubjectWiseAttendance(regNo);
        return ResponseEntity.ok(summary);
    }

}