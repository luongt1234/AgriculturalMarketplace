namespace AgroMarket.Domain.Common
{
    public abstract class BaseEntity
    {
        public Guid Id { get; set; }
        public DateTime NgayTao { get; set; } = DateTime.UtcNow;
        public DateTime? NgayChinhSua { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}