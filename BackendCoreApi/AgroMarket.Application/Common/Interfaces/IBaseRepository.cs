//using AgroMarket.Domain.Common;
//using System.Linq.Expressions;

//namespace AgroMarket.Infrastructure.Repositories
//{
//    public interface IBaseRepository<T> where T : BaseEntity
//    {
//        void Add(T entity);
//        void Delete(T entity);
//        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
//        Task<IEnumerable<T>> GetAllAsync();
//        Task<T?> GetByIdAsync(int id);
//        void Update(T entity);
//    }
//}