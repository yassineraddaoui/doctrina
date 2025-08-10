package com.doctrina.space.service;

import com.doctrina.space.entity.Room;
import com.doctrina.space.repository.RoomRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class RoomService {
    @Autowired
    private  RoomRepository roomRepo;

    public Room create(Room r) { return roomRepo.save(r); }
    public List<Room> listAll() { return roomRepo.findAll(); }
    public Room findById(Long id) { return roomRepo.findById(id).orElseThrow(() -> new RuntimeException("Room not found")); }
}
