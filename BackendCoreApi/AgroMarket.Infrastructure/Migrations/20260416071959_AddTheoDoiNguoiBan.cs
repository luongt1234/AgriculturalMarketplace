using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTheoDoiNguoiBan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "theo_doi_nguoi_ban",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_theo_doi_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_ban_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_theo_doi_nguoi_ban", x => x.id);
                    table.ForeignKey(
                        name: "fk_theo_doi_nguoi_ban_nguoi_dung_nguoi_ban_id",
                        column: x => x.nguoi_ban_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_theo_doi_nguoi_ban_nguoi_dung_nguoi_theo_doi_id",
                        column: x => x.nguoi_theo_doi_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_theo_doi_nguoi_ban_nguoi_ban_id",
                table: "theo_doi_nguoi_ban",
                column: "nguoi_ban_id");

            migrationBuilder.CreateIndex(
                name: "ix_theo_doi_nguoi_ban_nguoi_theo_doi_id_nguoi_ban_id",
                table: "theo_doi_nguoi_ban",
                columns: new[] { "nguoi_theo_doi_id", "nguoi_ban_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "theo_doi_nguoi_ban");
        }
    }
}
