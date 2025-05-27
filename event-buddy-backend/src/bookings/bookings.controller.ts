import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UsersService } from '../users/users.service'

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
        private readonly usersService: UsersService           

  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
 async create(@Body() dto: CreateBookingDto, @Request() req) {
  const user = await this.usersService.findById(req.user.userId)
    return this.bookingsService.create(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  myBookings(@Request() req) {
    console.log('Decoded JWT user:', req.user);
    return this.bookingsService.findByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllBookings(@Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Only admins can view all bookings' };
    }
    return this.bookingsService.findAll();
  }
}
