using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace forgot.password_API.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        // The user who placed the order (null if guest)
        public string? UserId { get; set; }

        public string OrderNumber { get; set; } = string.Empty; // e.g. MCH-1234
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Processing";

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        // Snapshot of Shipping Address at the time of order
        public string ShippingFirstName { get; set; } = string.Empty;
        public string ShippingLastName { get; set; } = string.Empty;
        public string ShippingStreet { get; set; } = string.Empty;
        public string ShippingCity { get; set; } = string.Empty;
        public string ShippingZipCode { get; set; } = string.Empty;

        // Order Items
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
