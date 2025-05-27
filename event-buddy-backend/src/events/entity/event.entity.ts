// src/events/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from 'src/bookings/entity/booking.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  location: string;

  @Column()
  totalSeats: number;

  @Column({ default: 0 })
  bookedSeats: number;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}
