import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entity/booking.entity';
import { Event } from '../events/entity/event.entity';
import { User } from '../users/entity/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    @InjectRepository(User)
    private userRepo: Repository<User>

  ) {}

async create(dto: CreateBookingDto, user: User): Promise<Booking> {
    const event = await this.eventRepo.findOne({ where: { id: dto.eventId } })
    if (!event) throw new NotFoundException('Event not found')

    if (new Date(event.date) < new Date()) {
      throw new BadRequestException('Cannot book past events')
    }

    if (dto.seats < 1 || dto.seats > 4) {
      throw new BadRequestException('You can only book between 1 and 4 seats')
    }

    const availableSeats = event.totalSeats - event.bookedSeats
    if (dto.seats > availableSeats) {
      throw new BadRequestException('Not enough seats available')
    }

    event.bookedSeats += dto.seats
    await this.eventRepo.save(event)

    const booking = this.bookingRepo.create({
      seats: dto.seats,
      user: user,
      event: event,
    })

    return this.bookingRepo.save(booking)
  }


  async findByUser(userId: number): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['event'], 

      order: { id: 'DESC' },
    });
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepo.find();
  }
}
