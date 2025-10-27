package com.college.attendance.dto;

/**
 * Lightweight view used in the Teacher Daily Attendance Report summary table.
 * One instance = one *scheduled* class period (from TimeTable) for the selected date.
 *
 * Fields:
 *  - timeTableId : Primary key of the TimeTable row (used to fetch detail view).
 *  - className   : Computed label like "III-AIDS-A" (year-dept-section).
 *  - subjectCode : e.g., "CS8451".
 *  - subjectName : e.g., "Data Structures".
 *  - hour        : Period number in the day (1..n).
 *  - date        : Report date (yyyy-MM-dd) echoed back to client for navigation.
 */
public class DailyClassSummaryDTO {

    private Long timeTableId;
    private String className;
    private String subjectCode;
    private String subjectName;
    private Integer hour;
    private String date;

    public DailyClassSummaryDTO() {
    }

    public DailyClassSummaryDTO(Long timeTableId,
                                String className,
                                String subjectCode,
                                String subjectName,
                                Integer hour,
                                String date) {
        this.timeTableId = timeTableId;
        this.className = className;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.hour = hour;
        this.date = date;
    }

    public Long getTimeTableId() {
        return timeTableId;
    }

    public void setTimeTableId(Long timeTableId) {
        this.timeTableId = timeTableId;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
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

    public Integer getHour() {
        return hour;
    }

    public void setHour(Integer hour) {
        this.hour = hour;
    }

    public String getDate() {
        return date;
    }

    /**
     * Expected format yyyy-MM-dd (ISO-8601) for simplicity.
     */
    public void setDate(String date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "DailyClassSummaryDTO{" +
                "timeTableId=" + timeTableId +
                ", className='" + className + '\'' +
                ", subjectCode='" + subjectCode + '\'' +
                ", subjectName='" + subjectName + '\'' +
                ", hour=" + hour +
                ", date='" + date + '\'' +
                '}';
    }
}