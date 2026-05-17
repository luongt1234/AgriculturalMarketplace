using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSanPhamDangIdToDanhGia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Phải drop FK constraint trước khi drop index (MySQL requirement)
            migrationBuilder.DropForeignKey(
                name: "fk_danh_gia_don_hang_don_hang_id",
                table: "danh_gia");

            migrationBuilder.DropIndex(
                name: "ix_danh_gia_don_hang_id",
                table: "danh_gia");

            migrationBuilder.AddColumn<Guid>(
                name: "san_pham_dang_id",
                table: "danh_gia",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            // Khôi phục lại FK cho don_hang_id
            migrationBuilder.AddForeignKey(
                name: "fk_danh_gia_don_hang_don_hang_id",
                table: "danh_gia",
                column: "don_hang_id",
                principalTable: "don_hang",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.CreateIndex(
                name: "ix_danh_gia_don_hang_id_san_pham_dang_id",
                table: "danh_gia",
                columns: new[] { "don_hang_id", "san_pham_dang_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_danh_gia_san_pham_dang_id",
                table: "danh_gia",
                column: "san_pham_dang_id");

            migrationBuilder.AddForeignKey(
                name: "fk_danh_gia_san_pham_dang_san_pham_dang_id",
                table: "danh_gia",
                column: "san_pham_dang_id",
                principalTable: "san_pham_dang",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_danh_gia_san_pham_dang_san_pham_dang_id",
                table: "danh_gia");

            migrationBuilder.DropIndex(
                name: "ix_danh_gia_don_hang_id_san_pham_dang_id",
                table: "danh_gia");

            migrationBuilder.DropIndex(
                name: "ix_danh_gia_san_pham_dang_id",
                table: "danh_gia");

            migrationBuilder.DropColumn(
                name: "san_pham_dang_id",
                table: "danh_gia");

            migrationBuilder.CreateIndex(
                name: "ix_danh_gia_don_hang_id",
                table: "danh_gia",
                column: "don_hang_id");
        }
    }
}
