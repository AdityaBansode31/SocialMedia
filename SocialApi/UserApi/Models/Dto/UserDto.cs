﻿namespace UserApi.Models.Dto
{
    public class UserDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public IFormFile? ProfileImage { get; set; }
    }

}
