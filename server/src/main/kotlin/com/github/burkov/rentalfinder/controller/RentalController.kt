package com.github.burkov.rentalfinder.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/rentals")
class RentalController {
    @GetMapping("/")
    fun getAll() {

    }
}