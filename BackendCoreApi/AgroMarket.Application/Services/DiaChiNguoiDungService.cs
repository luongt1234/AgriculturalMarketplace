using AgroMarket.Application.Common.Interfaces;
using AgroMarket.Application.Common.Services;
using AgroMarket.Application.Interfaces.Services;
using AgroMarket.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgroMarket.Application.Services
{
    public class DiaChiNguoiDungService : BaseService<DiaChiNguoiDung>, IDiaChiNguoiDungService
    {
        public DiaChiNguoiDungService(IRepository<DiaChiNguoiDung> repository, IUnitOfWork unitOfWork) : base(repository, unitOfWork)
        {
        }

        public override async Task CreateAsync(DiaChiNguoiDung entity)
        {
            if (entity.IsDefault)
            {
                await RemoveOtherDefaultsAsync(entity.NguoiDungId, null);
            }

            _repository.Add(entity);
            await _unitOfWork.CommitAsync();
        }

        public override async Task UpdateAsync(DiaChiNguoiDung entity)
        {
            if (entity.IsDefault)
            {
                await RemoveOtherDefaultsAsync(entity.NguoiDungId, entity.Id);
            }

            _repository.Update(entity);
            await _unitOfWork.CommitAsync();
        }

        private async Task RemoveOtherDefaultsAsync(Guid userId, Guid? excludeId)
        {
            var otherDefaults = await _repository.GetQueryable()
                .Where(x => x.NguoiDungId == userId && x.IsDefault && (excludeId == null || x.Id != excludeId))
                .ToListAsync();

            foreach (var addr in otherDefaults)
            {
                addr.IsDefault = false;
                _repository.Update(addr);
            }
            // We don't call CommitAsync here because the caller will call it
        }
    }
}
