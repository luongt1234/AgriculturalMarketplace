using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class DanhMuc : BaseEntity
    {
        public Guid LoaiDanhMucId { get; set; }
        public string MaGiaTri { get; set; } = null!; // cot: ma_gia_tri
        public Guid? DanhMucCapTrenId { get; set; }
        public string TenHienThi { get; set; } = null!; // cot: ten_hien_thi
        public int ThuTu { get; set; } = 0;       // cot: thu_tu
        public string? Icon { get; set; } // icon cho danh mục
        [ForeignKey("LoaiDanhMucId")]
        public virtual LoaiDanhMuc LoaiDanhMuc { get; set; } = null!;

        [ForeignKey("DanhMucCapTrenId")]
        public virtual DanhMuc? DanhMucCapTren { get; set; }
        public virtual ICollection<DanhMuc> DanhMucCapDuoi { get; set; } = new HashSet<DanhMuc>();
    }
}