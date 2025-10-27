package com.college.attendance.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.*;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String className;       // e.g., "III CSE B"
    private String year;            // e.g., "3"
    private String department;      // e.g., "CSE"
    private String section;         // e.g., "B"
    private String subject;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDate date;  // or LocalDateTime dateTime;
    private String classroomCode;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    public LocalDate getDate() {
        return date;
    }
}