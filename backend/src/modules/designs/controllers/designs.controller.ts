import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DesignsService } from '../services/designs.service';
import { CreateDesignDto } from '../dto/create-design.dto';
import { UpdateDesignDto } from '../dto/update-design.dto';
import { DesignStatus } from '../../../entities/design.entity';

@ApiTags('designs')
@UseGuards(JwtAuthGuard)
@Controller('designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new design' })
  @ApiResponse({ status: 201, description: 'Design created successfully' })
  create(@Body() createDesignDto: CreateDesignDto, @Request() req) {
    return this.designsService.create(createDesignDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all designs' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
  @ApiResponse({ status: 200, description: 'List of designs' })
  findAll(@Query('projectId') projectId?: string) {
    return this.designsService.findAll(projectId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get designs for a specific project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Designs for the project' })
  findByProject(@Param('projectId') projectId: string) {
    return this.designsService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get design by ID' })
  @ApiParam({ name: 'id', description: 'Design ID' })
  @ApiResponse({ status: 200, description: 'Design details' })
  findOne(@Param('id') id: string) {
    return this.designsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update design' })
  @ApiParam({ name: 'id', description: 'Design ID' })
  @ApiResponse({ status: 200, description: 'Design updated successfully' })
  update(@Param('id') id: string, @Body() updateDesignDto: UpdateDesignDto) {
    return this.designsService.update(id, updateDesignDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update design status' })
  @ApiParam({ name: 'id', description: 'Design ID' })
  @ApiResponse({ status: 200, description: 'Design status updated' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: DesignStatus,
  ) {
    return this.designsService.updateStatus(id, status);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a design' })
  @ApiParam({ name: 'id', description: 'Design ID to duplicate' })
  @ApiResponse({ status: 201, description: 'Design duplicated successfully' })
  duplicate(
    @Param('id') id: string,
    @Body('name') name?: string,
  ) {
    return this.designsService.duplicate(id, name);
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Export design data' })
  @ApiParam({ name: 'id', description: 'Design ID' })
  @ApiResponse({ status: 200, description: 'Design export data' })
  export(@Param('id') id: string) {
    return this.designsService.exportDesign(id);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import design data' })
  @ApiResponse({ status: 201, description: 'Design imported successfully' })
  import(@Body() importData: { projectId: string; designData: any }) {
    return this.designsService.importDesign(importData.projectId, importData.designData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete design' })
  @ApiParam({ name: 'id', description: 'Design ID' })
  @ApiResponse({ status: 204, description: 'Design deleted successfully' })
  remove(@Param('id') id: string) {
    return this.designsService.remove(id);
  }
}