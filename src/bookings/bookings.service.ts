import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async reserve(event_id: number, user_id: string) {
    // Find event
    const event = await this.prisma.event.findUnique({
      where: { id: event_id },
      include: { bookings: true },
    });

    if (!event) throw new NotFoundException('Event not found');

    // Check if user already booked
    const existing = await this.prisma.booking.findUnique({
      where: {
        eventId_userId: { eventId: event_id, userId: user_id },
      },
    });

    if (existing)
      throw new BadRequestException('User already booked this event');

    // Check if seats available
    const bookedCount = await this.prisma.booking.count({
      where: { eventId: event_id },
    });

    if (bookedCount >= event.totalSeats) {
      throw new BadRequestException('No seats available');
    }

    // Create booking
    const booking = await this.prisma.booking.create({
      data: { eventId: event_id, userId: user_id },
    });

    return { message: 'Seat reserved successfully', booking };
  }
  async findAll() {
    const bookings = await this.prisma.booking.findMany();
    return {
      message: 'success',
      bookings,
    };
  }
}
