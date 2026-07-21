using System.ComponentModel.DataAnnotations;

namespace forgot.password_API.DTO
{
    // C - Create
    public class RegisterUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;
    }

    // U - Update
    public class UpdateUserDto
    {
        [Phone]
        public string? PhoneNumber { get; set; }
    }

    // R - Read (What we send back to the React UI)
    public class UserResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
    }
}