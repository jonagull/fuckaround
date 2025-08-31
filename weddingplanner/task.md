### Invite guest

Lets implement a invite guest feature.

this is a invitation:

```typescript

import { BaseEntity } from "./baseEntity";
import { Personalia } from "./common";
import { Event } from "./event";

export interface Invitation extends BaseEntity {
  eventId: Event["id"];

  guestInfo: Personalia;

  invitedAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;

  /**
   * A number that represents how many people the guest can bring along.
   * 0 means the guest cannot bring along any additional guests.
   */
  additionalGuestsCount: number;

  /**
   * A list of guests that the guest can bring along.
   */
  additionalGuests: Personalia[];
}
```

Lets create endpoints for creating an invite.

We need types:
IRequestCreateInvitation, IResponseCreateInvitation.

We want the types in packages/types

We need to add the requests in packages/frontend-shared/api and then we want query hooks in: packages/frontend-shared/hooks

then we want endpoints in backend:
api/invitation/ (POST for creating)

Then implement this in frontend.
