using AgroMarket.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.DTOs.DiaChiNguoiDungDtos
{
    public class DiaChiNguoiDungFormDto
    {
        public string DiaChi { get; set; }
        /*
            {
                "name": "Thành phố Hà Nội",
                "code": 1,
                "division_type": "thành phố trung ương",
                "codename": "thanh_pho_ha_noi",
                "phone_code": 24,
                "districts": 
                    {
                        "name": "Quận Ba Đình",
                        "code": 1,
                        "division_type": "quận",
                        "codename": "quan_ba_dinh",
                        "province_code": 1,
                        "wards": {
                            "name": "Xã Quang Tiến",
                            "code": 4906,
                            "division_type": "xã",
                            "codename": "xa_quang_tien",
                            "district_code": 148
                        },
            },
        */
        public string TenNguoiNhanHang { get; set; }
        public Guid? LoaiDiaChiId { get; set; }
        public bool IsDefault { get; set; } = false;
        public string SoDienThoai { get; set; }
        public string DiaChiChiTiet { get; set; }
        public Guid NguoiDungId { get; set; }
    }
}
