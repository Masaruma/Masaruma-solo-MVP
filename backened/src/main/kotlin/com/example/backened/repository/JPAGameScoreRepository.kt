package com.example.backened.repository

import com.example.backened.model.GameMode
import com.example.backened.model.Score
import org.springframework.data.jpa.repository.JpaRepository

interface JPAGameScoreRepository:JpaRepository<Score, Int>