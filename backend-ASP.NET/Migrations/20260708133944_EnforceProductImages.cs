using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace forgot.password_API.Migrations
{
    /// <inheritdoc />
    public partial class EnforceProductImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MajorImageUrl",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MinorImageUrl1",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MinorImageUrl2",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MinorImageUrl3",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MinorImageUrl4",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MajorImageUrl",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinorImageUrl1",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinorImageUrl2",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinorImageUrl3",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinorImageUrl4",
                table: "Products");
        }
    }
}
