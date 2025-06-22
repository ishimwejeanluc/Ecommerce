package rw.ac.auca.ecommerce.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    // Home page
    @GetMapping("/")
    public String home() {
        return "index";
    }

    // Shop pages
    @GetMapping("/shop")
    public String shop() {
        return "shop/product-list";
    }

    @GetMapping("/shop/product")
    public String productDetail() {
        return "shop/product-detail";
    }

    // Cart and Checkout
    @GetMapping("/cart")
    public String cart() {
        return "cart/cart";
    }

    @GetMapping("/checkout")
    public String checkout() {
        return "cart/checkout";
    }

    // User Profile pages
    @GetMapping("/profile")
    public String profile() {
        return "user/profile";
    }

    @GetMapping("/profile/orders")
    public String orders() {
        return "user/orders";
    }

    @GetMapping("/profile/addresses")
    public String addresses() {
        return "user/addresses";
    }

    @GetMapping("/profile/wishlist")
    public String wishlist() {
        return "user/wishlist";
    }

    @GetMapping("/profile/settings")
    public String settings() {
        return "user/settings";
    }

    // Admin pages
    @GetMapping("/admin")
    public String adminDashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/admin/products")
    public String adminProducts() {
        return "admin/products";
    }

    @GetMapping("/admin/orders")
    public String adminOrders() {
        return "admin/orders";
    }

    // Auth pages
    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }

    @GetMapping("/register")
    public String register() {
        return "auth/register";
    }
} 