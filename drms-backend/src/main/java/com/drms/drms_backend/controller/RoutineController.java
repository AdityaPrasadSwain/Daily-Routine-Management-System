package com.drms.drms_backend.controller;

import com.drms.drms_backend.dto.RoutineDTO;
import com.drms.drms_backend.service.RoutineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routines")
public class RoutineController {

    @Autowired
    private RoutineService routineService;

    @GetMapping
    public ResponseEntity<List<RoutineDTO>> getAllRoutines(Authentication authentication) {
        return ResponseEntity.ok(routineService.getAllRoutines(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<RoutineDTO> createRoutine(@RequestBody RoutineDTO routineDTO, Authentication authentication) {
        return ResponseEntity.ok(routineService.createRoutine(authentication.getName(), routineDTO));
    }
}
