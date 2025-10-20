import { Controller, Post, Body, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  @Get()
  async findAll() {
    return this.bookingsService.findAll();
  }

  @Post('reserve')
  async reserve(@Body() body: { event_id: number; user_id: string }) {
    return this.bookingsService.reserve(body.event_id, body.user_id);
  }
}
