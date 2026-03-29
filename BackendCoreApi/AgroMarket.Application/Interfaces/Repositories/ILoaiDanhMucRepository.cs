using AgroMarket.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.Interfaces.Repositories
{
    public interface ILoaiDanhMucRepository
    {
        Task<LoaiDanhMuc?> GetLoaiDanhMucByMaLoaiAsync(string maLoai);
    }
}
