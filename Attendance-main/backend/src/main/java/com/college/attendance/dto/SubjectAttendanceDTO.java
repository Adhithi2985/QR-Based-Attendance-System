package com.college.attendance.dto;

public class SubjectAttendanceDTO {
    private String subjectCode;
    private String subjectName;
    private int totalPeriods;
    private int attended;
    private int absent;
    private double attendancePercentage;

    public SubjectAttendanceDTO() {
    }

    public SubjectAttendanceDTO(String subjectCode, String subjectName, int totalPeriods, int attended, int absent, double attendancePercentage) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.totalPeriods = totalPeriods;
        this.attended = attended;
        this.absent = absent;
        this.attendancePercentage = attendancePercentage;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public int getTotalPeriods() {
        return totalPeriods;
    }

    public void setTotalPeriods(int totalPeriods) {
        this.totalPeriods = totalPeriods;
    }

    public int getAttended() {
        return attended;
    }

    public void setAttended(int attended) {
        this.attended = attended;
    }

    public int getAbsent() {
        return absent;
    }

    public void setAbsent(int absent) {
        this.absent = absent;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }
}