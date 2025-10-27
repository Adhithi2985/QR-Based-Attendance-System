package com.college.attendance.repository;

import com.college.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {
    Student findByRegisterNumberAndPassword(String registerNumber, String password);
    Student findTopByRegisterNumber(String registerNumber);
    List<Student> findByYearAndDepartmentAndSection(String year, String department, String section);
    Student findByRegisterNumber(String registerNumber);

}





