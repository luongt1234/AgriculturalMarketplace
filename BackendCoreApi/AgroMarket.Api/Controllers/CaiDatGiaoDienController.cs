using AgroMarket.Application.DTOs.CaiDatGiaoDien;
using AgroMarket.Application.Interfaces;
using AgroMarket.Api.Attributes;
using AgroMarket.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaiDatGiaoDienController : ControllerBase
    {
        private readonly ICaiDatGiaoDienService _service;

        public CaiDatGiaoDienController(ICaiDatGiaoDienService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _service.GetSettingsAsync();
            return Ok(settings);
        }

        [Authorize(Roles = UserRole.Admin)]
        [RequireAdminPermission(AdminFeaturePermission.ThemeSettings)]
        [HttpPut]
        public async Task<IActionResult> UpdateSettings([FromBody] UpdateCaiDatGiaoDienDto dto)
        {
            var updated = await _service.UpdateSettingsAsync(dto);
            return Ok(updated);
        }
    }
}
