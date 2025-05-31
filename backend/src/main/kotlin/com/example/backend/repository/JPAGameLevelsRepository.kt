package com.example.backend.repository

import com.example.backend.model.GameLevels
import org.springframework.data.jpa.repository.JpaRepository

interface JPAGameLevelsRepository : JpaRepository<GameLevels, Int>
