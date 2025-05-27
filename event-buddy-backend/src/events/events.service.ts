import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan ,LessThan} from 'typeorm';
import { Event } from './entity/event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepo: Repository<Event>
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const event = this.eventRepo.create(dto);
    return this.eventRepo.save(event);
  }

  async findUpcoming(): Promise<Event[]> {
    return this.eventRepo.find({
      where: { date: MoreThan(new Date()) },
      order: { date: 'ASC' },
    });
  }

  async findPast(): Promise<Event[]> {
  return this.eventRepo.find({
    where: { date: LessThan(new Date()) },
    order: { date: 'DESC' },
  });
}

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

 async update(id: number, dto: Partial<Event>): Promise<Event> {
  const event = await this.findOne(id); 

  if (!Object.keys(dto).length) {
    throw new BadRequestException('No update fields provided');
  }

  if (dto.date && typeof dto.date === 'string') {
    dto.date = new Date(dto.date);
  }

  const updated = this.eventRepo.merge(event, dto); 
  return this.eventRepo.save(updated); 
}



  async delete(id: number): Promise<void> {
    await this.eventRepo.delete(id);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepo.find();
  }


}
