import { Controller, Post, Body, UseGuards , Get, Req, Param } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { User } from '../../utils/decorators/user.decorator'
import { JwtAuthGuard } from 'src/utils/auth/jwt.auth.guard';
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}


    @UseGuards(JwtAuthGuard)
    @Post('new-document')
    addnewDocument(@Body() body: any,@User('sub') userId: number) {
      return this.documentService.addnewDocument(body,userId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('list-all')
    getItemServiceRates(@Req() req: any) {
      console.log("Fetching req.........:",req.user);
      return this.documentService.findAllDocuments(req.user.sub);
    }

     @UseGuards(JwtAuthGuard)
      @Get(':id')
      findOne(@Req() req: any,@Param('id') id: string) {
        return this.documentService.findOne(req.user.sub,Number(id));
      }

}
