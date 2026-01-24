namespace AgroMarket.Application.Common.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        Task<int> CommitAsync();
    }
}