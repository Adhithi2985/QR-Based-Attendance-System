package com.college.attendance.response;

public class LoginResponse {
    private String status;
    private String id;         // registerNumber (student) or teacherId (teacher)
    private String name;
    private Long internalId;   // Only for teacher

    // Constructor for Student
    public LoginResponse(String status, String id, String name) {
        this.status = status;
        this.id = id;
        this.name = name;
    }

    // Constructor for Teacher (with DB ID)
    public LoginResponse(String status, String id, String name, Long internalId) {
        this.status = status;
        this.id = id;
        this.name = name;
        this.internalId = internalId;
    }

    public String getStatus() {
        return status;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getInternalId() {
        return internalId;
    }
}