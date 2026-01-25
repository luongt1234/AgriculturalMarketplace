namespace AgroMarket.Application.Wrappers
{
    public class Response<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public List<string>? Errors { get; set; }

        public Response()
        {
        }

        // Constructor cho trường hợp thành công
        public Response(T data, string message = null)
        {
            Success = true;
            Message = message ?? "Thành công";
            Data = data;
        }

        // Constructor cho trường hợp lỗi
        public Response(string message)
        {
            Success = false;
            Message = message;
        }
    }
}