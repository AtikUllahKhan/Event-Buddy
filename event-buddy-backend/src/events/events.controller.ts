import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { Event } from './entity/event.entity';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('upcoming')
  getUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @Get('past')
  getPast() {
    return this.eventsService.findPast();
  }

  @Get(':id')
  getEvent(@Param('id') id: number) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateEventDto, @Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Only admins can create events' };
    }
    return this.eventsService.create(dto);
  }

@Patch(':id')
@UseGuards(JwtAuthGuard)
async update(@Param('id') id: number, @Body() dto: UpdateEventDto, @Request() req) {
  if (req.user.role !== 'admin') {
    throw new ForbiddenException('Admins only');
  }

  const updateData: Partial<Event> = {
    ...dto,
    date: dto.date ? new Date(dto.date) : undefined,
  };

  return this.eventsService.update(+id, updateData);
}


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @Request() req) {
    if (req.user.role !== 'admin') {
      return { error: 'Only admins can delete events' };
    }
    return this.eventsService.delete(id);
  }
}
