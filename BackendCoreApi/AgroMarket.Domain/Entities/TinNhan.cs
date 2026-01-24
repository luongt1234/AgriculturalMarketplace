using AgroMarket.Domain.Common;
using AgroMarket.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    public class TinNhan : BaseEntity
    {
        public Guid NguoiGuiId { get; set; }
        [ForeignKey("NguoiGuiId")]
        public virtual NguoiDung NguoiGui { get; set; } = null!;

        public Guid NguoiNhanId { get; set; }
        [ForeignKey("NguoiNhanId")]
        public virtual NguoiDung NguoiNhan { get; set; } = null!;

        public string NoiDung { get; set; } = null!;
        public DateTime ThoiGian { get; set; } = DateTime.UtcNow;

        public TrangThaiTinNhan TrangThai { get; set; } = TrangThaiTinNhan.ChuaDoc;
    }
}