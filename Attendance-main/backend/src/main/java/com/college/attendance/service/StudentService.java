package com.college.attendance.service;

import com.college.attendance.dto.SubjectAttendanceDTO;
import com.college.attendance.model.Attendance;
import com.college.attendance.model.Student;
import com.college.attendance.model.TimeTable;
import com.college.attendance.repository.AttendanceRepository;
import com.college.attendance.repository.StudentRepository;
import com.college.attendance.repository.TimeTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StudentService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TimeTableRepository timeTableRepository;

    public List<SubjectAttendanceDTO> getSubjectWiseAttendance(String regNo) {
        Student student = studentRepository.findTopByRegisterNumber(regNo);
        if (student == null) {
            return Collections.emptyList();
        }

        // 1️⃣ Get all subjects from timetable (for this student's class)
        List<TimeTable> subjects = timeTableRepository.findByYearAndDepartmentAndSection(
                student.getYear(), student.getDepartment(), student.getSection()
        );

        // Map: key = subjectName + subjectCode, value = DTO
        Map<String, SubjectAttendanceDTO> summaryMap = new LinkedHashMap<>();

        for (TimeTable tt : subjects) {
            String key = tt.getSubjectName() + "::" + tt.getSubjectCode();

            summaryMap.putIfAbsent(key, new SubjectAttendanceDTO(
                    tt.getSubjectCode(),
                    tt.getSubjectName(),
                    0, // total
                    0, // attended
                    0, // absent
                    0.0 // %
            ));

            SubjectAttendanceDTO dto = summaryMap.get(key);
            dto.setTotalPeriods(dto.getTotalPeriods() + 1);  // count each period
        }

        // 2️⃣ Get attendance records of student
        List<Attendance> attendanceList = attendanceRepository.findByStudentRegisterNumber(regNo);

        for (Attendance a : attendanceList) {
            if (a.getQrCode() == null) continue;

            String subjectName = a.getQrCode().getSubjectName();
            String subjectCode = a.getQrCode().getSubjectCode() != null ? a.getQrCode().getSubjectCode() : "N/A";

            String key = subjectName + "::" + subjectCode;

            if (!summaryMap.containsKey(key)) {
                // Optional: handle QRCode not in timetable
                summaryMap.put(key, new SubjectAttendanceDTO(
                        subjectCode,
                        subjectName,
                        1,
                        "Present".equalsIgnoreCase(a.getStatus()) ? 1 : 0,
                        "Present".equalsIgnoreCase(a.getStatus()) ? 0 : 1,
                        0.0
                ));
            } else {
                SubjectAttendanceDTO dto = summaryMap.get(key);
                if ("Present".equalsIgnoreCase(a.getStatus())) {
                    dto.setAttended(dto.getAttended() + 1);
                }
            }
        }

        // 3️⃣ Calculate absent and percentage
        for (SubjectAttendanceDTO dto : summaryMap.values()) {
            int total = dto.getTotalPeriods();
            int attended = dto.getAttended();
            int absent = total - attended;
            double percent = total > 0 ? (attended * 100.0 / total) : 0.0;

            dto.setAbsent(absent);
            dto.setAttendancePercentage(Math.round(percent * 100.0) / 100.0); // round to 2 decimal
        }

        return new ArrayList<>(summaryMap.values());
    }
}