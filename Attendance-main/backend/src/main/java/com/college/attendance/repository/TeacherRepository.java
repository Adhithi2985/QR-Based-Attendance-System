package com.college.attendance.repository;

import com.college.attendance.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, String> {
    Teacher findByTeacherIdAndPassword(String teacherId, String password);
}

