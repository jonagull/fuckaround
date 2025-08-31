# Guest Invitation Feature - Testing Guide

## How to Test the Guest Invitation Feature

### Prerequisites
- Development server is running (`pnpm dev`)
- You're logged into the application
- You have at least one event created

### Testing Steps

1. **Navigate to an Event**
   - Go to http://localhost:3050
   - Login if needed
   - Click on an existing event from your dashboard
   
2. **Find the Guest Invitations Section**
   - Scroll down on the event detail page
   - You should see a "Guest Invitations" section below the Event Timeline

3. **Send a New Invitation**
   - Click the "Send Invitation" button
   - Fill out the form:
     - First Name: John
     - Last Name: Doe
     - Email: john.doe@example.com
     - Phone Country Code: +1
     - Phone Number: 5551234567
     - Additional Guests Allowed: 2
   - Click "Send Invitation"

4. **Verify Invitation Was Created**
   - The form should reset
   - The invitation should appear in the list
   - Status should show as "Pending" (yellow badge)
   - Should display "+2" badge for additional guests allowed

5. **Test Multiple Invitations**
   - Create 2-3 more invitations with different guest information
   - Verify they all appear in the list

6. **Test Delete Functionality**
   - Click the trash icon on one of the invitations
   - Confirm the deletion when prompted
   - Verify the invitation is removed from the list

### API Endpoints Being Used

- **POST** `/api/guest-invitations` - Create new invitation
- **GET** `/api/guest-invitations/event/:eventId` - Get all invitations for an event
- **PATCH** `/api/guest-invitations/:invitationId` - Update invitation (accept/reject)
- **DELETE** `/api/guest-invitations/:invitationId` - Delete invitation

### What to Check in the Database

If you want to verify in the database:
```sql
-- Check invitations in Prisma Studio
cd backend && pnpm studio

-- Or use SQL directly
SELECT * FROM "Invitation" WHERE "eventId" = 'your-event-id';
```

### Troubleshooting

If invitations aren't working:

1. **Check Browser Console** (F12)
   - Look for any red errors
   - Check network tab for failed API calls

2. **Check Backend Logs**
   - Look at the terminal where `pnpm dev` is running
   - Check for any error messages

3. **Common Issues**
   - Make sure you're logged in
   - Ensure you have OWNER or PLANNER role for the event
   - Check that the backend is running on port 3070

### Features Not Yet Implemented

These features would be part of a complete implementation:
- Guest public link to accept/reject invitations
- Email notifications to guests
- Tracking additional guest details when accepting
- Export guest list to CSV/PDF
- Bulk invitation upload from CSV

## Success Criteria

✅ Can create new invitations with guest details
✅ Can view all invitations for an event
✅ Can delete invitations
✅ Form validates required fields
✅ Shows additional guest count badges
✅ Displays invitation status (pending/accepted/rejected)