import React from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Space, Divider, Typography, Tag } from 'antd';
import { useCanvasStore } from '../../hooks/useCanvasStore';
import { calculatePolygonArea } from '../../utils/geometry';

const { Title, Text } = Typography;
const { Option } = Select;

export const PropertyPanel: React.FC = () => {
  const { elements, selectedElements, grid, setGrid, measurements, setMeasurements } = useCanvasStore();

  const selectedElement = elements.find(el => selectedElements.includes(el.id));

  // Calculate project statistics
  const totalArea = elements
    .filter(el => el.type === 'room')
    .reduce((sum, room) => sum + room.area, 0);

  const wallCount = elements.filter(el => el.type === 'wall').length;
  const doorCount = elements.filter(el => el.type === 'door').length;
  const windowCount = elements.filter(el => el.type === 'window').length;
  const roomCount = elements.filter(el => el.type === 'room').length;

  return (
    <div>
      <Title level={4}>Properties</Title>

      {/* Project Statistics */}
      <Card title="Project Statistics" size="small" style={{ marginBottom: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Total Area:</Text>
            <Tag color="blue">{(totalArea / 1000000).toFixed(1)} m²</Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Rooms:</Text>
            <Tag color="green">{roomCount}</Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Walls:</Text>
            <Tag color="orange">{wallCount}</Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Doors:</Text>
            <Tag color="purple">{doorCount}</Tag>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Windows:</Text>
            <Tag color="cyan">{windowCount}</Tag>
          </div>
        </Space>
      </Card>

      {/* Selected Element Properties */}
      {selectedElement && (
        <Card title={`Selected: ${selectedElement.type}`} size="small" style={{ marginBottom: '16px' }}>
          <Form layout="vertical" size="small">
            <Form.Item label="ID">
              <Input value={selectedElement.id} disabled />
            </Form.Item>

            {selectedElement.type === 'wall' && (
              <>
                <Form.Item label="Wall Type">
                  <Select defaultValue={(selectedElement as any).wallType || 'interior'}>
                    <Option value="exterior">Exterior</Option>
                    <Option value="interior">Interior</Option>
                    <Option value="load_bearing">Load Bearing</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Thickness (mm)">
                  <InputNumber defaultValue={(selectedElement as any).thickness || 150} />
                </Form.Item>
                <Form.Item label="Material">
                  <Select defaultValue={(selectedElement as any).material || 'concrete'}>
                    <Option value="concrete">Concrete</Option>
                    <Option value="brick">Brick</Option>
                    <Option value="wood">Wood</Option>
                    <Option value="steel">Steel</Option>
                    <Option value="drywall">Drywall</Option>
                  </Select>
                </Form.Item>
              </>
            )}

            {selectedElement.type === 'door' && (
              <>
                <Form.Item label="Door Type">
                  <Select defaultValue={(selectedElement as any).type || 'single'}>
                    <Option value="single">Single</Option>
                    <Option value="double">Double</Option>
                    <Option value="sliding">Sliding</Option>
                    <Option value="folding">Folding</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Width (mm)">
                  <InputNumber defaultValue={(selectedElement as any).width || 800} />
                </Form.Item>
                <Form.Item label="Height (mm)">
                  <InputNumber defaultValue={(selectedElement as any).height || 2000} />
                </Form.Item>
                <Form.Item label="Direction (degrees)">
                  <InputNumber defaultValue={(selectedElement as any).direction || 0} />
                </Form.Item>
              </>
            )}

            {selectedElement.type === 'window' && (
              <>
                <Form.Item label="Window Type">
                  <Select defaultValue={(selectedElement as any).type || 'single'}>
                    <Option value="single">Single</Option>
                    <Option value="double">Double</Option>
                    <Option value="bay">Bay</Option>
                    <Option value="sliding">Sliding</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Width (mm)">
                  <InputNumber defaultValue={(selectedElement as any).width || 1200} />
                </Form.Item>
                <Form.Item label="Height (mm)">
                  <InputNumber defaultValue={(selectedElement as any).height || 1000} />
                </Form.Item>
              </>
            )}

            {selectedElement.type === 'room' && (
              <>
                <Form.Item label="Room Name">
                  <Input defaultValue={(selectedElement as any).name || 'Untitled Room'} />
                </Form.Item>
                <Form.Item label="Room Type">
                  <Select defaultValue={(selectedElement as any).type || 'other'}>
                    <Option value="bedroom">Bedroom</Option>
                    <Option value="bathroom">Bathroom</Option>
                    <Option value="kitchen">Kitchen</Option>
                    <Option value="living">Living Room</Option>
                    <Option value="dining">Dining Room</Option>
                    <Option value="office">Office</Option>
                    <Option value="storage">Storage</Option>
                    <Option value="garage">Garage</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Area">
                  <InputNumber
                    value={(selectedElement as any).area}
                    disabled
                    addonAfter="mm²"
                  />
                </Form.Item>
              </>
            )}

            {selectedElement.type === 'measurement' && (
              <>
                <Form.Item label="Label">
                  <Input defaultValue={(selectedElement as any).label} />
                </Form.Item>
                <Form.Item label="Value">
                  <InputNumber defaultValue={(selectedElement as any).value} />
                </Form.Item>
                <Form.Item label="Unit">
                  <Select defaultValue={(selectedElement as any).unit || 'mm'}>
                    <Option value="mm">Millimeters</Option>
                    <Option value="cm">Centimeters</Option>
                    <Option value="m">Meters</Option>
                    <Option value="inch">Inches</Option>
                    <Option value="ft">Feet</Option>
                  </Select>
                </Form.Item>
              </>
            )}
          </Form>
        </Card>
      )}

      {/* Canvas Settings */}
      <Card title="Canvas Settings" size="small" style={{ marginBottom: '16px' }}>
        <Form layout="vertical" size="small">
          <Form.Item label="Grid Size">
            <InputNumber
              value={grid.size}
              onChange={(value) => setGrid({ size: value || 20 })}
              min={5}
              max={100}
              step={5}
            />
          </Form.Item>
          <Form.Item label="Measurement Unit">
            <Select
              value={measurements.unit}
              onChange={(value) => setMeasurements({ unit: value })}
            >
              <Option value="mm">Millimeters</Option>
              <Option value="cm">Centimeters</Option>
              <Option value="m">Meters</Option>
              <Option value="inch">Inches</Option>
              <Option value="ft">Feet</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      {/* AI Recommendations */}
      <Card title="AI Recommendations" size="small">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="secondary">
            AI recommendations will appear here once you've created a basic layout.
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Start by drawing some walls to get personalized suggestions for your design.
          </Text>
        </div>
      </Card>
    </div>
  );
};