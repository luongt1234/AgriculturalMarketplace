using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updatetabledonhang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "dia_chi_giao_hang",
                table: "don_hang",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ma_van_don_ghn",
                table: "don_hang",
                type: "varchar(50)",
                maxLength: 50,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<decimal>(
                name: "phi_van_chuyen",
                table: "don_hang",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "toa_do_giao_hang",
                table: "don_hang",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dia_chi_giao_hang",
                table: "don_hang");

            migrationBuilder.DropColumn(
                name: "ma_van_don_ghn",
                table: "don_hang");

            migrationBuilder.DropColumn(
                name: "phi_van_chuyen",
                table: "don_hang");

            migrationBuilder.DropColumn(
                name: "toa_do_giao_hang",
                table: "don_hang");
        }
    }
}
