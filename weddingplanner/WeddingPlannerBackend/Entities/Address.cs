using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Entities;

public class Address
{
  [Key]
  public Guid Id { get; set; } = Guid.NewGuid();

  [Required]
  public string Street { get; set; } = string.Empty;

  [Required]
  public string City { get; set; } = string.Empty;

  [Required]
  public string State { get; set; } = string.Empty;

  [Required]
  public string Zip { get; set; } = string.Empty;

  [Required]
  public string Country { get; set; } = string.Empty;

  public double Latitude { get; set; }
  public double Longitude { get; set; }

  [Required]
  public string PlaceId { get; set; } = string.Empty;

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

  // Navigation properties
  public ICollection<Event> Events { get; set; } = new List<Event>();
}
