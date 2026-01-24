using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Domain.Common;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    // Kế thừa BaseController để dùng lại các hàm Success, Error
    public class BaseCrudController<TEntity, TDto, TCreateDto, TUpdateDto> : BaseController
        where TEntity : BaseEntity
    {
        protected readonly IBaseService<TEntity> _service;
        protected readonly IMapper _mapper;

        public BaseCrudController(IBaseService<TEntity> service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        // 1. GET ALL
        [HttpGet]
        public virtual async Task<IActionResult> GetAll()
        {
            var entities = await _service.GetAllAsync();
            var dtos = _mapper.Map<IEnumerable<TDto>>(entities);
            return Success(dtos, "Lấy dữ liệu thành công");
        }

        // 2. GET BY ID
        [HttpGet("{id}")]
        public virtual async Task<IActionResult> GetById(Guid id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null)
                return Error("Không tìm thấy dữ liệu", 404);

            var dto = _mapper.Map<TDto>(entity);
            return Success(dto);
        }

        // 3. CREATE
        [HttpPost]
        public virtual async Task<IActionResult> Create([FromBody] TCreateDto createDto)
        {
            if (!ModelState.IsValid)
                return Error("Dữ liệu không hợp lệ");

            // Map từ DTO sang Entity
            var entity = _mapper.Map<TEntity>(createDto);

            await _service.CreateAsync(entity);

            // Trả về kết quả (thường sẽ trả về entity vừa tạo hoặc ID)
            var resultDto = _mapper.Map<TDto>(entity);
            return CreatedResult(resultDto, "Tạo mới thành công");
        }

        // 4. UPDATE
        [HttpPut("{id}")]
        public virtual async Task<IActionResult> Update(Guid id, [FromBody] TUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
                return Error("Dữ liệu không hợp lệ");

            var existingEntity = await _service.GetByIdAsync(id);
            if (existingEntity == null)
                return Error("Không tìm thấy dữ liệu cần sửa", 404);

            _mapper.Map(updateDto, existingEntity);
            existingEntity.Id = id; // Đảm bảo ID không bị đổi

            await _service.UpdateAsync(existingEntity);
            return Success("Cập nhật thành công");
        }

        // 5. DELETE
        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null)
                return Error("Không tìm thấy dữ liệu cần xóa", 404);

            await _service.DeleteAsync(id);
            return Success("Xóa thành công");
        }
    }
}