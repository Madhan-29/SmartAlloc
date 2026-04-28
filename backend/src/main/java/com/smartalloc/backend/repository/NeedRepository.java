package com.smartalloc.backend.repository;

import com.smartalloc.backend.domain.Need;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NeedRepository extends JpaRepository<Need, Long> {
    List<Need> findByStatus(String status);
    List<Need> findByCategory(String category);
}
