using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateDanhMucthemdanhmuccaptren : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "danh_muc_cap_tren_id",
                table: "danh_muc",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "ix_danh_muc_danh_muc_cap_tren_id",
                table: "danh_muc",
                column: "danh_muc_cap_tren_id");

            migrationBuilder.AddForeignKey(
                name: "fk_danh_muc_danh_muc_danh_muc_cap_tren_id",
                table: "danh_muc",
                column: "danh_muc_cap_tren_id",
                principalTable: "danh_muc",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_danh_muc_danh_muc_danh_muc_cap_tren_id",
                table: "danh_muc");

            migrationBuilder.DropIndex(
                name: "ix_danh_muc_danh_muc_cap_tren_id",
                table: "danh_muc");

            migrationBuilder.DropColumn(
                name: "danh_muc_cap_tren_id",
                table: "danh_muc");
        }
    }
}
