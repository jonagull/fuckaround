using System.ComponentModel.DataAnnotations;

namespace WeddingPlannerBackend.Entities;

public enum InvitationStatus
{
    PENDING,
    ACCEPTED,
    REJECTED,
    EXPIRED
}

public class PlannerInvitation
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid EventId { get; set; }
    public Event Event { get; set; } = null!;
    
    [Required]
    public Guid SenderId { get; set; }
    public User Sender { get; set; } = null!;
    
    [Required]
    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; } = null!;
    
    public EventRole Role { get; set; } = EventRole.PLANNER;
    public InvitationStatus Status { get; set; } = InvitationStatus.PENDING;
    
    public string? Message { get; set; }
    
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(7);
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}