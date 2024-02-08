import { z } from 'zod'

export const updateConfigSchema = z.object({
  availability_calendar_ids: z.array(z.string()),
  availability_open_hours: z.array(
    z.object({
      days: z.array(z.number()),
      start: z.string(),
      end: z.string(),
      timezone: z.string(),
    }),
  ),
  booking_calendar_id: z.string(),
  event_title: z.string().optional(),
  event_description: z.string().optional(),
})

export type UpdateConfigData = z.infer<typeof updateConfigSchema>

export const participantSchema = z.object({
  name: z.string(),
  email: z.string(),
  calendar_ids: z.array(z.string()),
  open_hours: z.array(
    z.object({
      days: z.array(z.number()),
      start: z.string(),
      end: z.string(),
      timezone: z.string(),
    }),
  ),
})

export const additionalFieldSchema = z.object({
  key: z.string(),
  validation_type: z.enum(['0', '1', '2', '3', '4']),
  validation_message: z.string(),
  required: z.boolean(),
  validation_regex: z.string().optional(), // Optional since not all fields have it
})

export const eventBookingSchema = z.object({
  title: z.string(),
  description: z.string(),
  organizer: z.object({
    email: z.string(),
    calendar_id: z.string(),
  }),
  additional_fields: z.array(additionalFieldSchema),
})

export const availabilitySchema = z.object({
  duration_minutes: z.number(),
  interval_minutes: z.number(),
  round_to_30_minutes: z.boolean(),
  participants: z.array(participantSchema),
})

export const configSchema = z.object({
  version: z.string(),
  booking_type: z.enum(['0', '1']),
  availability: availabilitySchema,
  event_booking: eventBookingSchema,
})

export type SchedulingConfig = z.infer<typeof configSchema>

export const schedulingConfig = {
  version: '1.0.0',
  availability: {
    duration_minutes: 30,
    interval_minutes: 15,
    round_to_30_minutes: true,
  },
  event_booking: {
    title: ':duration minute consultation with :participant_names',
    description: 'A :duration minute initial consultation meeting with :participant_names',
    type: 1, // 0 = "booking", 1 = "pre-booking"
  },
}
