using AgroMarket.Api.Attributes;
using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.DTOs.LoaiDanhMucDtos;
using AgroMarket.Domain.Entities;
using AgroMarket.Domain.Enums;
using AutoMapper;
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

        [RequireAdminPermission(AdminFeaturePermission.CategoryManagement)]
        public override Task<IActionResult> GetAll() => base.GetAll();

        [RequireAdminPermission(AdminFeaturePermission.CategoryManagement)]
        public override Task<IActionResult> GetPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10) => base.GetPaged(pageNumber, pageSize);

        [RequireAdminPermission(AdminFeaturePermission.CategoryManagement)]
        public override Task<IActionResult> Create([FromBody] LoaiDanhMucFormDto formDto) => base.Create(formDto);

        [RequireAdminPermission(AdminFeaturePermission.CategoryManagement)]
        public override Task<IActionResult> Update(Guid id, [FromBody] LoaiDanhMucFormDto formDto) => base.Update(id, formDto);

        [RequireAdminPermission(AdminFeaturePermission.CategoryManagement)]
        public override Task<IActionResult> Delete(Guid id) => base.Delete(id);
    }
}
