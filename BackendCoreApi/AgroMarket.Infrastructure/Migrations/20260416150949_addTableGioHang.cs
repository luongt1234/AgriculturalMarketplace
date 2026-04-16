using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addTableGioHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "gio_hang",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_dung_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_gio_hang", x => x.id);
                    table.ForeignKey(
                        name: "fk_gio_hang_nguoi_dung_nguoi_dung_id",
                        column: x => x.nguoi_dung_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "chi_tiet_gio_hang",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    gio_hang_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    san_pham_dang_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    so_luong = table.Column<int>(type: "int", nullable: false),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_chi_tiet_gio_hang", x => x.id);
                    table.ForeignKey(
                        name: "fk_chi_tiet_gio_hang_gio_hang_gio_hang_id",
                        column: x => x.gio_hang_id,
                        principalTable: "gio_hang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_chi_tiet_gio_hang_san_pham_dang_san_pham_dang_id",
                        column: x => x.san_pham_dang_id,
                        principalTable: "san_pham_dang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_chi_tiet_gio_hang_gio_hang_id",
                table: "chi_tiet_gio_hang",
                column: "gio_hang_id");

            migrationBuilder.CreateIndex(
                name: "ix_chi_tiet_gio_hang_san_pham_dang_id",
                table: "chi_tiet_gio_hang",
                column: "san_pham_dang_id");

            migrationBuilder.CreateIndex(
                name: "ix_gio_hang_nguoi_dung_id",
                table: "gio_hang",
                column: "nguoi_dung_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "chi_tiet_gio_hang");

            migrationBuilder.DropTable(
                name: "gio_hang");
        }
    }
}
