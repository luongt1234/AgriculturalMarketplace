using AgroMarket.Application.DTOs.CaiDatGiaoDien;
using AgroMarket.Application.Interfaces;
using AgroMarket.Domain.Entities;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Infrastructure.Services
{
    public class CaiDatGiaoDienService : ICaiDatGiaoDienService
    {
        private readonly AppDbContext _context;

        public CaiDatGiaoDienService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CaiDatGiaoDienDto> GetSettingsAsync()
        {
            var entity = await _context.CaiDatGiaoDiens.FirstOrDefaultAsync();
            if (entity == null)
            {
                // Create default if not exists
                entity = new CaiDatGiaoDien
                {
                    HeroBannerTitle = "Trái cây tươi ngon\nThu hoạch sáng nay",
                    HeroBannerSubtitle = "Từ nông trại",
                    HeroBannerDescription = "Trải nghiệm vị ngọt thanh của nông sản cao cấp. Nguồn gốc trực tiếp từ nông dân.",
                    HeroBannerImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCpy2mZAcN5k6BzX_bURHyi3XojFDm1o-Gnx38QJopkLMz2EqKfHDGt7LHFLC41xw6TyrqvLVrjU4kwQCSmPthQ52mXKZtB9RgpReLKgGwiskVB0S5PGURESydMoHJVIv9QRIb-uiI90HKRXRlTzogTVAewTAMrXXq5wJGsbfJ3zfJ2dBakZs7veYoTG7g5pgDnABlLHz_DMoaLgH1CX7_xQq5RvF2-YgVUe1J5K_X7PWnMl7OS5_tPepeyS4Sbjhny1QptTPF-VA",
                    HeroBannerCtaText = "Mua ngay",
                    HeroBannerCtaSecondaryText = "Tìm hiểu thêm",
                    FooterCompanyName = "Nền tảng Nông sản sạch PeachyMarket",
                    FooterAddress = "Phố ABC, Quận XYZ, TP. Hà Nội",
                    FooterPhone = "0123.456.789",
                    FooterEmail = "hotro@peachymarket.vn",
                    FooterFacebookUrl = "#",
                    FooterYoutubeUrl = "#"
                };
                _context.CaiDatGiaoDiens.Add(entity);
                await _context.SaveChangesAsync();
            }

            return MapToDto(entity);
        }

        public async Task<CaiDatGiaoDienDto> UpdateSettingsAsync(UpdateCaiDatGiaoDienDto dto)
        {
            var entity = await _context.CaiDatGiaoDiens.FirstOrDefaultAsync();
            if (entity == null)
            {
                entity = new CaiDatGiaoDien();
                _context.CaiDatGiaoDiens.Add(entity);
            }

            entity.HeroBannerTitle = dto.HeroBannerTitle;
            entity.HeroBannerSubtitle = dto.HeroBannerSubtitle;
            entity.HeroBannerDescription = dto.HeroBannerDescription;
            entity.HeroBannerImageUrl = dto.HeroBannerImageUrl;
            entity.HeroBannerCtaText = dto.HeroBannerCtaText;
            entity.HeroBannerCtaSecondaryText = dto.HeroBannerCtaSecondaryText;
            entity.FooterCompanyName = dto.FooterCompanyName;
            entity.FooterAddress = dto.FooterAddress;
            entity.FooterPhone = dto.FooterPhone;
            entity.FooterEmail = dto.FooterEmail;
            entity.FooterFacebookUrl = dto.FooterFacebookUrl;
            entity.FooterYoutubeUrl = dto.FooterYoutubeUrl;
            entity.NgayChinhSua = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(entity);
        }

        private static CaiDatGiaoDienDto MapToDto(CaiDatGiaoDien entity)
        {
            return new CaiDatGiaoDienDto
            {
                Id = entity.Id,
                HeroBannerTitle = entity.HeroBannerTitle,
                HeroBannerSubtitle = entity.HeroBannerSubtitle,
                HeroBannerDescription = entity.HeroBannerDescription,
                HeroBannerImageUrl = entity.HeroBannerImageUrl,
                HeroBannerCtaText = entity.HeroBannerCtaText,
                HeroBannerCtaSecondaryText = entity.HeroBannerCtaSecondaryText,
                FooterCompanyName = entity.FooterCompanyName,
                FooterAddress = entity.FooterAddress,
                FooterPhone = entity.FooterPhone,
                FooterEmail = entity.FooterEmail,
                FooterFacebookUrl = entity.FooterFacebookUrl,
                FooterYoutubeUrl = entity.FooterYoutubeUrl
            };
        }
    }
}
