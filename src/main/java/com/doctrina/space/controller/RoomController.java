package com.doctrina.space.controller;

import com.doctrina.space.entity.Room;
import com.doctrina.space.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Room r) {
        return ResponseEntity.ok(roomService.create(r));
    }

    @GetMapping
    public ResponseEntity<List<Room>> list() {
        return ResponseEntity.ok(roomService.listAll());
    }
}
