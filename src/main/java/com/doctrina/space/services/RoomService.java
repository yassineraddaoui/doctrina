package com.doctrina.space.service;

import com.doctrina.space.entity.Room;
import com.doctrina.space.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepo;

    public Room create(Room r) { return roomRepo.save(r); }
    public List<Room> listAll() { return roomRepo.findAll(); }
    public Room findById(Long id) { return roomRepo.findById(id).orElseThrow(() -> new RuntimeException("Room not found")); }
}
