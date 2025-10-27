package com.college.attendance.dto;

/**
 * Represents a single student's attendance detail for a given class session.
 * Used when teacher clicks "View" on the Daily Attendance Report.
 */
public class DailyClassDetailDTO {

    private String registerNumber;  // Student Register Number
    private String studentName;     // Student Full Name
    private boolean present;        // true if marked present
    private boolean absent;         // true if marked absent
    private boolean od;             // true if On Duty (OD)

    public DailyClassDetailDTO() {
    }

    public DailyClassDetailDTO(String registerNumber, String studentName, boolean present, boolean absent, boolean od) {
        this.registerNumber = registerNumber;
        this.studentName = studentName;
        this.present = present;
        this.absent = absent;
        this.od = od;
    }

    public String getRegisterNumber() {
        return registerNumber;
    }

    public void setRegisterNumber(String registerNumber) {
        this.registerNumber = registerNumber;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public boolean isPresent() {
        return present;
    }

    public void setPresent(boolean present) {
        this.present = present;
    }

    public boolean isAbsent() {
        return absent;
    }

    public void setAbsent(boolean absent) {
        this.absent = absent;
    }

    public boolean isOd() {
        return od;
    }

    public void setOd(boolean od) {
        this.od = od;
    }

    @Override
    public String toString() {
        return "DailyClassDetailDTO{" +
                "registerNumber='" + registerNumber + '\'' +
                ", studentName='" + studentName + '\'' +
                ", present=" + present +
                ", absent=" + absent +
                ", od=" + od +
                '}';
    }
}