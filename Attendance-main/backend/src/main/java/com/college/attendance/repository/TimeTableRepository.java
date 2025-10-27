package com.college.attendance.repository;

import com.college.attendance.model.TimeTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeTableRepository extends JpaRepository<TimeTable, Long> {
    List<TimeTable> findByYearAndDepartmentAndSection(String year, String department, String section);
    List<TimeTable> findByDayOfWeekAndYearAndDepartmentAndSection(String dayOfWeek, String year, String department, String section);
    List<TimeTable> findByTeacherId(String teacherId);

    // 🔹 optional: fetch only for specific day (MONDAY, etc.)
    List<TimeTable> findByTeacherIdAndDayOfWeek(String teacherId, String dayOfWeek);
}