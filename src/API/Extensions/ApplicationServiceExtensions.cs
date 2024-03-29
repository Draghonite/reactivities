using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => {
                  policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:5000");
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            services.AddDbContext<DataContext>(options => {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                // use connection string from 'CONNECTION_STRING' env var if provided or if dev, use app.settings, otherwise deconstruct 'DATABASE_URL' env var
                string connStr = Environment.GetEnvironmentVariable("CONNECTION_STRING");

                if (connStr == null && (env == null || env == "Development")) {
                    connStr = config.GetConnectionString("DefaultConnection");
                } else if (connStr == null) {
                    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
                    connUrl = connUrl.Replace("postgres://", string.Empty);
                    var pgUserPass = connUrl.Split("@")[0];
                    var pgHostPortDb = connUrl.Split("@")[1];
                    var pgHostPort = pgHostPortDb.Split("/")[0];
                    var pgDb = pgHostPortDb.Split("/")[1];
                    var pgUser = pgUserPass.Split(":")[0];
                    var pgPass = pgUserPass.Split(":")[1];
                    var pgHost = pgHostPort.Split(":")[0];
                    var pgPort = pgHostPort.Split(":")[1];

                    connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};SSL Mode=Require;TrustServerCertificate=True";
                }
                Console.WriteLine($"Connection String: {connStr}");
                options.UseNpgsql(connStr);
            });
            return services;
        }
    }
}