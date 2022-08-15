package com.github.burkov.rentalfinder.repository

import com.github.burkov.rentalfinder.entity.RentalDao
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RentalRepository : JpaRepository<RentalDao, String>