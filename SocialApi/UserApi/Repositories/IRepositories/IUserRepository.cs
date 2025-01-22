using UserApi.Models.Dto;

namespace UserApi.Repositories.IRepositories
{
    public interface IUserRepository
    {
        Task<ResponseDto> AddUserAsync(UserDto userDto, string imageUrl);
        Task<ResponseDto> GetAllUsersAsync();
        Task<ResponseDto> GetUserByIdAsync(Guid userId);
        Task<ResponseDto> UpdateUserAsync(Guid userId, UserDto userDto, string? newProfileImageUrl);
        Task<ResponseDto> DeleteUserAsync(Guid userId);
    }
}
