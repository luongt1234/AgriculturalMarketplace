using AgroMarket.Domain.Common;

namespace AgroMarket.Application.Common.Interfaces
{
    public interface IBaseService<T> where T : BaseEntity
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<(IEnumerable<T> Items, int TotalRecords)> GetPagedAsync(int pageNumber, int pageSize);
        Task<T?> GetByIdAsync(Guid id);
        Task CreateAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(Guid id);
    }
}