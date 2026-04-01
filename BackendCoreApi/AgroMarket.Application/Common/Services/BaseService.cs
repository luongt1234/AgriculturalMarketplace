using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Application.Common.Services
{
    public class BaseService<T> : IBaseService<T> where T : BaseEntity
    {
        protected readonly IRepository<T> _repository;
        protected readonly IUnitOfWork _unitOfWork;

        public BaseService(IRepository<T> repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _repository.GetListAllAsync();
        }

        public virtual async Task<(IEnumerable<T> Items, int TotalRecords)> GetPagedAsync(int pageNumber, int pageSize)
        {
            var query = _repository.GetQueryable();

            var totalRecords = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalRecords);
        }

        public virtual async Task<T?> GetByIdAsync(Guid id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public virtual async Task CreateAsync(T entity)
        {
            _repository.Add(entity);
            await _unitOfWork.CommitAsync();
        }

        public virtual async Task UpdateAsync(T entity)
        {
            _repository.Update(entity);
            await _unitOfWork.CommitAsync();
        }

        public virtual async Task DeleteAsync(Guid id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity != null)
            {
                _repository.Delete(entity);
                await _unitOfWork.CommitAsync();
            }
        }
    }
}