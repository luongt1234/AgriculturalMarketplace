using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.DiaChiNguoiDungDtos;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DiaChiNguoiDungController : BaseCrudController<DiaChiNguoiDung, DiaChiNguoiDungDto, DiaChiNguoiDungFormDto>
    {
        public DiaChiNguoiDungController(IDiaChiNguoiDungService service, IMapper mapper) : base(service, mapper)
        {
        }
    }
}
