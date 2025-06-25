package com.hahnsoftware.crud.repository;

import com.hahnsoftware.crud.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * Find products by name containing the given string (case-insensitive)
     */
    List<Product> findByNameContainingIgnoreCase(String name);
    
    /**
     * Find products by category (case-insensitive)
     */
    List<Product> findByCategoryIgnoreCase(String category);
    
    /**
     * Find products by category containing the given string (case-insensitive)
     */
    List<Product> findByCategoryContainingIgnoreCase(String category);
    
    /**
     * Find products with quantity greater than the specified value
     */
    List<Product> findByQuantityGreaterThan(Integer quantity);
    
    /**
     * Find products with quantity less than or equal to the specified value (low stock)
     */
    List<Product> findByQuantityLessThanEqual(Integer quantity);
    
    /**
     * Custom query to search products by name or description
     */
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Product> searchByNameOrDescription(@Param("searchTerm") String searchTerm);
    
    /**
     * Find all products ordered by name
     */
    List<Product> findAllByOrderByNameAsc();
    
    /**
     * Find all products ordered by created date (newest first)
     */
    List<Product> findAllByOrderByCreatedAtDesc();
    
    /**
     * Check if a product with the given name already exists (case-insensitive)
     */
    boolean existsByNameIgnoreCase(String name);
}

