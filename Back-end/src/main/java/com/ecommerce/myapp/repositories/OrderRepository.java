package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.dtos.dashboard.CategoryRevenueDto;
import com.ecommerce.myapp.model.checkoutGroup.Order;
import com.ecommerce.myapp.model.checkoutGroup.OrderStatusV2;
import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.model.user.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByAppUser(AppUser appUser);

    List<Order> findAllByAppUserAndStatus(AppUser appUser, OrderStatusV2 status);

    Optional<Order> findByAppUserAndOrderId(AppUser appUser, Long orderId);

    @Query("select od from Order od where lower(od.status) like concat('%',?1,'%') " +
           "or cast(od.totalPrice as string) like concat('%',?1,'%')" +
           "or cast(od.orderAt as string ) like concat('%',?1,'%') ")
    Page<Order> orderPage(String search, Pageable pageable);

    List<Order> findAllByStatus(OrderStatusV2 orderStatusV2);

    @Query("SELECT SUM(od.totalPrice) FROM Order od " +
           "where  od.status = 'SUCCESS' " +
           "and cast(od.orderAt as string ) between ?1 and ?2 ")
    BigDecimal countTotalPriceByTime(String dateA, String dateB);
    @Query("SELECT SUM(od.totalPrice) FROM Order od " +
           "WHERE cast(od.orderAt as string ) < ?1 and od.status = 'SUCCESS' " +
           "ORDER BY od.orderAt DESC limit 1")
    BigDecimal findTotalPriceBeforeDate(String toB);
    @Query("SELECT SUM(od.totalPrice) FROM Order od " +
           "WHERE cast(od.orderAt as string ) > ?1 and od.status = 'SUCCESS'" +
           "ORDER BY od.orderAt ASC limit 1")
    BigDecimal findTotalPriceAfterDate(String fromA);

    @Query("SELECT p FROM Product p JOIN p.orderDetails od JOIN od.order o " +
           "WHERE o.status = 'SUCCESS' AND " +
           "MONTH(o.orderAt) = MONTH(CURRENT_DATE) AND " +
           "YEAR(o.orderAt) = YEAR(CURRENT_DATE) " +
           "GROUP BY p " +
           "ORDER BY COUNT(od) DESC, SUM(od.orderQuantity) DESC")
    Page<Product> findAllBestSellerProduct(Pageable pageable);

    @Query("SELECT new com.ecommerce.myapp.dtos.dashboard.CategoryRevenueDto(c.categoryName, SUM(o.totalPrice))" +
           "FROM Order o " +
           "JOIN o.orderDetails od " +
           "JOIN od.product p JOIN p.category c " +
           "where  o.status = 'SUCCESS'" +
           "GROUP BY c.categoryName")
    List<CategoryRevenueDto> listCategoryRevenues();

    @Query("SELECT SUM(od.totalPrice) FROM Order od where cast(od.orderAt as string ) between ?1 and ?2")
    BigDecimal salesByCategories();

    @Query("SELECT COUNT(od) FROM Order od WHERE DATE(od.orderAt) = CURRENT_DATE")
    Long countOrdersToday();

    @Query("SELECT COUNT(od) FROM Order od WHERE od.orderAt >= ?1 AND od.orderAt <= ?2")
    Long countOrdersThisWeek(LocalDate startOfWeek, LocalDate endOfWeek);

    @Query("SELECT COUNT(od) FROM Order od WHERE MONTH(od.orderAt) = MONTH(CURRENT_DATE) AND YEAR(od.orderAt) = YEAR(CURRENT_DATE)")
    Long countOrdersThisMonth();
}