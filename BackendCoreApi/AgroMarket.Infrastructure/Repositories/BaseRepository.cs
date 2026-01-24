using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Domain.Common;
using AgroMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace AgroMarket.Infrastructure.Repositories
{
    public class BaseRepository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.Where(x => !x.IsDeleted).ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public void Add(T entity)
        {
            _dbSet.Add(entity);
        }

        public void Update(T entity)
        {
            entity.NgayChinhSua = DateTime.UtcNow;
            _dbSet.Update(entity);
        }

        public void Delete(T entity)
        {
            entity.IsDeleted = true;
            entity.NgayChinhSua = DateTime.UtcNow;
            _dbSet.Update(entity);
        }
    }
}