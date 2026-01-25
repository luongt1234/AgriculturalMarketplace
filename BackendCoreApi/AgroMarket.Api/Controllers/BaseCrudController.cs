using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Domain.Common;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
    // Rút gọn: Chỉ còn TDto (ra) và TFormDto (vào)
    public class BaseCrudController<TEntity, TDto, TFormDto> : BaseController
        where TEntity : BaseEntity
    {
        protected readonly IBaseService<TEntity> _service;
        protected readonly IMapper _mapper;

        public BaseCrudController(IBaseService<TEntity> service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public virtual async Task<IActionResult> GetAll()
        {
            var entities = await _service.GetAllAsync();
            var dtos = _mapper.Map<IEnumerable<TDto>>(entities);
            return Success(dtos);
        }

        [HttpGet("{id}")]
        public virtual async Task<IActionResult> GetById(Guid id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null)
                return Error("Không tìm thấy", 404);
            return Success(_mapper.Map<TDto>(entity));
        }

        [HttpPost]
        public virtual async Task<IActionResult> Create([FromBody] TFormDto formDto)
        {
            var entity = _mapper.Map<TEntity>(formDto);
            await _service.CreateAsync(entity);

            return CreatedResult(_mapper.Map<TDto>(entity));
        }

        [HttpPut("{id}")]
        public virtual async Task<IActionResult> Update(Guid id, [FromBody] TFormDto formDto)
        {
            var existingEntity = await _service.GetByIdAsync(id);
            if (existingEntity == null)
                return Error("Không tìm thấy", 404);

            _mapper.Map(formDto, existingEntity);

            existingEntity.Id = id;

            await _service.UpdateAsync(existingEntity);
            return Success("Cập nhật thành công");
        }

        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null)
                return Error("Không tìm thấy", 404);

            await _service.DeleteAsync(id);
            return Success("Xóa thành công");
        }
    }
}