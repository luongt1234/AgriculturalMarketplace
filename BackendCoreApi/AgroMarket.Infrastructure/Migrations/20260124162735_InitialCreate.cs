using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "danh_muc",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    loai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ma_gia_tri = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ten_hien_thi = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    thu_tu = table.Column<int>(type: "int", nullable: false),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_danh_muc", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "yeu_cau_dang_ky",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ten_doanh_nghiep = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ma_so_thue = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nguoi_dai_dien = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email_lien_he = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_dien_thoai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dia_chi_tru_so = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    giay_phep_kinh_doanh_url = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_duyet = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_yeu_cau_dang_ky", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "nguoi_dung",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ten_dang_nhap = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mat_khau_hash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ho_ten = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_dien_thoai = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    dia_chi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    anh_dai_dien_url = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    thong_tin_ngan_hang = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_du = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    so_du_cho_xu_ly = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    vai_tro_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    diem_uy_tin = table.Column<int>(type: "int", nullable: false),
                    kich_hoat = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_nguoi_dung", x => x.id);
                    table.ForeignKey(
                        name: "fk_nguoi_dung_danh_muc_vai_tro_id",
                        column: x => x.vai_tro_id,
                        principalTable: "danh_muc",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "san_pham_chung",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ten_san_pham = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mo_ta = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    don_vi_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    danh_muc_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    cha_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_san_pham_chung", x => x.id);
                    table.ForeignKey(
                        name: "fk_san_pham_chung_danh_muc_danh_muc_id",
                        column: x => x.danh_muc_id,
                        principalTable: "danh_muc",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_san_pham_chung_danh_muc_don_vi_id",
                        column: x => x.don_vi_id,
                        principalTable: "danh_muc",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_san_pham_chung_san_pham_chung_cha_id",
                        column: x => x.cha_id,
                        principalTable: "san_pham_chung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "don_hang",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_mua_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_ban_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    tong_tien = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ghi_chu = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    phuong_thuc_nhan_hang = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_dat_hang_truoc = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_don_hang", x => x.id);
                    table.ForeignKey(
                        name: "fk_don_hang_nguoi_dung_nguoi_ban_id",
                        column: x => x.nguoi_ban_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_don_hang_nguoi_dung_nguoi_mua_id",
                        column: x => x.nguoi_mua_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "tin_nhan",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_gui_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_nhan_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    noi_dung = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    thoi_gian = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_tin_nhan", x => x.id);
                    table.ForeignKey(
                        name: "fk_tin_nhan_nguoi_dung_nguoi_gui_id",
                        column: x => x.nguoi_gui_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_tin_nhan_nguoi_dung_nguoi_nhan_id",
                        column: x => x.nguoi_nhan_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "vi_giao_dich",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_dung_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    so_tien = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    loai_giao_dich = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mo_ta = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_vi_giao_dich", x => x.id);
                    table.ForeignKey(
                        name: "fk_vi_giao_dich_nguoi_dung_nguoi_dung_id",
                        column: x => x.nguoi_dung_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "san_pham_dang",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ten_hien_thi = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    san_pham_chung_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_ban_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    chat_luong_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    gia = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    so_luong = table.Column<int>(type: "int", nullable: false),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    hinh_anh_url = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mo_ta_chi_tiet = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_dang = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_san_pham_dang", x => x.id);
                    table.ForeignKey(
                        name: "fk_san_pham_dang_danh_muc_chat_luong_id",
                        column: x => x.chat_luong_id,
                        principalTable: "danh_muc",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "fk_san_pham_dang_nguoi_dung_nguoi_ban_id",
                        column: x => x.nguoi_ban_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_san_pham_dang_san_pham_chung_san_pham_chung_id",
                        column: x => x.san_pham_chung_id,
                        principalTable: "san_pham_chung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "danh_gia",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    don_hang_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_danh_gia_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nguoi_bi_danh_gia_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    so_sao = table.Column<int>(type: "int", nullable: false),
                    binh_luan = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_danh_gia", x => x.id);
                    table.ForeignKey(
                        name: "fk_danh_gia_don_hang_don_hang_id",
                        column: x => x.don_hang_id,
                        principalTable: "don_hang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_danh_gia_nguoi_dung_nguoi_bi_danh_gia_id",
                        column: x => x.nguoi_bi_danh_gia_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_danh_gia_nguoi_dung_nguoi_danh_gia_id",
                        column: x => x.nguoi_danh_gia_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "hoa_don_dien_tu",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    don_hang_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ngay_xuat = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ma_so_thue = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    duong_dan_pdf = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_hoa_don_dien_tu", x => x.id);
                    table.ForeignKey(
                        name: "fk_hoa_don_dien_tu_don_hang_don_hang_id",
                        column: x => x.don_hang_id,
                        principalTable: "don_hang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "thanh_toan",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    don_hang_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    phuong_thuc = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    so_tien = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_thanh_toan = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_thanh_toan", x => x.id);
                    table.ForeignKey(
                        name: "fk_thanh_toan_don_hang_don_hang_id",
                        column: x => x.don_hang_id,
                        principalTable: "don_hang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "chi_tiet_don_hang",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    don_hang_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    san_pham_dang_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    so_luong = table.Column<int>(type: "int", nullable: false),
                    don_gia = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_chi_tiet_don_hang", x => x.id);
                    table.ForeignKey(
                        name: "fk_chi_tiet_don_hang_don_hang_don_hang_id",
                        column: x => x.don_hang_id,
                        principalTable: "don_hang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_chi_tiet_don_hang_san_pham_dang_san_pham_dang_id",
                        column: x => x.san_pham_dang_id,
                        principalTable: "san_pham_dang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "hop_dong_bao_tieu",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    nong_dan_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    doanh_nghiep_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    san_pham_dang_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    san_luong_cam_ket = table.Column<int>(type: "int", nullable: false),
                    gia_chot = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ngay_thu_hoach_du_kien = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    trang_thai = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_hop_dong_bao_tieu", x => x.id);
                    table.ForeignKey(
                        name: "fk_hop_dong_bao_tieu_nguoi_dung_doanh_nghiep_id",
                        column: x => x.doanh_nghiep_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_hop_dong_bao_tieu_nguoi_dung_nong_dan_id",
                        column: x => x.nong_dan_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_hop_dong_bao_tieu_san_pham_dang_san_pham_dang_id",
                        column: x => x.san_pham_dang_id,
                        principalTable: "san_pham_dang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "nhat_ky_san_pham",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    san_pham_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    hanh_dong = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mo_ta = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    hinh_anh_url = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    thoi_gian = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    nguoi_thuc_hien_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    tx_hash = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_nhat_ky_san_pham", x => x.id);
                    table.ForeignKey(
                        name: "fk_nhat_ky_san_pham_nguoi_dung_nguoi_thuc_hien_id",
                        column: x => x.nguoi_thuc_hien_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_nhat_ky_san_pham_san_pham_dang_san_pham_id",
                        column: x => x.san_pham_id,
                        principalTable: "san_pham_dang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "lich_su_giao_dich",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    don_hang_id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    thanh_toan_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    hanh_dong = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    mo_ta = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    thoi_gian = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    thuc_hien_boi_id = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    ngay_tao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ngay_chinh_sua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    is_deleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_lich_su_giao_dich", x => x.id);
                    table.ForeignKey(
                        name: "fk_lich_su_giao_dich_don_hang_don_hang_id",
                        column: x => x.don_hang_id,
                        principalTable: "don_hang",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_lich_su_giao_dich_nguoi_dung_thuc_hien_boi_id",
                        column: x => x.thuc_hien_boi_id,
                        principalTable: "nguoi_dung",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_lich_su_giao_dich_thanh_toan_thanh_toan_id",
                        column: x => x.thanh_toan_id,
                        principalTable: "thanh_toan",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "ix_chi_tiet_don_hang_don_hang_id",
                table: "chi_tiet_don_hang",
                column: "don_hang_id");

            migrationBuilder.CreateIndex(
                name: "ix_chi_tiet_don_hang_san_pham_dang_id",
                table: "chi_tiet_don_hang",
                column: "san_pham_dang_id");

            migrationBuilder.CreateIndex(
                name: "ix_danh_gia_don_hang_id",
                table: "danh_gia",
                column: "don_hang_id");

            migrationBuilder.CreateIndex(
                name: "ix_danh_gia_nguoi_bi_danh_gia_id",
                table: "danh_gia",
                column: "nguoi_bi_danh_gia_id");

            migrationBuilder.CreateIndex(
                name: "ix_danh_gia_nguoi_danh_gia_id",
                table: "danh_gia",
                column: "nguoi_danh_gia_id");

            migrationBuilder.CreateIndex(
                name: "ix_don_hang_nguoi_ban_id",
                table: "don_hang",
                column: "nguoi_ban_id");

            migrationBuilder.CreateIndex(
                name: "ix_don_hang_nguoi_mua_id",
                table: "don_hang",
                column: "nguoi_mua_id");

            migrationBuilder.CreateIndex(
                name: "ix_hoa_don_dien_tu_don_hang_id",
                table: "hoa_don_dien_tu",
                column: "don_hang_id");

            migrationBuilder.CreateIndex(
                name: "ix_hop_dong_bao_tieu_doanh_nghiep_id",
                table: "hop_dong_bao_tieu",
                column: "doanh_nghiep_id");

            migrationBuilder.CreateIndex(
                name: "ix_hop_dong_bao_tieu_nong_dan_id",
                table: "hop_dong_bao_tieu",
                column: "nong_dan_id");

            migrationBuilder.CreateIndex(
                name: "ix_hop_dong_bao_tieu_san_pham_dang_id",
                table: "hop_dong_bao_tieu",
                column: "san_pham_dang_id");

            migrationBuilder.CreateIndex(
                name: "ix_lich_su_giao_dich_don_hang_id",
                table: "lich_su_giao_dich",
                column: "don_hang_id");

            migrationBuilder.CreateIndex(
                name: "ix_lich_su_giao_dich_thanh_toan_id",
                table: "lich_su_giao_dich",
                column: "thanh_toan_id");

            migrationBuilder.CreateIndex(
                name: "ix_lich_su_giao_dich_thuc_hien_boi_id",
                table: "lich_su_giao_dich",
                column: "thuc_hien_boi_id");

            migrationBuilder.CreateIndex(
                name: "ix_nguoi_dung_vai_tro_id",
                table: "nguoi_dung",
                column: "vai_tro_id");

            migrationBuilder.CreateIndex(
                name: "ix_nhat_ky_san_pham_nguoi_thuc_hien_id",
                table: "nhat_ky_san_pham",
                column: "nguoi_thuc_hien_id");

            migrationBuilder.CreateIndex(
                name: "ix_nhat_ky_san_pham_san_pham_id",
                table: "nhat_ky_san_pham",
                column: "san_pham_id");

            migrationBuilder.CreateIndex(
                name: "ix_san_pham_chung_cha_id",
                table: "san_pham_chung",
                column: "cha_id");

            migrationBuilder.CreateIndex(
                name: "ix_san_pham_chung_danh_muc_id",
                table: "san_pham_chung",
                column: "danh_muc_id");

            migrationBuilder.CreateIndex(
                name: "ix_san_pham_chung_don_vi_id",
                table: "san_pham_chung",
                column: "don_vi_id");

            migrationBuilder.CreateIndex(
                name: "ix_san_pham_dang_chat_luong_id",
                table: "san_pham_dang",
                column: "chat_luong_id");

            migrationBuilder.CreateIndex(
                name: "ix_san_pham_dang_nguoi_ban_id",
                table: "san_pham_dang",
                column: "nguoi_ban_id");

            migrationBuilder.CreateIndex(
                name: "ix_san_pham_dang_san_pham_chung_id",
                table: "san_pham_dang",
                column: "san_pham_chung_id");

            migrationBuilder.CreateIndex(
                name: "ix_thanh_toan_don_hang_id",
                table: "thanh_toan",
                column: "don_hang_id");

            migrationBuilder.CreateIndex(
                name: "ix_tin_nhan_nguoi_gui_id",
                table: "tin_nhan",
                column: "nguoi_gui_id");

            migrationBuilder.CreateIndex(
                name: "ix_tin_nhan_nguoi_nhan_id",
                table: "tin_nhan",
                column: "nguoi_nhan_id");

            migrationBuilder.CreateIndex(
                name: "ix_vi_giao_dich_nguoi_dung_id",
                table: "vi_giao_dich",
                column: "nguoi_dung_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "chi_tiet_don_hang");

            migrationBuilder.DropTable(
                name: "danh_gia");

            migrationBuilder.DropTable(
                name: "hoa_don_dien_tu");

            migrationBuilder.DropTable(
                name: "hop_dong_bao_tieu");

            migrationBuilder.DropTable(
                name: "lich_su_giao_dich");

            migrationBuilder.DropTable(
                name: "nhat_ky_san_pham");

            migrationBuilder.DropTable(
                name: "tin_nhan");

            migrationBuilder.DropTable(
                name: "vi_giao_dich");

            migrationBuilder.DropTable(
                name: "yeu_cau_dang_ky");

            migrationBuilder.DropTable(
                name: "thanh_toan");

            migrationBuilder.DropTable(
                name: "san_pham_dang");

            migrationBuilder.DropTable(
                name: "don_hang");

            migrationBuilder.DropTable(
                name: "san_pham_chung");

            migrationBuilder.DropTable(
                name: "nguoi_dung");

            migrationBuilder.DropTable(
                name: "danh_muc");
        }
    }
}
