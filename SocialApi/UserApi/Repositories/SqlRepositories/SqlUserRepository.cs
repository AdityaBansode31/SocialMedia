using ArticleApi.Repositories.IRepositories;
using AutoMapper;
using MySql.Data.MySqlClient;
using System.Data;
using System.Text.Json;
using UserApi.Models.Domain;
using UserApi.Models.Dto;
using UserApi.Repositories.IRepositories;

namespace UserApi.Repositories.SqlRepositories
{
    public class SqlUserRepository : IUserRepository
    {
        private readonly string _connectionString;
        private readonly IMapper _mapper;
        private readonly IImageService _imageService;

        public SqlUserRepository(IConfiguration configuration, IMapper mapper, IImageService imageService)
        {
            _connectionString = configuration.GetConnectionString("MySQLDBString");
            _mapper = mapper;
            _imageService = imageService;
        }

        public async Task<ResponseDto> AddUserAsync(UserDto userDto, string imageUrl)
        {
            var response = new ResponseDto();

            try
            {
                // Map DTO to Domain Model (User)
                var user = _mapper.Map<User>(userDto);
                user.UserId = Guid.NewGuid();
                user.ProfileImage = imageUrl;
                user.CreatedDate = DateTime.UtcNow;

                // Serialize the User object to JSON
                string jsonData = JsonSerializer.Serialize(user);

                using (var connection = new MySqlConnection(_connectionString))
                {
                    using (var command = new MySqlCommand("CreateUser", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        // Input parameter for the JSON input
                        command.Parameters.AddWithValue("@jsonInput", jsonData);

                        // Output parameter for createdUserId
                        var createdUserIdParam = new MySqlParameter("@createdUserId", MySqlDbType.VarChar, 36)
                        {
                            Direction = ParameterDirection.Output
                        };
                        command.Parameters.Add(createdUserIdParam);

                        // Output parameter for errorMessage
                        var errorMessageParam = new MySqlParameter("@errorMessage", MySqlDbType.VarChar, 255)
                        {
                            Direction = ParameterDirection.Output
                        };
                        command.Parameters.Add(errorMessageParam);

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();

                        // Retrieve output parameters
                        string createdUserId = createdUserIdParam.Value?.ToString();
                        string errorMessage = errorMessageParam.Value?.ToString();

                        if (!string.IsNullOrEmpty(errorMessage))
                        {
                            // If an error message is returned, treat it as a failure
                            response.Result = null;
                            response.IsSuccess = false;
                            response.Message = errorMessage;
                        }
                        else
                        {
                            // Successful execution
                            user.UserId = Guid.Parse(createdUserId);
                            response.Result = user;
                            response.IsSuccess = true;
                            response.Message = "User added successfully.";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.Result = null;
                response.IsSuccess = false;
                response.Message = $"Error: {ex.Message}";
            }

            return response;
        }

        public async Task<ResponseDto> GetAllUsersAsync()
        {
            var response = new ResponseDto();

            try
            {
                // Initialize a list to store User objects
                var userList = new List<User>();

                using (var connection = new MySqlConnection(_connectionString))
                {
                    using (var command = new MySqlCommand("GetAllUsers", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        await connection.OpenAsync();
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                // Map database rows to the User object
                                userList.Add(new User
                                {
                                    UserId = reader.GetGuid("UserId"),
                                    UserName = reader.GetString("UserName"),
                                    Email = reader.GetString("Email"),
                                    PasswordHash = reader.GetString("PasswordHash"),
                                    ProfileImage = reader.IsDBNull(reader.GetOrdinal("ProfileImage")) ? null : reader.GetString("ProfileImage"),
                                    Role = reader.GetString("Role"),
                                    CreatedDate = reader.GetDateTime("CreatedDate"),
                                    LastUpdatedDate = reader.GetDateTime(reader.GetOrdinal("LastUpdatedDate")),
                                });
                            }
                        }
                    }
                }

                // Map the domain user list to UserDto
                //var userDtoList = userList.Select(user => new UserDto
                //{
                //    UserName = user.UserName,
                //    Email = user.Email,
                //    PasswordHash = user.PasswordHash,
                //    Role = user.Role,
                //    ProfileImage = user.ProfileImage,
                //    // ProfileImage is not included in the DTO, so we skip it
                //}).ToList();

                // Set the response
                response.IsSuccess = true;
                response.Result = userList;
                response.Message = "Users retrieved successfully.";
            }
            catch (Exception ex)
            {
                // Handle any errors
                response.IsSuccess = false;
                response.Result = null;
                response.Message = $"Error: {ex.Message}";
            }

            return response;
        }

        public async Task<ResponseDto> GetUserByIdAsync(Guid userId)
        {
            var response = new ResponseDto();

            try
            {
                User user = null;

                using (var connection = new MySqlConnection(_connectionString))
                {
                    using (var command = new MySqlCommand("GetUserById", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@UserId", userId);

                        await connection.OpenAsync();
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                              
                                user = new User
                                {

                                    UserId = reader.GetGuid("UserId"),
                                    UserName = reader.GetString("UserName"),
                                    Email = reader.GetString("Email"),
                                    PasswordHash = reader.GetString("PasswordHash"),
                                    ProfileImage = reader.IsDBNull(reader.GetOrdinal("ProfileImage")) ? null : reader.GetString("ProfileImage"),
                                    Role = reader.GetString("Role"),
                                    CreatedDate = reader.GetDateTime("CreatedDate"),
                                    LastUpdatedDate = reader.GetDateTime(reader.GetOrdinal("LastUpdatedDate")),
                                };
                            }
                        }
                    }
                }

                if (user != null)
                {
                    response.IsSuccess = true;
                    response.Result = user;
                    response.Message = "User retrieved successfully.";
                }
                else
                {
                    response.IsSuccess = false;
                    response.Message = "User not found.";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Result = null;
                response.Message = $"Error: {ex.Message}";
            }

            return response;
        }

        public async Task<ResponseDto> UpdateUserAsync(Guid id, UserDto userDto, string? newProfileImageUrl)
        {
            var response = new ResponseDto();

            try
            {
                // Serialize input data
                var jsonData = JsonSerializer.Serialize(new
                {
                    userDto.UserName,
                    userDto.Email,
                    userDto.PasswordHash,
                    userDto.Role,
                    ProfileImage = newProfileImageUrl
                });

                Console.WriteLine($"Serialized JSON: {jsonData}"); // Debugging

                string? oldImageUrl = null;

                using (var connection = new MySqlConnection(_connectionString))
                {
                    using (var command = new MySqlCommand("UpdateUser", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@v_userId", id.ToString());
                        command.Parameters.AddWithValue("@jsonInput", jsonData);

                        var oldImageUrlParam = new MySqlParameter("@oldImageUrl", MySqlDbType.VarChar, 255)
                        {
                            Direction = ParameterDirection.Output
                        };
                        command.Parameters.Add(oldImageUrlParam);

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();

                        oldImageUrl = oldImageUrlParam.Value?.ToString();
                    }
                }

                // Delete old profile image if it exists and a new one is provided
                if (!string.IsNullOrEmpty(newProfileImageUrl) && !string.IsNullOrEmpty(oldImageUrl))
                {
                    await _imageService.DeleteImageAsync(oldImageUrl);
                }

                response.IsSuccess = true;
                response.Message = "User updated successfully.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"Error: {ex.Message}";
            }

            return response;
        }

        public async Task<ResponseDto> DeleteUserAsync(Guid id)
        {
            var response = new ResponseDto();

            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    string? imageUrl = null;

                    using (var command = new MySqlCommand("DeleteUser", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@v_UserId", id);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                imageUrl = reader["ProfileImageUrl"] as string;
                            }
                        }
                    }

                    // Delete the image file if the URL exists
                    if (!string.IsNullOrEmpty(imageUrl))
                    {
                        await _imageService.DeleteImageAsync(imageUrl);
                    }

                    response.IsSuccess = true;
                    response.Message = "User deleted successfully.";
                }
            }
            catch (MySqlException ex) when (ex.Number == 1644) // Custom error for "User not found."
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"Error: {ex.Message}";
            }

            return response;
        }

    }
}
