using AgroMarket.Domain.Common;

namespace AgroMarket.Domain.Entities
{
    public class CaiDatGiaoDien : BaseEntity
    {
        // Hero Banner
        public string HeroBannerTitle { get; set; } = string.Empty;
        public string HeroBannerSubtitle { get; set; } = string.Empty;
        public string HeroBannerDescription { get; set; } = string.Empty;
        public string HeroBannerImageUrl { get; set; } = string.Empty;
        public string HeroBannerCtaText { get; set; } = string.Empty;
        public string HeroBannerCtaSecondaryText { get; set; } = string.Empty;

        // Footer
        public string FooterCompanyName { get; set; } = string.Empty;
        public string FooterAddress { get; set; } = string.Empty;
        public string FooterPhone { get; set; } = string.Empty;
        public string FooterEmail { get; set; } = string.Empty;
        public string FooterFacebookUrl { get; set; } = string.Empty;
        public string FooterYoutubeUrl { get; set; } = string.Empty;
    }
}
