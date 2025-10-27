package com.college.attendance.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TimeTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dayOfWeek;
    private int hour;
    private String year;
    private String department;
    private String section;
    private String subjectName;
    private String subjectCode;
    private String teacherId;
}