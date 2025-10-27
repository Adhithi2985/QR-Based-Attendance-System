package com.college.attendance.request;

public class QRCodeRequest {
    private String className;
    private String subjectName;
    private Double latitude;
    private Double longitude;

    // Constructors
    public QRCodeRequest() {}

    public QRCodeRequest(String className, String subjectName, Double latitude, Double longitude) {
        this.className = className;
        this.subjectName = subjectName;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters and setters
    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}