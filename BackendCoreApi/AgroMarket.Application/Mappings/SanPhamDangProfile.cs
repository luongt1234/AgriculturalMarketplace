using AgroMarket.Application.DTOs.SanPhamDangDtos;
using AgroMarket.Domain.Entities;
using AutoMapper;
using AgroMarket.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Mappings
{
    public class SanPhamDangProfile : Profile
    {
        public SanPhamDangProfile()
        {
            CreateMap<SanPhamDang, SanPhamDangDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.TenHienThi, opt => opt.MapFrom(src => src.TenHienThi))
                .ForMember(dest => dest.Gia, opt => opt.MapFrom(src => src.Gia))
                .ForMember(dest => dest.SoLuong, opt => opt.MapFrom(src => src.SoLuong))
                .ForMember(dest => dest.TrangThai, opt => opt.MapFrom(src => src.TrangThai.ToString()))
                .ForMember(dest => dest.HinhAnhUrl, opt => opt.MapFrom(src => src.HinhAnhUrl))
                .ForMember(dest => dest.MoTaChiTiet, opt => opt.MapFrom(src => src.MoTaChiTiet))
                .ForMember(dest => dest.NgayDang, opt => opt.MapFrom(src => src.NgayDang))
                .ForMember(dest => dest.SanPhamChungId, opt => opt.MapFrom(src => src.SanPhamChungId))
                .ForMember(dest => dest.NguoiBanId, opt => opt.MapFrom(src => src.NguoiBanId))
                .ForMember(dest => dest.ChatLuongId, opt => opt.MapFrom(src => src.ChatLuongId))
                .ForMember(dest => dest.TenSanPhamChung, opt => opt.MapFrom(src => src.SanPhamChung != null ? src.SanPhamChung.TenSanPham : null))
                .ForMember(dest => dest.TenNguoiBan, opt => opt.MapFrom(src => src.NguoiBan != null ? src.NguoiBan.HoTen : null))
                .ForMember(dest => dest.AnhDaiDienNguoiBan, opt => opt.MapFrom(src => src.NguoiBan != null ? src.NguoiBan.AnhDaiDienUrl : null))
                .ForMember(dest => dest.TenChatLuong, opt => opt.MapFrom(src => src.ChatLuong != null ? src.ChatLuong.TenHienThi : null))
                .ForMember(dest => dest.TenDonVi, opt => opt.MapFrom(src => (src.SanPhamChung != null && src.SanPhamChung.DonVi != null) ? src.SanPhamChung.DonVi.TenHienThi : null))
                .ForMember(dest => dest.TenLoai, opt => opt.MapFrom(src => (src.SanPhamChung != null && src.SanPhamChung.Loai != null) ? src.SanPhamChung.Loai.TenHienThi : null))
                .ForMember(dest => dest.DonViId, opt => opt.MapFrom(src => src.SanPhamChung != null ? src.SanPhamChung.DonViId : (Guid?)null))
                .ForMember(dest => dest.LoaiId, opt => opt.MapFrom(src => src.SanPhamChung != null ? src.SanPhamChung.LoaiId : (Guid?)null));

            CreateMap<SanPhamDangFormDto, SanPhamDang>()
                .ForMember(dest => dest.TenHienThi, opt => opt.MapFrom(src => src.TenHienThi))
                .ForMember(dest => dest.SanPhamChungId, opt => opt.MapFrom(src => src.SanPhamChungId))
                .ForMember(dest => dest.ChatLuongId, opt => opt.MapFrom(src => src.ChatLuongId))
                .ForMember(dest => dest.Gia, opt => opt.MapFrom(src => src.Gia))
                .ForMember(dest => dest.SoLuong, opt => opt.MapFrom(src => src.SoLuong))
                .ForMember(dest => dest.MoTaChiTiet, opt => opt.MapFrom(src => src.MoTaChiTiet))
                .ForMember(dest => dest.TrangThai, opt => 
                    opt.MapFrom(src => MapTrangThai(src.TrangThai)))
                .ForMember(dest => dest.HinhAnhUrl, opt => opt.Ignore());
        }
        private static TrangThaiSanPham MapTrangThai(string? trangThai)
        {
            if (string.IsNullOrEmpty(trangThai))
                return TrangThaiSanPham.ConHang;

            return Enum.TryParse<TrangThaiSanPham>(trangThai, true, out var val)
                ? val
                : TrangThaiSanPham.ConHang;
        }
    }
}
