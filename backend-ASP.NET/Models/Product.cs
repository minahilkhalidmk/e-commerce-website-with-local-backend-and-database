using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace forgot.password_API.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // This tells SQL Server to allow up to 18 digits total, with 2 after the decimal point
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; }
        public int MaxQuantityPerUser { get; set; } = 5;

        [Required]
        public string MajorImageUrl { get; set; } = string.Empty;

        [Required]
        public string MinorImageUrl1 { get; set; } = string.Empty;

        [Required]
        public string MinorImageUrl2 { get; set; } = string.Empty;

        [Required]
        public string MinorImageUrl3 { get; set; } = string.Empty;

        [Required]
        public string MinorImageUrl4 { get; set; } = string.Empty;

        public string? DocumentUrl { get; set; }
    }
}
