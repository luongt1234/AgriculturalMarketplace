using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSanPhamYeuThich : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "san_pham_yeu_thich",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_dung_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    san_pham_dang_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_san_pham_yeu_thich", x => x.id);
                    table.ForeignKey(
                        name: "fk_san_pham_yeu_thich_nguoi_dung_nguoi_dung_id",
                        column: x => x.nguoi_dung_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_san_pham_yeu_thich_san_pham_dang_san_pham_dang_id",
                        column: x => x.san_pham_dang_id,
                        principalTable: "san_pham_dang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_san_pham_yeu_thich_nguoi_dung_id_san_pham_dang_id",
                table: "san_pham_yeu_thich",
                columns: new[] { "nguoi_dung_id", "san_pham_dang_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_san_pham_yeu_thich_san_pham_dang_id",
                table: "san_pham_yeu_thich",
                column: "san_pham_dang_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "san_pham_yeu_thich");
        }
    }
}
