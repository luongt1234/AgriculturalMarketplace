export interface CaiDatGiaoDienDto {
    id: string;
    heroBannerTitle: string;
    heroBannerSubtitle: string;
    heroBannerDescription: string;
    heroBannerImageUrl: string;
    heroBannerCtaText: string;
    heroBannerCtaSecondaryText: string;
    footerCompanyName: string;
    footerAddress: string;
    footerPhone: string;
    footerEmail: string;
    footerFacebookUrl: string;
    footerYoutubeUrl: string;
}

export type UpdateCaiDatGiaoDienDto = Omit<CaiDatGiaoDienDto, 'id'>;
