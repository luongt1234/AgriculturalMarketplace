using AgroMarket.Domain.Common;
using System.Linq.Expressions;

namespace AgroMarket.Application.Common.Interfaces
{
    public interface IRepository<T> where T : BaseEntity
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}