using forgot.password_API.Data;
using forgot.password_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace forgot.password_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // --- PUBLIC STOREFRONT ---
        // Anyone can browse products (No Authorize tag)
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        // --- ADMIN DASHBOARD (CRUD) ---

        // 1. CREATE PRODUCT
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            // Using Created() instead of CreatedAtAction because there is no GetProductById endpoint to generate a Location header for
            return Created($"/api/Product/{product.Id}", product);
        }

        // 2. UPDATE INVENTORY
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product updatedProduct)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Product not found." });

            product.Title = updatedProduct.Title;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;
            product.StockQuantity = updatedProduct.StockQuantity;
            product.MaxQuantityPerUser = updatedProduct.MaxQuantityPerUser;
            
            // Map the 5 images
            product.MajorImageUrl = updatedProduct.MajorImageUrl;
            product.MinorImageUrl1 = updatedProduct.MinorImageUrl1;
            product.MinorImageUrl2 = updatedProduct.MinorImageUrl2;
            product.MinorImageUrl3 = updatedProduct.MinorImageUrl3;
            product.MinorImageUrl4 = updatedProduct.MinorImageUrl4;
            product.DocumentUrl = updatedProduct.DocumentUrl;

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        // 3. DELETE PRODUCT
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Product not found." });

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Product removed from inventory." });
        }
    }
}