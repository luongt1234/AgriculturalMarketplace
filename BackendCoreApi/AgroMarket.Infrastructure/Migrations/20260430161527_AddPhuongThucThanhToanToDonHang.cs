using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPhuongThucThanhToanToDonHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "phuong_thuc_thanh_toan",
                table: "don_hang",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "phuong_thuc_thanh_toan",
                table: "don_hang");
        }
    }
}
