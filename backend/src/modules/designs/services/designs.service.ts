import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Design, DesignStatus, DesignType } from '../../../entities/design.entity';
import { CreateDesignDto } from '../dto/create-design.dto';
import { UpdateDesignDto } from '../dto/update-design.dto';

@Injectable()
export class DesignsService {
  constructor(
    @InjectRepository(Design)
    private designRepository: Repository<Design>,
  ) {}

  async create(createDesignDto: CreateDesignDto): Promise<Design> {
    const design = this.designRepository.create({
      ...createDesignDto,
      status: DesignStatus.DRAFT,
      version: 1,
    });

    // Calculate total area from canvas data
    if (createDesignDto.canvasData?.rooms) {
      design.totalArea = createDesignDto.canvasData.rooms.reduce(
        (sum, room) => sum + (room.area || 0),
        0
      );
    }

    return await this.designRepository.save(design);
  }

  async findAll(projectId?: string): Promise<Design[]> {
    const queryBuilder = this.designRepository
      .createQueryBuilder('design')
      .leftJoinAndSelect('design.project', 'project')
      .leftJoinAndSelect('design.recommendations', 'recommendations')
      .orderBy('design.updatedAt', 'DESC');

    if (projectId) {
      queryBuilder.where('design.projectId = :projectId', { projectId });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Design> {
    const design = await this.designRepository.findOne({
      where: { id },
      relations: ['project', 'recommendations'],
    });

    if (!design) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }

    return design;
  }

  async update(id: string, updateDesignDto: UpdateDesignDto): Promise<Design> {
    const design = await this.findOne(id);

    // Update version if canvas data changes
    if (updateDesignDto.canvasData &&
        JSON.stringify(updateDesignDto.canvasData) !== JSON.stringify(design.canvasData)) {
      updateDesignDto.version = design.version + 1;
    }

    // Recalculate area if rooms are updated
    if (updateDesignDto.canvasData?.rooms) {
      updateDesignDto.totalArea = updateDesignDto.canvasData.rooms.reduce(
        (sum, room) => sum + (room.area || 0),
        0
      );
    }

    Object.assign(design, updateDesignDto);
    return await this.designRepository.save(design);
  }

  async duplicate(id: string, name?: string): Promise<Design> {
    const originalDesign = await this.findOne(id);

    const duplicatedDesign = this.designRepository.create({
      name: name || `${originalDesign.name} (Copy)`,
      description: originalDesign.description,
      type: originalDesign.type,
      status: DesignStatus.DRAFT,
      canvasData: { ...originalDesign.canvasData },
      model3dData: originalDesign.model3dData ? { ...originalDesign.model3dData } : null,
      totalArea: originalDesign.totalArea,
      perimeter: originalDesign.perimeter,
      ceilingHeight: originalDesign.ceilingHeight,
      rooms: originalDesign.rooms ? [...originalDesign.rooms] : null,
      materials: originalDesign.materials ? { ...originalDesign.materials } : null,
      projectId: originalDesign.projectId,
      version: 1,
      parentDesignId: originalDesign.id,
    });

    return await this.designRepository.save(duplicatedDesign);
  }

  async remove(id: string): Promise<void> {
    const design = await this.findOne(id);
    await this.designRepository.remove(design);
  }

  async updateStatus(id: string, status: DesignStatus): Promise<Design> {
    const design = await this.findOne(id);
    design.status = status;
    return await this.designRepository.save(design);
  }

  async findByProject(projectId: string): Promise<Design[]> {
    return await this.designRepository.find({
      where: { projectId },
      relations: ['recommendations'],
      order: { updatedAt: 'DESC' },
    });
  }

  async exportDesign(id: string): Promise<any> {
    const design = await this.findOne(id);

    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      design: {
        id: design.id,
        name: design.name,
        type: design.type,
        canvasData: design.canvasData,
        model3dData: design.model3dData,
        measurements: {
          totalArea: design.totalArea,
          perimeter: design.perimeter,
          ceilingHeight: design.ceilingHeight,
        },
        rooms: design.rooms,
        materials: design.materials,
      },
      metadata: {
        version: design.version,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
        status: design.status,
      },
    };
  }

  async importDesign(projectId: string, designData: any): Promise<Design> {
    try {
      const design = this.designRepository.create({
        name: designData.design?.name || 'Imported Design',
        description: 'Imported from external file',
        type: designData.design?.type || DesignType.FLOOR_PLAN_2D,
        status: DesignStatus.DRAFT,
        canvasData: designData.design?.canvasData || { elements: [], viewport: { x: 0, y: 0, zoom: 1 } },
        model3dData: designData.design?.model3dData || null,
        totalArea: designData.design?.measurements?.totalArea || 0,
        perimeter: designData.design?.measurements?.perimeter || 0,
        ceilingHeight: designData.design?.measurements?.ceilingHeight || 2800,
        rooms: designData.design?.rooms || null,
        materials: designData.design?.materials || null,
        projectId,
        version: 1,
      });

      return await this.designRepository.save(design);
    } catch (error) {
      throw new BadRequestException('Invalid design data format');
    }
  }
}