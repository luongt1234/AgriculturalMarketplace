using AgroMarket.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroMarket.Domain.Entities
{
    /// <summary>
    /// Bảng theo dõi cửa hàng: người mua theo dõi người bán
    /// </summary>
    public class TheoDoiNguoiBan : BaseEntity
    {
        /// <summary>FK → người theo dõi (người mua)</summary>
        public Guid NguoiTheoDoiId { get; set; }

        /// <summary>FK → người được theo dõi (người bán)</summary>
        public Guid NguoiBanId { get; set; }

        // Navigation
        [ForeignKey("NguoiTheoDoiId")]
        public virtual NguoiDung NguoiTheoDoi { get; set; } = null!;

        [ForeignKey("NguoiBanId")]
        public virtual NguoiDung NguoiBan { get; set; } = null!;
    }
}
