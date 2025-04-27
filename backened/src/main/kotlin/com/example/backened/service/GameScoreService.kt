package com.example.backened.service

import com.example.backened.model.Score
import com.example.backened.repository.JPAGameScoreRepository
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.PathVariable

interface GameScoreService {
    fun getScore(mode:String): List<Score>
}
@Service
class GameScoreServiceImpl(val gameScoreRepository: JPAGameScoreRepository): GameScoreService {
    override fun getScore(mode: String): List<Score> {
//        todo 一旦全部持ってきて後からmodeでソートしたらいいんじゃない？
//        List<Score>がどんなデータ型になるかわからない。どうやって確認すればいいわからない。
//        一旦gameNameがgamemodeに一致しているものを返せばいい？f

        return gameScoreRepository.findAll()

    }
}