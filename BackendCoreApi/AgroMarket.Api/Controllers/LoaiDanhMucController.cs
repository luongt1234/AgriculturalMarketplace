using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.LoaiDanhMucDtos;
using AgroMarket.Application.DTOs.NguoiDungDtos;
using AgroMarket.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoaiDanhMucController : BaseCrudController<LoaiDanhMuc, LoaiDanhMucDto, LoaiDanhMucFormDto>
    {
        public LoaiDanhMucController(IBaseService<LoaiDanhMuc> service, IMapper mapper) : base(service, mapper)
        {
        }
    }
}
