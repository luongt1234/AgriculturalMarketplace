using System.ComponentModel.DataAnnotations;

namespace AgroMarket.Application.DTOs.SanPhamChuDtos
{
    public class SanPhamChungFormDto
    {
        [Required]
        [MaxLength(200)]
        public string TenSanPham { get; set; }

        [MaxLength(100)]
        public string? loai { get; set; }

        public string? MoTa { get; set; }

        [Required]
        public Guid DonViId { get; set; }
        public Guid? ChaId { get; set; }
    }
}
