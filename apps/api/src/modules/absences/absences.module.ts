import { Module } from '@nestjs/common';
import { AbsencesController } from './absences.controller';
@Module({ controllers: [AbsencesController] })
export class AbsencesModule {}
