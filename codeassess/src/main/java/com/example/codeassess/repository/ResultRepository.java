package com.example.codeassess.repository;

import com.example.codeassess.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByAttemptUserId(Long userId);
}