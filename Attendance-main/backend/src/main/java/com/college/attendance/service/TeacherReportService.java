package com.college.attendance.service;

import com.college.attendance.dto.DailyClassDetailDTO;
import com.college.attendance.dto.DailyClassSummaryDTO;
import com.college.attendance.model.Attendance;
import com.college.attendance.model.QRCode;
import com.college.attendance.model.Student;
import com.college.attendance.model.TimeTable;
import com.college.attendance.repository.AttendanceRepository;
import com.college.attendance.repository.StudentRepository;
import com.college.attendance.repository.TimeTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeacherReportService {

    @Autowired
    private TimeTableRepository timeTableRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    /* Canonical map so “Mon”, “MONDAY”, “Thur”, etc. all line up */
    private static final Map<String, String> DOW_CANON = new HashMap<>();
    static {
        // Monday
        DOW_CANON.put("MON", "MON");
        DOW_CANON.put("MONDAY", "MON");
        // Tuesday
        DOW_CANON.put("TUE", "TUE");
        DOW_CANON.put("TUES", "TUE");
        DOW_CANON.put("TUESDAY", "TUE");
        // Wednesday
        DOW_CANON.put("WED", "WED");
        DOW_CANON.put("WEDNESDAY", "WED");
        // Thursday
        DOW_CANON.put("THU", "THU");
        DOW_CANON.put("THUR", "THU");
        DOW_CANON.put("THURS", "THU");
        DOW_CANON.put("THURSDAY", "THU");
        // Friday
        DOW_CANON.put("FRI", "FRI");
        DOW_CANON.put("FRIDAY", "FRI");
        // Saturday
        DOW_CANON.put("SAT", "SAT");
        DOW_CANON.put("SATURDAY", "SAT");
        // Sunday
        DOW_CANON.put("SUN", "SUN");
        DOW_CANON.put("SUNDAY", "SUN");
    }

    private String canon(String raw) {
        if (raw == null) return "";
        String upper = raw.trim().toUpperCase();
        return DOW_CANON.getOrDefault(upper, upper);
    }

    /**
     * Fetch all scheduled classes handled by a teacher on the given date.
     */
    public List<DailyClassSummaryDTO> getDailyClassSummary(String teacherId, LocalDate date) {

        List<TimeTable> sessions = timeTableRepository.findByTeacherId(teacherId);
        if (sessions.isEmpty()) {
            return Collections.emptyList();
        }

        // Get day name as in DB (e.g., "Monday", "Friday")
        String dayOfWeek = date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        List<TimeTable> todaySessions = sessions.stream()
                .filter(s -> s.getDayOfWeek() != null &&
                        s.getDayOfWeek().equalsIgnoreCase(dayOfWeek))
                .sorted(Comparator.comparingInt(TimeTable::getHour))
                .collect(Collectors.toList());

        List<DailyClassSummaryDTO> result = new ArrayList<>();
        for (TimeTable t : todaySessions) {
            DailyClassSummaryDTO dto = new DailyClassSummaryDTO();
            dto.setTimeTableId(t.getId());
            dto.setClassName(t.getYear() + "-" + t.getDepartment() + "-" + t.getSection());
            dto.setSubjectName(t.getSubjectName());
            dto.setSubjectCode(t.getSubjectCode());
            dto.setHour(t.getHour());
            dto.setDate(date.toString());
            result.add(dto);
        }
        return result;
    }
    /**
     * Detailed attendance (Present / Absent / OD) for one timetable entry & date.
     */
    public List<DailyClassDetailDTO> getDailyClassDetails(Long timeTableId, LocalDate date) {
        TimeTable timeTable = timeTableRepository.findById(timeTableId).orElse(null);
        if (timeTable == null) return Collections.emptyList();

        String className = timeTable.getYear() + "-" + timeTable.getDepartment() + "-" + timeTable.getSection();
        String subjectName = timeTable.getSubjectName();

        LocalTime start = approxStartTimeFromHour(timeTable.getHour());
        LocalTime end   = approxEndTimeFromHour(timeTable.getHour());

        LocalDateTime startDateTime = LocalDateTime.of(date, start);
        LocalDateTime endDateTime   = LocalDateTime.of(date, end);

        // Filter attendance records matching class + subject + time window
        List<Attendance> filtered = attendanceRepository.findAll().stream()
                .filter(a -> {
                    QRCode qr = a.getQrCode();
                    if (qr == null) return false;
                    if (qr.getSubjectName() == null ||
                            !qr.getSubjectName().equalsIgnoreCase(subjectName)) return false;
                    if (qr.getClassName() == null ||
                            !qr.getClassName().equalsIgnoreCase(className)) return false;
                    LocalDateTime ts = a.getTimestamp();
                    return ts != null && !ts.isBefore(startDateTime) && !ts.isAfter(endDateTime);
                })
                .collect(Collectors.toList());

        // Map register number to status
        Map<String,String> statusByRegNo = new HashMap<>();
        for (Attendance att : filtered) {
            Student s = att.getStudent();
            if (s != null) {
                statusByRegNo.put(
                        s.getRegisterNumber(),
                        att.getStatus() == null ? "Present" : att.getStatus()
                );
            }
        }

        // All students of that class
        List<Student> students = studentRepository.findByYearAndDepartmentAndSection(
                timeTable.getYear(), timeTable.getDepartment(), timeTable.getSection());

        List<DailyClassDetailDTO> rows = new ArrayList<>();
        for (Student s : students) {
            String status = statusByRegNo.getOrDefault(s.getRegisterNumber(), "Absent");
            boolean present = "Present".equalsIgnoreCase(status);
            boolean od = "OD".equalsIgnoreCase(status);
            boolean absent = !present && !od;
            rows.add(new DailyClassDetailDTO(
                    s.getRegisterNumber(), s.getName(), present, absent, od
            ));
        }
        return rows;
    }

    /* Approximate bell schedule – adjust if you later add real start/end times */
    private LocalTime approxStartTimeFromHour(int hour) {
        switch (hour) {
            case 1: return LocalTime.of(9, 0);
            case 2: return LocalTime.of(10, 0);
            case 3: return LocalTime.of(11, 0);
            case 4: return LocalTime.of(12, 0);
            case 5: return LocalTime.of(13, 0);
            case 6: return LocalTime.of(14, 0);
            default: return LocalTime.of(9, 0);
        }
    }

    private LocalTime approxEndTimeFromHour(int hour) {
        return approxStartTimeFromHour(hour).plusMinutes(50);
    }
}