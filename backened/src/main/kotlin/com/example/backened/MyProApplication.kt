package com.example.backened

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MyProApplication

fun main(args: Array<String>) {
	runApplication<MyProApplication>(*args)
}
