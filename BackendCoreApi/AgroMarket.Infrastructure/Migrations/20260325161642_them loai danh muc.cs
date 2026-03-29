using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class themloaidanhmuc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "loai",
                table: "danh_muc");

            migrationBuilder.AddColumn<Guid>(
                name: "loai_danh_muc_id",
                table: "danh_muc",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "loai_danh_muc",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ma_loai_danh_muc = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_loai_danh_muc = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_loai_danh_muc", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            // =========================================================================
            // THÊM ĐOẠN NÀY: Chèn 1 dòng dữ liệu mặc định để thỏa mãn Foreign Key
            // =========================================================================
            migrationBuilder.InsertData(
                table: "loai_danh_muc",
                columns: new[] { "id", "ma_loai_danh_muc", "ten_loai_danh_muc", "ngay_tao", "is_deleted" },
                values: new object[] {
                    new Guid("00000000-0000-0000-0000-000000000000"),
                    "MAC_DINH",
                    "Chưa phân loại",
                    DateTime.UtcNow,
                    false
                }
            );
            // =========================================================================

            migrationBuilder.CreateIndex(
                name: "ix_danh_muc_loai_danh_muc_id",
                table: "danh_muc",
                column: "loai_danh_muc_id");

            migrationBuilder.AddForeignKey(
                name: "fk_danh_muc_loai_danh_mucs_loai_danh_muc_id",
                table: "danh_muc",
                column: "loai_danh_muc_id",
                principalTable: "loai_danh_muc",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_danh_muc_loai_danh_mucs_loai_danh_muc_id",
                table: "danh_muc");

            migrationBuilder.DropTable(
                name: "loai_danh_muc");

            migrationBuilder.DropIndex(
                name: "ix_danh_muc_loai_danh_muc_id",
                table: "danh_muc");

            migrationBuilder.DropColumn(
                name: "loai_danh_muc_id",
                table: "danh_muc");

            migrationBuilder.AddColumn<string>(
                name: "loai",
                table: "danh_muc",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
