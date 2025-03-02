using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using PeliculasAPI;
using PeliculasAPI.Servicios;
using PeliculasAPI.Utilidades;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//builder.Services.AddAutoMapper(typeof(Program));
// Necesario para que Automapper pueda obtener la instancia correspondiente de geometryFactory
builder.Services.AddSingleton(proveedor => new MapperConfiguration(configuracion =>
{
    var geometryFactory = proveedor.GetRequiredService<GeometryFactory>();
    configuracion.AddProfile(new AutoMapperProfiles(geometryFactory));
}).CreateMapper());

// Identity configuration
builder.Services.AddIdentityCore<IdentityUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<UserManager<IdentityUser>>(); // para gestionar usuarios
builder.Services.AddScoped<SignInManager<IdentityUser>>(); // para loguear al usuario

builder.Services.AddAuthentication().AddJwtBearer(opciones =>
{
    opciones.MapInboundClaims = false; // evitar que asp cambie los nombres de los claims

    opciones.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true, // validar llave privada
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["llavejwt"]!)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(opciones =>
{
    opciones.AddPolicy("esadmin", politica => politica.RequireClaim("esadmin"));
});

// builder.Configuration.GetConnectionString("DefaultConnection")
builder.Services.AddDbContext<ApplicationDbContext>(opciones =>
opciones.UseSqlServer("name=DefaultConnection", // EF shorthand to search for DefaultConnection
sqlServer => sqlServer.UseNetTopologySuite())); // required to handle Point (geography) datatype

// Configure GeometryFactory with SRID 4326
builder.Services.AddSingleton<GeometryFactory>(NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326));

builder.Services.AddOutputCache(opciones =>
{
    opciones.DefaultExpirationTimeSpan = TimeSpan.FromSeconds(60);
});

// Obtain list of urls
var origenesPermitidos = builder.Configuration.GetValue<string>("OrigenesPermitidos")!.Split(",");

// Cors policy
builder.Services.AddCors(opciones =>
{
    opciones.AddDefaultPolicy(opcionesCORS =>
    {
        opcionesCORS.WithOrigins(origenesPermitidos).AllowAnyMethod().AllowAnyHeader()
        .WithExposedHeaders("cantidad-total-registros");
    });
});

//builder.Services.AddTransient<IAlmacenadorArchivos, AlmacenadorArchivosLocal>();
builder.Services.AddTransient<IAlmacenadorArchivos, AlmacenadorArchivosAzure>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<IServicioUsuarios, ServicioUsuarios>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// necesario para servir archivos estáticos (wwwroot)
app.UseStaticFiles();

app.UseCors();

app.UseOutputCache();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
