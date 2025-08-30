import { IRequestCreateEvent, IResponseCreateEvent } from "weddingplanner-types";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../lib/types";

export const createEventFunction = asyncHandler<IRequestCreateEvent, IResponseCreateEvent>(201, async (req) => {

});
