using Microsoft.EntityFrameworkCore;
using WeddingPlannerBackend.Entities;

namespace WeddingPlannerBackend.Data;

public class ApplicationDbContext : DbContext
{
  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
  {
  }

  public DbSet<User> Users { get; set; }
  public DbSet<RefreshToken> RefreshTokens { get; set; }
  public DbSet<Event> Events { get; set; }
  public DbSet<Address> Addresses { get; set; }
  public DbSet<UserEvent> UserEvents { get; set; }
  public DbSet<PlannerInvitation> PlannerInvitations { get; set; }
  public DbSet<Invitation> Invitations { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    // User configuration
    modelBuilder.Entity<User>(entity =>
    {
      entity.HasIndex(u => u.Email).IsUnique();

      entity.HasMany(u => u.RefreshTokens)
              .WithOne(rt => rt.User)
              .HasForeignKey(rt => rt.UserId)
              .OnDelete(DeleteBehavior.Cascade);

      entity.HasMany(u => u.SentInvitations)
              .WithOne(pi => pi.Sender)
              .HasForeignKey(pi => pi.SenderId)
              .OnDelete(DeleteBehavior.Cascade);

      entity.HasMany(u => u.ReceivedInvitations)
              .WithOne(pi => pi.Receiver)
              .HasForeignKey(pi => pi.ReceiverId)
              .OnDelete(DeleteBehavior.Cascade);
    });

    // RefreshToken configuration
    modelBuilder.Entity<RefreshToken>(entity =>
    {
      entity.HasIndex(rt => rt.Token).IsUnique();
    });

    // UserEvent configuration
    modelBuilder.Entity<UserEvent>(entity =>
    {
      entity.HasIndex(ue => new { ue.UserId, ue.EventId }).IsUnique();

      entity.HasOne(ue => ue.Event)
              .WithMany(e => e.Planners)
              .HasForeignKey(ue => ue.EventId)
              .OnDelete(DeleteBehavior.Cascade);

      entity.HasOne(ue => ue.User)
              .WithMany(u => u.UserEvents)
              .HasForeignKey(ue => ue.UserId)
              .OnDelete(DeleteBehavior.Cascade);
    });

    // PlannerInvitation configuration
    modelBuilder.Entity<PlannerInvitation>(entity =>
    {
      entity.HasIndex(pi => new { pi.EventId, pi.ReceiverId }).IsUnique();
      entity.HasIndex(pi => new { pi.ReceiverId, pi.Status });
      entity.HasIndex(pi => new { pi.EventId, pi.Status });

      entity.HasOne(pi => pi.Event)
              .WithMany(e => e.Invitations)
              .HasForeignKey(pi => pi.EventId)
              .OnDelete(DeleteBehavior.Cascade);
    });

    // Invitation configuration
    modelBuilder.Entity<Invitation>(entity =>
    {
      entity.HasIndex(i => new { i.EventId, i.GuestEmail }).IsUnique();
      entity.HasIndex(i => i.EventId);
      entity.HasIndex(i => i.GuestEmail);

      entity.HasOne(i => i.Event)
              .WithMany(e => e.GuestInvitations)
              .HasForeignKey(i => i.EventId)
              .OnDelete(DeleteBehavior.Cascade);
    });

    // Address configuration
    modelBuilder.Entity<Address>(entity =>
    {
      entity.HasMany(a => a.Events)
              .WithOne(e => e.VenueAddress)
              .HasForeignKey(e => e.VenueAddressId)
              .OnDelete(DeleteBehavior.SetNull);
    });

    // Convert enums to strings in database
    modelBuilder.Entity<Event>()
        .Property(e => e.EventType)
        .HasConversion<string>();

    modelBuilder.Entity<UserEvent>()
        .Property(ue => ue.Role)
        .HasConversion<string>();

    modelBuilder.Entity<PlannerInvitation>()
        .Property(pi => pi.Role)
        .HasConversion<string>();

    modelBuilder.Entity<PlannerInvitation>()
        .Property(pi => pi.Status)
        .HasConversion<string>();
  }

  public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
  {
    var entries = ChangeTracker
        .Entries()
        .Where(e => e.Entity is { } &&
                   (e.State == EntityState.Added || e.State == EntityState.Modified));

    foreach (var entityEntry in entries)
    {
      if (entityEntry.Entity.GetType().GetProperty("UpdatedAt") != null)
      {
        entityEntry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
      }

      if (entityEntry.State == EntityState.Added)
      {
        if (entityEntry.Entity.GetType().GetProperty("CreatedAt") != null)
        {
          entityEntry.Property("CreatedAt").CurrentValue = DateTime.UtcNow;
        }
      }
    }

    return base.SaveChangesAsync(cancellationToken);
  }
}
