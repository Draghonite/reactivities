using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly TokenService tokenService;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService) {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO) {
            var user = await userManager.FindByEmailAsync(loginDTO.Email);
            if (user == null) {
                return Unauthorized();
            }
            var result = await signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);
            if (result.Succeeded) {
                return new UserDTO {
                    DisplayName = user.DisplayName,
                    Image = null,
                    Token = tokenService.CreateToken(user),
                    Username = user.UserName
                };
            }
            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO) {
            if (await userManager.Users.AnyAsync(x => x.Email == registerDTO.Email)) {
                return BadRequest("Email taken");
            }
            if (await userManager.Users.AnyAsync(x => x.UserName == registerDTO.Username)) {
                return BadRequest("Username taken");
            }
            var user = new AppUser {
                DisplayName = registerDTO.DisplayName,
                Email = registerDTO.Email,
                UserName = registerDTO.Username
            };
            var result = await userManager.CreateAsync(user, registerDTO.Password);
            if (result.Succeeded) {
                return ToUserDTO(user);
            }
            return BadRequest("Problem registering user");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser() {
            var user = await userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return ToUserDTO(user);
        }

        private UserDTO ToUserDTO(AppUser user) {
            return new UserDTO {
                DisplayName = user.DisplayName,
                Image = null,
                Token = tokenService.CreateToken(user),
                Username = user.UserName
            };
        }
    }
}