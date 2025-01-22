namespace UserApi.Models.Dto
{
    public class ResponseDto
    {
        public object Result { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }

        public object data { get; set; }
    }

}
