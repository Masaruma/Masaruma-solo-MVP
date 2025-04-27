package com.example.backened.service

import com.example.backened.model.GameMode
import com.example.backened.model.RequestScore
import com.example.backened.model.ResponseScore
import com.example.backened.model.Score
import com.example.backened.model.User
import com.example.backened.repository.JPAGameModeRepository
import com.example.backened.repository.JPAGameScoreRepository
import com.example.backened.repository.JPAUserRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.junit.jupiter.api.Test

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class GameScoreServiceTest {
    @Autowired
    private lateinit var gameScoreService: GameScoreService

    @Autowired
    private lateinit var gameScoreRepository: JPAGameScoreRepository

    @Autowired
    private lateinit var userRepository: JPAUserRepository

    @Autowired
    private lateinit var gameModeRepository: JPAGameModeRepository

    @BeforeEach
    fun setup() {
        gameScoreRepository.deleteAll()
        userRepository.deleteAll()
        gameModeRepository.deleteAll()
        gameScoreService = GameScoreServiceImpl(gameScoreRepository,gameModeRepository)
    }

    @Test
    fun `getScoreを実行するとJPAGameScoreRepositoryを呼びScoreのListで帰ってきたデータを加工している`() {
        val modeIrasutoya = gameModeRepository.save(GameMode(gameName = "irasutoya"))
        val modePokemon = gameModeRepository.save(GameMode(gameName = "pokemon"))

        // 2. Score を作成（irasutoyaモードのものと、別モードのもの）
        val score1 = Score(gameScore = 100, user = User(name = "Masaru"), gameMode = modeIrasutoya)
        val score2 = Score(gameScore = 50, user = User(name = "Masaru2"), gameMode = modePokemon)

        val saveGameScoreResult = gameScoreRepository.saveAll(listOf(score1, score2))
        val irasutoya = saveGameScoreResult[0]
        val expected = listOf(
            ResponseScore(
                id = irasutoya.id,
                createdAt = irasutoya.createdAt,
                gameScore = irasutoya.gameScore,
                user = irasutoya.user.name
            )
        )

        val testResult = gameScoreService.getScore("irasutoya")

        assertEquals(expected, testResult)
    }

    @Test
    fun`postScoreを実行するとJPAGameScoreRepositoryを呼びデータが保存される`() {
        gameModeRepository.save(GameMode(gameName = "irasutoya"))
        gameModeRepository.save(GameMode(gameName = "pokemon"))

        val saveAndExpectedData= RequestScore(user = "masaru", gameScore = 300, gameMode = "irasutoya")

        gameScoreService.postScore(saveAndExpectedData)

        val actualResult = gameScoreRepository.findAll().first()

        assertEquals(saveAndExpectedData.user, actualResult.user.name)
        assertEquals(saveAndExpectedData.gameScore, actualResult.gameScore)
        assertEquals(saveAndExpectedData.gameMode, actualResult.gameMode.gameName)
    }

}