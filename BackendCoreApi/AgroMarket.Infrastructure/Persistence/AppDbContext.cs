using AgroMarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // =========================================================
        // 1. KHAI BÁO CÁC BẢNG (DBSETS)
        // =========================================================
        public DbSet<DanhMuc> DanhMucs { get; set; }
        public DbSet<NguoiDung> NguoiDungs { get; set; }
        public DbSet<SanPhamChung> SanPhamChungs { get; set; }
        public DbSet<SanPhamDang> SanPhamDangs { get; set; }
        public DbSet<DonHang> DonHangs { get; set; }
        public DbSet<ChiTietDonHang> ChiTietDonHangs { get; set; }
        public DbSet<ThanhToan> ThanhToans { get; set; }
        public DbSet<DanhGia> DanhGias { get; set; }
        public DbSet<ViGiaoDich> ViGiaoDichs { get; set; }
        public DbSet<HoaDonDienTu> HoaDonDienTus { get; set; }
        public DbSet<HopDongBaoTieu> HopDongBaoTieus { get; set; }
        public DbSet<LichSuGiaoDich> LichSuGiaoDichs { get; set; }
        public DbSet<NhatKySanPham> NhatKySanPhams { get; set; }
        public DbSet<TinNhan> TinNhans { get; set; }
        public DbSet<YeuCauDangKy> YeuCauDangKys { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================================================
            // 2. CẤU HÌNH TÊN BẢNG (MAPPING TABLE NAMES)
            // Quan trọng: Ép tên bảng về số ít chuẩn tiếng Việt
            // =========================================================
            modelBuilder.Entity<DanhMuc>().ToTable("danh_muc");
            modelBuilder.Entity<NguoiDung>().ToTable("nguoi_dung");
            modelBuilder.Entity<SanPhamChung>().ToTable("san_pham_chung");
            modelBuilder.Entity<SanPhamDang>().ToTable("san_pham_dang");
            modelBuilder.Entity<DonHang>().ToTable("don_hang");
            modelBuilder.Entity<ChiTietDonHang>().ToTable("chi_tiet_don_hang");
            modelBuilder.Entity<ThanhToan>().ToTable("thanh_toan");
            modelBuilder.Entity<DanhGia>().ToTable("danh_gia");
            modelBuilder.Entity<ViGiaoDich>().ToTable("vi_giao_dich");
            modelBuilder.Entity<HoaDonDienTu>().ToTable("hoa_don_dien_tu");
            modelBuilder.Entity<HopDongBaoTieu>().ToTable("hop_dong_bao_tieu");
            modelBuilder.Entity<LichSuGiaoDich>().ToTable("lich_su_giao_dich");
            modelBuilder.Entity<NhatKySanPham>().ToTable("nhat_ky_san_pham");
            modelBuilder.Entity<TinNhan>().ToTable("tin_nhan");
            modelBuilder.Entity<YeuCauDangKy>().ToTable("yeu_cau_dang_ky");

            // =========================================================
            // 3. CẤU HÌNH QUAN HỆ (RELATIONSHIPS)
            // =========================================================

            modelBuilder.Entity<NguoiDung>()
                .HasOne(u => u.VaiTro)
                .WithMany()
                .HasForeignKey(u => u.VaiTroId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SanPhamDang>()
                .HasOne(sp => sp.NguoiBan)
                .WithMany(u => u.CacSanPham)
                .HasForeignKey(sp => sp.NguoiBanId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DonHang>()
                .HasOne(dh => dh.NguoiMua)
                .WithMany(u => u.DonHangMua)
                .HasForeignKey(dh => dh.NguoiMuaId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DonHang>()
                .HasOne(dh => dh.NguoiBan)
                .WithMany(u => u.DonHangBan)
                .HasForeignKey(dh => dh.NguoiBanId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DanhGia>()
                .HasOne(dg => dg.NguoiDanhGia)
                .WithMany()
                .HasForeignKey(dg => dg.NguoiDanhGiaId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DanhGia>()
                .HasOne(dg => dg.NguoiBiDanhGia)
                .WithMany()
                .HasForeignKey(dg => dg.NguoiBiDanhGiaId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SanPhamChung>()
                .HasOne(spc => spc.Cha)
                .WithMany()
                .HasForeignKey(spc => spc.ChaId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<HopDongBaoTieu>()
                .HasOne(hd => hd.NongDan)
                .WithMany()
                .HasForeignKey(hd => hd.NongDanId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<HopDongBaoTieu>()
                .HasOne(hd => hd.DoanhNghiep)
                .WithMany()
                .HasForeignKey(hd => hd.DoanhNghiepId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TinNhan>()
                .HasOne(tn => tn.NguoiGui)
                .WithMany()
                .HasForeignKey(tn => tn.NguoiGuiId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TinNhan>()
                .HasOne(tn => tn.NguoiNhan)
                .WithMany()
                .HasForeignKey(tn => tn.NguoiNhanId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LichSuGiaoDich>()
                .HasOne(ls => ls.NguoiThucHien)
                .WithMany()
                .HasForeignKey(ls => ls.ThucHienBoiId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<NhatKySanPham>()
                .HasOne(nk => nk.NguoiThucHien)
                .WithMany()
                .HasForeignKey(nk => nk.NguoiThucHienId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================================
            // 4. CẤU HÌNH ENUM (CONVERSION)
            // =========================================================
            modelBuilder.Entity<DonHang>().Property(x => x.TrangThai).HasConversion<string>();
            modelBuilder.Entity<DonHang>().Property(x => x.PhuongThucNhanHang).HasConversion<string>();
            modelBuilder.Entity<SanPhamDang>().Property(x => x.TrangThai).HasConversion<string>();
            modelBuilder.Entity<ThanhToan>().Property(x => x.TrangThai).HasConversion<string>();
            modelBuilder.Entity<ThanhToan>().Property(x => x.PhuongThuc).HasConversion<string>();
            modelBuilder.Entity<ViGiaoDich>().Property(x => x.LoaiGiaoDich).HasConversion<string>();
            modelBuilder.Entity<HopDongBaoTieu>().Property(x => x.TrangThai).HasConversion<string>();
            modelBuilder.Entity<TinNhan>().Property(x => x.TrangThai).HasConversion<string>();
            modelBuilder.Entity<YeuCauDangKy>().Property(x => x.TrangThai).HasConversion<string>();

            // =========================================================
            // 5. CẤU HÌNH DECIMAL (TIỀN TỆ)
            // =========================================================
            var decimalProps = new[]
            {
                (typeof(NguoiDung), "SoDu"),
                (typeof(NguoiDung), "SoDuChoXuLy"),
                (typeof(SanPhamDang), "Gia"),
                (typeof(DonHang), "TongTien"),
                (typeof(ChiTietDonHang), "DonGia"),
                (typeof(ThanhToan), "SoTien"),
                (typeof(ViGiaoDich), "SoTien"),
                (typeof(HopDongBaoTieu), "GiaChot")
            };

            foreach (var prop in decimalProps)
            {
                modelBuilder.Entity(prop.Item1).Property(prop.Item2).HasPrecision(18, 2);
            }

            // =========================================================
            // 6. GLOBAL QUERY FILTER (SOFT DELETE)
            // =========================================================
            modelBuilder.Entity<DanhMuc>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<NguoiDung>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<SanPhamChung>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<SanPhamDang>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<DonHang>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<ChiTietDonHang>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<ThanhToan>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<DanhGia>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<ViGiaoDich>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<HoaDonDienTu>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<HopDongBaoTieu>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<LichSuGiaoDich>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<NhatKySanPham>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<TinNhan>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<YeuCauDangKy>().HasQueryFilter(x => !x.IsDeleted);
        }
    }
}