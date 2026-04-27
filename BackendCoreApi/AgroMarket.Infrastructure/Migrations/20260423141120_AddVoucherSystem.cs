using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVoucherSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "voucher",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ma_code = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_voucher = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mo_ta = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    loai_voucher = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    loai_giam_gia = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    gia_tri_giam = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    gia_tri_giam_toi_da = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    gia_tri_don_hang_toi_thieu = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    ngay_bat_dau = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_het_han = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    so_luong = table.Column<int>(type: "int", nullable: false),
                    so_luong_da_dung = table.Column<int>(type: "int", nullable: false),
                    nguoi_ban_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    ap_dung_cho_ids = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_voucher", x => x.id);
                    table.ForeignKey(
                        name: "fk_voucher_nguoi_dung_nguoi_ban_id",
                        column: x => x.nguoi_ban_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "voucher_nguoi_dung",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    voucher_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_dung_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ngay_lay = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    da_dung = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ngay_dung = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_voucher_nguoi_dung", x => x.id);
                    table.ForeignKey(
                        name: "fk_voucher_nguoi_dung_nguoi_dung_nguoi_dung_id",
                        column: x => x.nguoi_dung_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_voucher_nguoi_dung_voucher_voucher_id",
                        column: x => x.voucher_id,
                        principalTable: "voucher",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_voucher_nguoi_ban_id",
                table: "voucher",
                column: "nguoi_ban_id");

            migrationBuilder.CreateIndex(
                name: "ix_voucher_nguoi_dung_nguoi_dung_id",
                table: "voucher_nguoi_dung",
                column: "nguoi_dung_id");

            migrationBuilder.CreateIndex(
                name: "ix_voucher_nguoi_dung_voucher_id_nguoi_dung_id",
                table: "voucher_nguoi_dung",
                columns: new[] { "voucher_id", "nguoi_dung_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "voucher_nguoi_dung");

            migrationBuilder.DropTable(
                name: "voucher");
        }
    }
}
