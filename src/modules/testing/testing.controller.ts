import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
    constructor(
        private readonly TestingService: TestingService
    ) { }

    @Delete('all-data')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAll() {
        await this.TestingService.deleteAll()
    }
}