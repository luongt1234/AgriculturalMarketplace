using AgroMarket.Domain.Common;
using System.Linq.Expressions;

namespace AgroMarket.Application.Common.Interfaces
{
    public interface IRepository<T> where T : BaseEntity
    {
        IQueryable<T> Query();
        IQueryable<T> GetAll();
        Task<IEnumerable<T>> GetListAllAsync();
        IQueryable<T> GetPaged(int pageSize, int pageNumber);
        Task<T?> GetByIdAsync(Guid id);
        Task<T?> GetByValue(string propertyName, string value);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}