    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AgroMarket.Application.DTOs.GiaoHangNhanhDtos
{
    public class GhnSuccessResponse
    {
        public int Code { get; set; }
        public string? Message { get; set; }
        public GhnOrderData? Data { get; set; }
    }

    public class GhnOrderData
    {
        public string? Order_code { get; set; }
        public decimal Total_fee { get; set; }
    }
}
