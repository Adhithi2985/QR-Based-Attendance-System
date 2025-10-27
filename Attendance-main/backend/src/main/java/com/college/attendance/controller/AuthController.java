package com.college.attendance.controller;

import com.college.attendance.model.Student;
import com.college.attendance.model.Teacher;
import com.college.attendance.repository.StudentRepository;
import com.college.attendance.repository.TeacherRepository;
import com.college.attendance.request.LoginRequest;
import com.college.attendance.request.StudentRegisterRequest;
import com.college.attendance.response.LoginResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @PostMapping("/register-student")
    public ResponseEntity<String> registerStudent(@RequestBody StudentRegisterRequest request) {
        Student student = new Student();
        student.setName(request.getName());
        student.setRegisterNumber(request.getRegisterNumber());
        student.setPassword(request.getPassword()); // 🔐 Consider hashing in real applications

        studentRepository.save(student);
        return ResponseEntity.ok("Student registered successfully");
    }

    @PostMapping("/teacher/register")
    public ResponseEntity<String> registerTeacher(@RequestBody Teacher teacher) {
        teacherRepository.save(teacher);
        return ResponseEntity.ok("Teacher registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.getRole().equalsIgnoreCase("student")) {
            Student student = studentRepository.findTopByRegisterNumber(request.getId());

            if (student != null && student.getPassword().equals(request.getPassword())) {
                LoginResponse response = new LoginResponse("success", student.getRegisterNumber(), student.getName());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid student credentials");
            }

        } else if (request.getRole().equalsIgnoreCase("teacher")) {
            Teacher teacher = teacherRepository.findByTeacherIdAndPassword(request.getId(), request.getPassword());

            if (teacher != null && teacher.getPassword().equals(request.getPassword())) {
                // 🧠 Return internal DB ID for profile fetching
                LoginResponse response = new LoginResponse("success", teacher.getTeacherId(), teacher.getName(), teacher.getId());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid teacher credentials");
            }

        } else {
            return ResponseEntity.badRequest().body("Invalid role");
        }
    }
}