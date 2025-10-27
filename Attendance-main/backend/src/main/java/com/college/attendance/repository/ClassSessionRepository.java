package com.college.attendance.repository;

import com.college.attendance.model.ClassSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {
    List<ClassSession> findByTeacher_TeacherId(String teacherId);
    List<ClassSession> findByClassName(String className);
}