using forgot.password_API.Data;
using forgot.password_API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
if (!Directory.Exists(webRootPath))
{
    Directory.CreateDirectory(webRootPath);
}
builder.Environment.WebRootPath = webRootPath;
// 1. ADD CONTROLLERS (This fixes your Browser Error)
builder.Services.AddControllers(options =>
{
    options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true;
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // 1. Creates the "Padlock" button
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // 2. Forces Swagger to actually attach the token to your requests
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// 2. CONFIGURE DATABASE (This fixes your Update-Database Error)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. CONFIGURE ASP.NET CORE IDENTITY
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// 4. REGISTER EMAIL SERVICE
builder.Services.AddScoped<IEmailService, EmailService>();

// 5. CONFIGURE CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174") // Vite ports
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// 6. CONFIGURE JWT AUTHENTICATION
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"] ?? "fallback_secret_key")),
        ValidateLifetime = true
    };
});

// 7. CONFIGURE AUTHORIZATION
builder.Services.AddAuthorization();

// ==========================================
// BUILD THE APP
// ==========================================
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseStaticFiles(); // Serve images from wwwroot

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


// --- ROLE SEEDER SCRIPT ---
// This runs once every time the API starts up to ensure the Admin role exists.
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

    // 1. Create the Admin role if it doesn't exist
    if (!await roleManager.RoleExistsAsync("Admin"))
    {
        await roleManager.CreateAsync(new IdentityRole("Admin"));
    }

    // 2. Find your specific user account
    var adminUser = await userManager.FindByEmailAsync("minahilkhalid09mk@gmail.com");

    // 3. Assign the Admin role to your account
    if (adminUser != null && !await userManager.IsInRoleAsync(adminUser, "Admin"))
    {
        await userManager.AddToRoleAsync(adminUser, "Admin");
    }

    // 4. Seed Realistic Products for "Mochi Store"
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Clear old test products to keep the store clean
    var oldProducts = await dbContext.Products.Where(p => p.Title.Contains("test prod")).ToListAsync();
    if (oldProducts.Any())
    {
        dbContext.Products.RemoveRange(oldProducts);
        await dbContext.SaveChangesAsync();
    }

    if (!await dbContext.Products.AnyAsync(p => p.Title == "Mochi65 Mechanical Keyboard"))
    {
        dbContext.Products.AddRange(
            new forgot.password_API.Models.Product
            {
                Title = "Mochi65 Mechanical Keyboard",
                Description = "A premium 65% custom mechanical keyboard kit. Features a full aluminum body, gasket mount design for a soft typing feel, and hotswap PCB. Perfect for both beginners and enthusiasts. Switches and keycaps sold separately.",
                Price = 249.00M,
                StockQuantity = 50,
                MaxQuantityPerUser = 2,
                MajorImageUrl = "/demo1.jpg",
                MinorImageUrl1 = "/minor1.jpg",
                MinorImageUrl2 = "/minor2.jpg",
                MinorImageUrl3 = "/minor3.jpg",
                MinorImageUrl4 = "/minor4.jpg",
                DocumentUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            },
            new forgot.password_API.Models.Product
            {
                Title = "Ceramic Keycap Set - Matcha",
                Description = "Hand-crafted ceramic keycaps with a smooth, glossy finish. The Matcha colorway brings a calming, earthy aesthetic to your desk. Produces a unique deep sound profile and is incredibly durable.",
                Price = 85.00M,
                StockQuantity = 120,
                MaxQuantityPerUser = 5,
                MajorImageUrl = "/demo2.jpg",
                MinorImageUrl1 = "/minor2.jpg",
                MinorImageUrl2 = "/minor3.jpg",
                MinorImageUrl3 = "/minor4.jpg",
                MinorImageUrl4 = "/minor1.jpg",
                DocumentUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            },
            new forgot.password_API.Models.Product
            {
                Title = "Mochi Deskmat - Cloud Edition",
                Description = "Extra large 900x400mm deskmat featuring our signature cloud pattern. Smooth cloth surface optimized for both optical and laser mice, with a premium stitched edge and anti-slip rubber base.",
                Price = 35.00M,
                StockQuantity = 200,
                MaxQuantityPerUser = 10,
                MajorImageUrl = "/demo3.jpg",
                MinorImageUrl1 = "/minor3.jpg",
                MinorImageUrl2 = "/minor4.jpg",
                MinorImageUrl3 = "/minor1.jpg",
                MinorImageUrl4 = "/minor2.jpg",
                DocumentUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            },
            new forgot.password_API.Models.Product
            {
                Title = "Lubricant Starter Kit",
                Description = "Everything you need to start lubing your switches. Includes premium Krytox 205g0 (5g), a fine detailing brush, and a precision switch stem holder.",
                Price = 25.00M,
                StockQuantity = 80,
                MaxQuantityPerUser = 5,
                MajorImageUrl = "/demo1.jpg",
                MinorImageUrl1 = "/minor1.jpg",
                MinorImageUrl2 = "/minor2.jpg",
                MinorImageUrl3 = "/minor3.jpg",
                MinorImageUrl4 = "/minor4.jpg",
                DocumentUrl = ""
            },
            new forgot.password_API.Models.Product
            {
                Title = "Linear Switches - Mochi Silks (x90)",
                Description = "Ultra-smooth linear switches pre-lubed from the factory. 55g spring weight for a perfectly balanced keystroke. 5-pin housing for maximum stability.",
                Price = 55.00M,
                StockQuantity = 300,
                MaxQuantityPerUser = 10,
                MajorImageUrl = "/demo2.jpg",
                MinorImageUrl1 = "/minor4.jpg",
                MinorImageUrl2 = "/minor3.jpg",
                MinorImageUrl3 = "/minor2.jpg",
                MinorImageUrl4 = "/minor1.jpg",
                DocumentUrl = ""
            }
        );
        await dbContext.SaveChangesAsync();
    }
}
// --- END ROLE SEEDER --- // Make sure this is still the very last line of the file!

app.Run();