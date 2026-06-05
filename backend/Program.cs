using UniversityLibrary.Backend.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Извлекаем строку подключения
string connectionString = builder.Configuration.GetConnectionString("MySqlConnection")!;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers(); 

// Настройка CORS (Регистрируем ДО сборки приложения)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddSingleton<IMemberRepository>(new MemberRepository(connectionString));
builder.Services.AddSingleton<IBookRepository>(new BookRepository(connectionString));
builder.Services.AddScoped<IReaderLogRepository>(provider => new ReaderLogRepository(connectionString));

var app = builder.Build();

// ПРАВИЛЬНЫЙ ПОРЯДОК ПОДКЛЮЧЕНИЯ MIDDLEWARE:
// CORS должен идти в самом начале, ОСОБЕННО перед маршрутизацией контроллеров
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Обязательные слои для корректной передачи заголовков в HTTP/HTTPS
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();
