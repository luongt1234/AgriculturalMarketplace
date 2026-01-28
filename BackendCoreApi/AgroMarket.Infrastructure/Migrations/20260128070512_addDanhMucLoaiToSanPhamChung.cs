using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addDanhMucLoaiToSanPhamChung : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "loai_id",
                table: "san_pham_chung",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "ix_san_pham_chung_loai_id",
                table: "san_pham_chung",
                column: "loai_id");

            migrationBuilder.AddForeignKey(
                name: "fk_san_pham_chung_danh_muc_loai_id",
                table: "san_pham_chung",
                column: "loai_id",
                principalTable: "danh_muc",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_san_pham_chung_danh_muc_loai_id",
                table: "san_pham_chung");

            migrationBuilder.DropIndex(
                name: "ix_san_pham_chung_loai_id",
                table: "san_pham_chung");

            migrationBuilder.DropColumn(
                name: "loai_id",
                table: "san_pham_chung");
        }
    }
}
