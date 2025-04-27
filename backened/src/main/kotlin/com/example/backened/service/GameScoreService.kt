package com.example.backened.service

import com.example.backened.model.ResponseScore
import com.example.backened.repository.JPAGameScoreRepository
import org.springframework.stereotype.Service

interface GameScoreService {
    fun getScore(mode: String): List<ResponseScore>
}

@Service
class GameScoreServiceImpl(val gameScoreRepository: JPAGameScoreRepository) : GameScoreService {
    override fun getScore(mode: String): List<ResponseScore> {
        var getRowResult = gameScoreRepository.findByGameModeGameName(mode)
        val scoreToResponseScore =
            getRowResult.map { ResponseScore(it.id, it.createdAt, it.gameScore, it.user.name) }

        return scoreToResponseScore
    }

}