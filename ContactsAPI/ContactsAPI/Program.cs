using ContactsAPI.Helpers;
using ContactsAPI.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Dodawanie obs³ugi
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<JwtService>();

// Konfiguracja kontekstu bazy danych
builder.Services.AddDbContext<ContactsAppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ContactsAppConnection")));

var app = builder.Build();

// Umo¿liwienie komunikacji z front-endem
app.UseCors(options => options
    .WithOrigins(new[] { "http://localhost:3000" , "http://localhost:7292", "http://localhost:5021" })
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
);

// Konfiguracja Swaggera i UI Swaggera w trybie developerskim
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
