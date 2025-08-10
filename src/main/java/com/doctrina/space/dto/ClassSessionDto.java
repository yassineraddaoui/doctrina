package com.doctrina.space.dto;

import lombok.Data;

import java.util.List;

@Data
public class ClassSessionDto {
    private String title;
    private String startAt; // ISO datetime
    private Integer durationMinutes;
    private Boolean online; // true = online, false = in classroom
    private Long teacherId;
    private Long roomId; // optional, required if online == false
    private List<Long> studentIds; // optional
}
