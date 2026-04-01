using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Domain.Common;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace AgroMarket.Api.Controllers
{
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

        [HttpGet("paged")]
        public virtual async Task<IActionResult> GetPaged([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var (entities, totalRecords) = await _service.GetPagedAsync(pageNumber, pageSize);
                var dtos = _mapper.Map<IEnumerable<TDto>>(entities);
                return PagedResult(dtos, pageNumber, pageSize, totalRecords);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message + ex.InnerException + ex.StackTrace);
            }
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
            try
            {
                var entity = _mapper.Map<TEntity>(formDto);
                await _service.CreateAsync(entity);

                return CreatedResult(_mapper.Map<TDto>(entity));
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message + ex.InnerException + ex.StackTrace);
            }
            
        }

        [HttpPut("{id}")]
        public virtual async Task<IActionResult> Update(Guid id, [FromBody] TFormDto formDto)
        {
            try
            {
                var existingEntity = await _service.GetByIdAsync(id);
                if (existingEntity == null)
                    return Error("Không tìm thấy", 404);

                existingEntity = _mapper.Map(formDto, existingEntity);

                existingEntity.Id = id;

                await _service.UpdateAsync(existingEntity);
                return Success("Cập nhật thành công");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message + ex.InnerException + ex.StackTrace);
            }
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