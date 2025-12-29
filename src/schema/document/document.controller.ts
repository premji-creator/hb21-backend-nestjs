import { Controller, Post, Body } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  create(@Body() body: CreateDocumentDto): Promise<any> {
    return this.documentService.createDocument(body);
  }
}
