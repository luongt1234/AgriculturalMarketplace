using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.SanPhamChuDtos;
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
    public class SanPhamChungController : BaseCrudController<SanPhamChung, SanPhamChungDto, SanPhamChungFormDto>
    {
        private readonly ISanPhamChungService _sanPhamChungService;
        public SanPhamChungController(IBaseService<SanPhamChung> service, IMapper mapper, ISanPhamChungService sanPhamChungService) : base(service, mapper)
        {
            _sanPhamChungService = sanPhamChungService;
        }


    }
}
