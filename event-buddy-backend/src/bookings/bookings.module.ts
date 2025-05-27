import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Event } from '../events/entity/event.entity';
import { User } from 'src/users/entity/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Event,User]),UsersModule],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
