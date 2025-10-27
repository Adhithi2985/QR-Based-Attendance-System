package com.college.attendance.service;

import com.college.attendance.model.Student;
import com.college.attendance.model.TimeTable;
import com.college.attendance.repository.StudentRepository;
import com.college.attendance.repository.TimeTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimeTableService {

    @Autowired
    private TimeTableRepository timeTableRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<TimeTable> getTimeTableForStudent(String registerNumber) {
        Student student = studentRepository.findTopByRegisterNumber(registerNumber);
        if (student == null) {
            throw new RuntimeException("Student not found");
        }
        return timeTableRepository.findByYearAndDepartmentAndSection(
                student.getYear(), student.getDepartment(), student.getSection());
    }

    public List<TimeTable> getTodayTimeTableForStudent(String registerNumber, String dayOfWeek) {
        Student student = studentRepository.findTopByRegisterNumber(registerNumber);
        if (student == null) {
            throw new RuntimeException("Student not found");
        }

        return timeTableRepository.findByDayOfWeekAndYearAndDepartmentAndSection(
                dayOfWeek, student.getYear(), student.getDepartment(), student.getSection());
    }
}