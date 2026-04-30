using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.DTOs.GiaoHangNhanhDtos
{
    public class ShippingOrderResponse
    {
        public bool IsSuccess { get; set; }
        public string? TrackingCode { get; set; }
        public decimal ExpectedFee { get; set; }
        public string? Message { get; set; }
    }
}
