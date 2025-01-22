using ArticleApi.Repositories.IRepositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UserApi.Models.Dto;
using UserApi.Repositories.IRepositories;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IImageService _imageService;

        public UserController(IUserRepository userRepository, IImageService imageService)
        {
            _userRepository = userRepository;
            _imageService = imageService;
        }

        /// <summary>
        /// Adds a new user to the system.
        /// </summary>
        /// <param name="userDto">The user data transfer object.</param>
        /// <param name="imageUrl">The URL for the user's profile image.</param>
        /// <returns>A response indicating success or failure.</returns>
        [HttpPost]
        public async Task<IActionResult> AddUser([FromForm] UserDto userDto)
        {
            string? imageUrl = null;

            if (userDto.ProfileImage != null)
            {
                imageUrl = await _imageService.SaveImageAsync(userDto.ProfileImage);
            }

            var response = await _userRepository.AddUserAsync(userDto, imageUrl);
            if (!response.IsSuccess) return BadRequest(response);

            return Ok(response);
        }

        /// <summary>
        /// Gets all users from the database (Optional Example).
        /// </summary>
        /// <returns>A list of users.</returns>
        //[HttpGet("GetAllUsers")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var response = await _userRepository.GetAllUsersAsync();
            if (!response.IsSuccess) return BadRequest(response);

            return Ok(response);
        }


        /// <summary>
        /// Gets user by ID (Optional Example).
        /// </summary>
        /// <param name="userId">The ID of the user to retrieve.</param>
        /// <returns>The user data.</returns>
        [HttpGet("{userId:guid}")]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            var response = await _userRepository.GetUserByIdAsync(userId);
            if (!response.IsSuccess) return NotFound(response);

            return Ok(response);
        }

        [HttpPut("{userId:guid}")]
        public async Task<IActionResult> UpdateUser(Guid userId, [FromForm] UserDto userDto)
        {
            string? imageUrl = null;

            if (userDto.ProfileImage != null)
            {
                imageUrl = await _imageService.SaveImageAsync(userDto.ProfileImage);
            }

            var response = await _userRepository.UpdateUserAsync(userId, userDto, imageUrl);
            if (!response.IsSuccess) return BadRequest(response);

            return Ok(response);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new { Message = "Invalid user ID." });
            }

            var response = await _userRepository.DeleteUserAsync(id);

            if (response.IsSuccess)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }


    }
}
