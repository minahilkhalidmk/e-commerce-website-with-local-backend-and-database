using forgot.password_API.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace forgot.password_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;

        public UserController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        // 1. CREATE (Register a new user)
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] RegisterUserDto request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Create a new database user object
            var newUser = new IdentityUser { UserName = request.Email, Email = request.Email };

            // 2. Save it to SQL Server and hash the password
            var result = await _userManager.CreateAsync(newUser, request.Password);

            // 3. Tell React if it worked or failed
            if (result.Succeeded)
            {
                return Ok(new { message = "User created successfully." });
            }

            return BadRequest(result.Errors);
        }

        // 2. READ (Get all users)
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Email = u.Email!,
                    PhoneNumber = u.PhoneNumber
                })
                .ToListAsync();

            return Ok(users);
        }

        // 2b. READ (Get a single user by ID)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email!,
                PhoneNumber = user.PhoneNumber
            });
        }

        // 3. UPDATE (Edit user details, like adding a phone number)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto request)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            // Update allowed fields
            user.PhoneNumber = request.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "User updated successfully." });
            }

            return BadRequest(result.Errors);
        }

        // 4. DELETE (Remove a user from the database)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "User deleted successfully." });
            }

            return BadRequest(result.Errors);
        }
    }
}