using AgroMarket.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Domain.Entities
{
    public class LoaiDanhMuc : BaseEntity
    {
        public string MaLoaiDanhMuc { get; set; }
        public string TenLoaiDanhMuc { get; set; } = "";
        public virtual ICollection<DanhMuc> DanhMucs { get; set; } = new List<DanhMuc>();

    }
}
