package com.github.burkov.rentalfinder

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class RentalFinderApplication

fun main(args: Array<String>) {
	runApplication<RentalFinderApplication>(*args)
}
