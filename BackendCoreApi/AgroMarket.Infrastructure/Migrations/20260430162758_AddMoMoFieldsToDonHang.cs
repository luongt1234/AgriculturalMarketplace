using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMoMoFieldsToDonHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "mo_mo_request_id",
                table: "don_hang",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<long>(
                name: "mo_mo_trans_id",
                table: "don_hang",
                type: "bigint",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "mo_mo_request_id",
                table: "don_hang");

            migrationBuilder.DropColumn(
                name: "mo_mo_trans_id",
                table: "don_hang");
        }
    }
}
