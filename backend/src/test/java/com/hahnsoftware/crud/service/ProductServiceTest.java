package com.hahnsoftware.crud.service;

import com.hahnsoftware.crud.dto.ProductDTO;
import com.hahnsoftware.crud.entity.Product;
import com.hahnsoftware.crud.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private ProductDTO testProductDTO;

    @BeforeEach
    void setUp() {
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setDescription("Test Description");
        testProduct.setPrice(new BigDecimal("99.99"));
        testProduct.setQuantity(10);
        testProduct.setCategory("Test Category");
        testProduct.setCreatedAt(LocalDateTime.now());
        testProduct.setUpdatedAt(LocalDateTime.now());

        testProductDTO = new ProductDTO();
        testProductDTO.setId(1L);
        testProductDTO.setName("Test Product");
        testProductDTO.setDescription("Test Description");
        testProductDTO.setPrice(new BigDecimal("99.99"));
        testProductDTO.setQuantity(10);
        testProductDTO.setCategory("Test Category");
    }

    @Test
    void getAllProducts_ShouldReturnListOfProductDTOs() {
        // Given
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findAllByOrderByCreatedAtDesc()).thenReturn(products);

        // When
        List<ProductDTO> result = productService.getAllProducts();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProduct.getName(), result.get(0).getName());
        verify(productRepository).findAllByOrderByCreatedAtDesc();
    }

    @Test
    void getProductById_WhenProductExists_ShouldReturnProductDTO() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // When
        Optional<ProductDTO> result = productService.getProductById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testProduct.getName(), result.get().getName());
        verify(productRepository).findById(1L);
    }

    @Test
    void getProductById_WhenProductDoesNotExist_ShouldReturnEmpty() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        Optional<ProductDTO> result = productService.getProductById(1L);

        // Then
        assertFalse(result.isPresent());
        verify(productRepository).findById(1L);
    }

    @Test
    void createProduct_WhenProductNameIsUnique_ShouldCreateProduct() {
        // Given
        when(productRepository.existsByNameIgnoreCase(testProductDTO.getName())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        ProductDTO result = productService.createProduct(testProductDTO);

        // Then
        assertNotNull(result);
        assertEquals(testProductDTO.getName(), result.getName());
        verify(productRepository).existsByNameIgnoreCase(testProductDTO.getName());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void createProduct_WhenProductNameExists_ShouldThrowException() {
        // Given
        when(productRepository.existsByNameIgnoreCase(testProductDTO.getName())).thenReturn(true);

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.createProduct(testProductDTO)
        );
        
        assertTrue(exception.getMessage().contains("already exists"));
        verify(productRepository).existsByNameIgnoreCase(testProductDTO.getName());
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void updateProduct_WhenProductExists_ShouldUpdateProduct() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.existsByNameIgnoreCase(testProductDTO.getName())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        ProductDTO result = productService.updateProduct(1L, testProductDTO);

        // Then
        assertNotNull(result);
        assertEquals(testProductDTO.getName(), result.getName());
        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void updateProduct_WhenProductDoesNotExist_ShouldThrowException() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.updateProduct(1L, testProductDTO)
        );
        
        assertTrue(exception.getMessage().contains("not found"));
        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void deleteProduct_WhenProductExists_ShouldDeleteProduct() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(true);

        // When
        productService.deleteProduct(1L);

        // Then
        verify(productRepository).existsById(1L);
        verify(productRepository).deleteById(1L);
    }

    @Test
    void deleteProduct_WhenProductDoesNotExist_ShouldThrowException() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(false);

        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.deleteProduct(1L)
        );
        
        assertTrue(exception.getMessage().contains("not found"));
        verify(productRepository).existsById(1L);
        verify(productRepository, never()).deleteById(1L);
    }

    @Test
    void searchProducts_WithValidSearchTerm_ShouldReturnMatchingProducts() {
        // Given
        String searchTerm = "Test";
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.searchByNameOrDescription(searchTerm)).thenReturn(products);

        // When
        List<ProductDTO> result = productService.searchProducts(searchTerm);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testProduct.getName(), result.get(0).getName());
        verify(productRepository).searchByNameOrDescription(searchTerm);
    }

    @Test
    void searchProducts_WithEmptySearchTerm_ShouldReturnAllProducts() {
        // Given
        List<Product> products = Arrays.asList(testProduct);
        when(productRepository.findAllByOrderByCreatedAtDesc()).thenReturn(products);

        // When
        List<ProductDTO> result = productService.searchProducts("");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(productRepository).findAllByOrderByCreatedAtDesc();
        verify(productRepository, never()).searchByNameOrDescription(anyString());
    }
}

