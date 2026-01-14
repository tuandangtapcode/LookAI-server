import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateSystemkeyDTO } from './dto/create-systemkey.dto'
import { InsertChildkeyDTO } from './dto/insert-child-key.dto'
import { SystemkeyService } from './systemkey.service'

@Controller('systemkey')
export class SystemkeyController {
  constructor(private readonly systemkeyService: SystemkeyService) {}

  @Post('create-systemkey')
  async createSystemkey(@Body() createSystemkeyDTO: CreateSystemkeyDTO) {
    return await this.systemkeyService.createSystemkey(createSystemkeyDTO)
  }

  @Get('get-list-systemkey')
  async getListSystemkey() {
    return await this.systemkeyService.getListSystemkey()
  }

  @Post('insert-childkey')
  async insertChildkey(@Body() insertChildkeyDTO: InsertChildkeyDTO) {
    return await this.systemkeyService.insertChildkey(insertChildkeyDTO)
  }
}
