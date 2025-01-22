using AutoMapper;
using UserApi.Models.Domain;
using UserApi.Models.Dto;

namespace UserApi.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>().ReverseMap()
                 .ForMember(dest => dest.ProfileImage, opt => opt.Ignore()); // ProfileImage cannot map directly




        }
    }
}
