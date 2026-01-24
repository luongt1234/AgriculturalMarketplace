using AgroMarket.Domain.Common;

namespace AgroMarket.Application.Common.Interfaces
{
    public interface IBaseService<T> where T : BaseEntity
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task CreateAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
    }
}