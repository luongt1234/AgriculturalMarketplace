using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddShopConfigToNguoiDung : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_ghim",
                table: "san_pham_dang",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "anh_bia_url",
                table: "nguoi_dung",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "mo_ta_cua_hang",
                table: "nguoi_dung",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_ghim",
                table: "san_pham_dang");

            migrationBuilder.DropColumn(
                name: "anh_bia_url",
                table: "nguoi_dung");

            migrationBuilder.DropColumn(
                name: "mo_ta_cua_hang",
                table: "nguoi_dung");
        }
    }
}
