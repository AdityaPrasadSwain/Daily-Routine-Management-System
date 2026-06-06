package com.drms.drms_backend.service;

import com.drms.drms_backend.dto.RoutineDTO;
import com.drms.drms_backend.entity.Routine;
import com.drms.drms_backend.entity.User;
import com.drms.drms_backend.exception.ResourceNotFoundException;
import com.drms.drms_backend.repository.RoutineRepository;
import com.drms.drms_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoutineService {

    @Autowired
    private RoutineRepository routineRepository;

    @Autowired
    private UserRepository userRepository;

    public List<RoutineDTO> getAllRoutines(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return routineRepository.findByUserId(user.getId()).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public RoutineDTO createRoutine(String email, RoutineDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Routine routine = new Routine();
        routine.setUser(user);
        routine.setTitle(dto.getTitle());
        routine.setDescription(dto.getDescription());

        Routine saved = routineRepository.save(routine);
        return mapToDTO(saved);
    }

    private RoutineDTO mapToDTO(Routine routine) {
        RoutineDTO dto = new RoutineDTO();
        dto.setId(routine.getId());
        dto.setTitle(routine.getTitle());
        dto.setDescription(routine.getDescription());
        dto.setCreatedAt(routine.getCreatedAt());
        dto.setUserId(routine.getUser().getId());
        return dto;
    }
}
