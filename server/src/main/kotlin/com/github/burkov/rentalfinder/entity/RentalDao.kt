package com.github.burkov.rentalfinder.entity

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "rental")
data class RentalDao(
    @Id @GeneratedValue val id: String,
)