using forgot.password_API.Data;
using forgot.password_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace forgot.password_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public OrderController(AppDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }



        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            // Optional: associate order with user if they are logged in
            var user = await _userManager.GetUserAsync(User);
            order.UserId = user?.Id; // Will be null for guests

            order.OrderDate = DateTime.UtcNow;
            order.OrderNumber = $"MCH-{new Random().Next(10000, 99999)}";
            order.Status = "Processing";

            // Deduct stock
            foreach (var item in order.OrderItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= item.Quantity;
                    if (product.StockQuantity < 0) product.StockQuantity = 0;
                }
            }

            _context.Orders.Add(order);

            // If user is logged in, optionally clear their DB cart (if they used one)
            if (user != null)
            {
                var userCartItems = await _context.CartItems.Where(c => c.UserId == user.Id).ToListAsync();
                _context.CartItems.RemoveRange(userCartItems);
            }

            await _context.SaveChangesAsync();

            return Ok(order);
        }

        // --- ADMIN ENDPOINTS ---

        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Order not found." });

            order.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
