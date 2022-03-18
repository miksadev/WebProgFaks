using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Proxies;
using Models;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("FirmaCS");
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ProgramerskaFirmaContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS", builder =>
                      {
                          builder.WithOrigins(new string[]
                          {
                              "https://localhost:7279",
                              "http://127.0.0.1:5500",
                              "https://127.0.0.1:5500",
                              "http://localhost:5500",
                              "https://localhost:5500",
                              })
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                               .WithExposedHeaders("Access-Control-Allow-Origin")
                                .WithHeaders("Access-Control-Allow-Origin", "*");
                      });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CORS");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
